"""Backend API tests for LE MARRAKECHI."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', 'https://marrakechi-sohar.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@lemarrakechi.com"
ADMIN_PASSWORD = "admin123"

# Shared state across tests
STATE = {}


@pytest.fixture(scope="session")
def s():
    return requests.Session()


# --------- Seed / catalog ---------
def test_01_seed(s):
    r = s.post(f"{API}/seed", timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("status") == "seeded"
    assert data.get("menu", 0) > 0
    assert data.get("products", 0) > 0


def test_02_menu_all(s):
    r = s.get(f"{API}/menu")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 10
    # verify no _id leaked
    assert all("_id" not in i for i in items)
    STATE["menu_id"] = items[0]["id"]


def test_03_menu_category_tea(s):
    r = s.get(f"{API}/menu", params={"category": "tea"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1
    assert all(i["category"] == "tea" for i in items)


def test_04_menu_item_detail(s):
    r = s.get(f"{API}/menu/{STATE['menu_id']}")
    assert r.status_code == 200
    body = r.json()
    for k in ("id", "name", "price", "category"):
        assert k in body


def test_05_products_list_and_story(s):
    r = s.get(f"{API}/products")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 5
    STATE["product_id"] = items[0]["id"]
    # storytelling fields must be present per requirement
    assert "story" in items[0]
    assert "gift_ar" in items[0]


def test_06_product_detail(s):
    r = s.get(f"{API}/products/{STATE['product_id']}")
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == STATE["product_id"]
    assert "story" in body and "packaging" in body


def test_07_events(s):
    r = s.get(f"{API}/events")
    assert r.status_code == 200 and len(r.json()) >= 1


def test_08_tables(s):
    r = s.get(f"{API}/tables")
    assert r.status_code == 200
    tables = r.json()
    assert len(tables) >= 4
    zones = {t["zone"] for t in tables}
    assert {"sea_view", "outdoor", "lounge", "indoor"}.issubset(zones)


def test_09_music_five_tracks(s):
    r = s.get(f"{API}/music")
    assert r.status_code == 200
    tracks = r.json()
    assert len(tracks) == 5


# --------- Auth ---------
def test_10_admin_login(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    body = r.json()
    assert "token" in body and body["user"]["role"] == "admin"
    STATE["admin_token"] = body["token"]


def test_11_customer_register(s):
    email = f"TEST_user_{uuid.uuid4().hex[:8]}@lemarrakechi.com"
    r = s.post(f"{API}/auth/register", json={"name": "Test User", "email": email, "password": "pass1234"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["user"]["role"] == "customer"
    assert body["user"]["loyalty_tier"] == "Bronze"
    STATE["cust_token"] = body["token"]
    STATE["cust_email"] = email.lower()
    STATE["cust_id"] = body["user"]["id"]


def test_12_customer_login(s):
    r = s.post(f"{API}/auth/login", json={"email": STATE["cust_email"], "password": "pass1234"})
    assert r.status_code == 200


def test_13_auth_me(s):
    h = {"Authorization": f"Bearer {STATE['cust_token']}"}
    r = s.get(f"{API}/auth/me", headers=h)
    assert r.status_code == 200
    assert r.json()["email"] == STATE["cust_email"]


def test_14_auth_me_no_token(s):
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


# --------- Reservations ---------
def test_15_reservation_requires_auth(s):
    r = s.post(f"{API}/reservations", json={"date": "2026-08-01", "time": "19:00", "guests": 2, "zone": "sea_view"})
    assert r.status_code == 401


def test_16_reservation_create_and_list(s):
    h = {"Authorization": f"Bearer {STATE['cust_token']}"}
    payload = {"date": "2026-08-15", "time": "20:00", "guests": 2, "zone": "sea_view", "table_id": "t1"}
    r = s.post(f"{API}/reservations", json=payload, headers=h)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "confirmed" and body["zone"] == "sea_view"
    # GET back
    r2 = s.get(f"{API}/reservations", headers=h)
    assert r2.status_code == 200
    assert any(x.get("zone") == "sea_view" for x in r2.json())


# --------- Orders + loyalty ---------
def test_17_order_creates_and_updates_loyalty(s):
    h = {"Authorization": f"Bearer {STATE['cust_token']}"}
    # get initial points
    me0 = s.get(f"{API}/auth/me", headers=h).json()
    initial = me0.get("loyalty_points", 0)
    payload = {
        "items": [{"product_id": "m4", "name": "Thé à la Menthe Royal", "price": 3.5, "qty": 2}],
        "total": 7.0, "type": "dine_in"
    }
    r = s.post(f"{API}/orders", json=payload, headers=h)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["loyalty_points"] >= initial + 7
    assert body["loyalty_tier"] in ("Bronze", "Silver", "Gold", "Royal")
    # list
    r2 = s.get(f"{API}/orders", headers=h)
    assert r2.status_code == 200 and len(r2.json()) >= 1


# --------- Assistant ---------
def test_18_assistant_returns_reply(s):
    r = s.post(f"{API}/assistant", json={"preferences": "Romantic dinner for two at sunset"}, timeout=60)
    assert r.status_code == 200
    assert isinstance(r.json().get("reply"), str) and len(r.json()["reply"]) > 5


# --------- Admin analytics ---------
def test_19_admin_analytics_forbidden_for_customer(s):
    h = {"Authorization": f"Bearer {STATE['cust_token']}"}
    r = s.get(f"{API}/admin/analytics", headers=h)
    assert r.status_code == 403


def test_20_admin_analytics_ok(s):
    h = {"Authorization": f"Bearer {STATE['admin_token']}"}
    r = s.get(f"{API}/admin/analytics", headers=h)
    assert r.status_code == 200
    b = r.json()
    for k in ("revenue", "orders", "reservations", "customers", "products", "top_items"):
        assert k in b


def test_21_admin_customers_forbidden(s):
    h = {"Authorization": f"Bearer {STATE['cust_token']}"}
    r = s.get(f"{API}/admin/customers", headers=h)
    assert r.status_code == 403


def test_22_admin_customers_ok(s):
    h = {"Authorization": f"Bearer {STATE['admin_token']}"}
    r = s.get(f"{API}/admin/customers", headers=h)
    assert r.status_code == 200
    customers = r.json()
    assert isinstance(customers, list)
    assert all("password" not in c and "_id" not in c for c in customers)
