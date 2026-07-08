from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
JWT_SECRET = os.environ['JWT_SECRET']
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------------- Models ----------------
class RegisterInput(BaseModel):
    name: str
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

class ReservationInput(BaseModel):
    date: str
    time: str
    guests: int
    zone: str  # indoor / outdoor / sea_view / lounge
    table_id: Optional[str] = None
    name: Optional[str] = None

class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    qty: int
    image: Optional[str] = None

class OrderInput(BaseModel):
    items: List[CartItem]
    total: float
    type: str = "dine_in"  # dine_in / boutique / qr
    table_id: Optional[str] = None

class AssistantInput(BaseModel):
    preferences: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


# ---------------- Auth helpers ----------------
def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_pw(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())

def make_token(uid: str, role: str) -> str:
    payload = {"uid": uid, "role": role, "exp": datetime.now(timezone.utc) + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["uid"]})
    if not user:
        raise HTTPException(401, "User not found")
    user.pop("_id", None)
    user.pop("password", None)
    return user


# ---------------- Auth routes ----------------
@api_router.post("/auth/register")
async def register(inp: RegisterInput):
    existing = await db.users.find_one({"email": inp.email.lower()})
    if existing:
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid, "name": inp.name, "email": inp.email.lower(),
        "password": hash_pw(inp.password), "role": "customer",
        "loyalty_points": 120, "loyalty_tier": "Bronze",
        "phone": "", "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    token = make_token(uid, "customer")
    doc.pop("_id", None); doc.pop("password", None)
    return {"token": token, "user": doc}

@api_router.post("/auth/login")
async def login(inp: LoginInput):
    user = await db.users.find_one({"email": inp.email.lower()})
    if not user or not verify_pw(inp.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    token = make_token(user["id"], user["role"])
    user.pop("_id", None); user.pop("password", None)
    return {"token": token, "user": user}

@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user

@api_router.put("/auth/profile")
async def update_profile(inp: ProfileUpdate, user=Depends(get_current_user)):
    upd = {k: v for k, v in inp.dict().items() if v is not None}
    if upd:
        await db.users.update_one({"id": user["id"]}, {"$set": upd})
    updated = await db.users.find_one({"id": user["id"]})
    updated.pop("_id", None); updated.pop("password", None)
    return updated


# ---------------- Catalog routes ----------------
@api_router.get("/menu")
async def get_menu(category: Optional[str] = None):
    q = {"category": category} if category else {}
    items = await db.menu.find(q).to_list(500)
    for i in items:
        i.pop("_id", None)
    return items

@api_router.get("/menu/{item_id}")
async def get_menu_item(item_id: str):
    item = await db.menu.find_one({"id": item_id})
    if not item:
        raise HTTPException(404, "Not found")
    item.pop("_id", None)
    return item

@api_router.get("/products")
async def get_products(category: Optional[str] = None):
    q = {"category": category} if category else {}
    items = await db.products.find(q).to_list(500)
    for i in items:
        i.pop("_id", None)
    return items

@api_router.get("/products/{pid}")
async def get_product(pid: str):
    item = await db.products.find_one({"id": pid})
    if not item:
        raise HTTPException(404, "Not found")
    item.pop("_id", None)
    return item

@api_router.get("/events")
async def get_events():
    items = await db.events.find().to_list(200)
    for i in items:
        i.pop("_id", None)
    return items

@api_router.get("/tables")
async def get_tables():
    items = await db.tables.find().to_list(200)
    for i in items:
        i.pop("_id", None)
    return items

@api_router.get("/music")
async def get_music():
    items = await db.music.find().to_list(200)
    for i in items:
        i.pop("_id", None)
    return items


# ---------------- Reservations & Orders ----------------
@api_router.post("/reservations")
async def create_reservation(inp: ReservationInput, user=Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), "user_id": user["id"], "user_name": user["name"],
           **inp.dict(), "status": "confirmed", "created_at": now_iso()}
    await db.reservations.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.get("/reservations")
async def list_reservations(user=Depends(get_current_user)):
    q = {} if user["role"] == "admin" else {"user_id": user["id"]}
    items = await db.reservations.find(q).sort("created_at", -1).to_list(200)
    for i in items:
        i.pop("_id", None)
    return items

@api_router.post("/orders")
async def create_order(inp: OrderInput, user=Depends(get_current_user)):
    points = int(inp.total)
    doc = {"id": str(uuid.uuid4()), "user_id": user["id"], "user_name": user["name"],
           "items": [i.dict() for i in inp.items], "total": inp.total, "type": inp.type,
           "table_id": inp.table_id, "status": "paid", "points_earned": points,
           "created_at": now_iso()}
    await db.orders.insert_one(doc)
    # update loyalty
    newpts = user.get("loyalty_points", 0) + points
    tier = "Bronze"
    if newpts >= 3000: tier = "Royal"
    elif newpts >= 1500: tier = "Gold"
    elif newpts >= 600: tier = "Silver"
    await db.users.update_one({"id": user["id"]}, {"$set": {"loyalty_points": newpts, "loyalty_tier": tier}})
    doc.pop("_id", None)
    return {"order": doc, "loyalty_points": newpts, "loyalty_tier": tier}

@api_router.get("/orders")
async def list_orders(user=Depends(get_current_user)):
    q = {} if user["role"] == "admin" else {"user_id": user["id"]}
    items = await db.orders.find(q).sort("created_at", -1).to_list(200)
    for i in items:
        i.pop("_id", None)
    return items


# ---------------- AI Assistant ----------------
@api_router.post("/assistant")
async def assistant(inp: AssistantInput):
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        menu_items = await db.menu.find().to_list(200)
        names = ", ".join([f"{m['name']} ({m['category']})" for m in menu_items[:40]])
        sys = ("You are the personal concierge of LE MARRAKECHI, a 5-star luxury Moroccan rooftop "
               "tea salon in Sohar, Oman, with direct sea views. Act like a refined hotel concierge. "
               "When a guest describes an occasion (birthday, romantic, business, family, sunset...), "
               "recommend: (1) 2-3 drinks/desserts from our menu, (2) an ideal table & seating zone "
               "(Sea View, Lounge, Outdoor, Indoor) with a suggested time, and (3) a signature platter. "
               f"Our menu includes: {names}. Reply warmly in the SAME language as the guest "
               "(Arabic, English or French). Keep it under 130 words, elegant, and mention item names.")
        chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id=str(uuid.uuid4()),
                       system_message=sys).with_model("openai", "gpt-5.5")
        reply = await chat.send_message(UserMessage(text=inp.preferences))
        return {"reply": reply}
    except Exception as e:
        logger.error(f"assistant error: {e}")
        return {"reply": "Nous vous recommandons notre Thé à la Menthe Royal accompagné de Cornes de Gazelle, ou un Café Marrakchi épicé avec des Chebakia. مذاق أصيل يسعدك."}


# ---------------- Admin analytics ----------------
@api_router.get("/admin/analytics")
async def analytics(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Forbidden")
    orders = await db.orders.find().to_list(2000)
    revenue = sum(o.get("total", 0) for o in orders)
    reservations = await db.reservations.count_documents({})
    customers = await db.users.count_documents({"role": "customer"})
    products = await db.products.count_documents({})
    # sales by category
    cat = {}
    for o in orders:
        for it in o.get("items", []):
            cat[it.get("name", "?")] = cat.get(it.get("name", "?"), 0) + it.get("qty", 1)
    top = sorted(cat.items(), key=lambda x: -x[1])[:5]
    return {"revenue": round(revenue, 2), "orders": len(orders), "reservations": reservations,
            "customers": customers, "products": products,
            "top_items": [{"name": k, "qty": v} for k, v in top]}

@api_router.get("/admin/customers")
async def admin_customers(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Forbidden")
    items = await db.users.find({"role": "customer"}).to_list(500)
    for i in items:
        i.pop("_id", None); i.pop("password", None)
    return items


# ---------------- Seed ----------------
@api_router.post("/seed")
async def seed():
    from seed_data import MENU, PRODUCTS, EVENTS, TABLES, MUSIC
    await db.menu.delete_many({}); await db.menu.insert_many([dict(m) for m in MENU])
    await db.products.delete_many({}); await db.products.insert_many([dict(m) for m in PRODUCTS])
    await db.events.delete_many({}); await db.events.insert_many([dict(m) for m in EVENTS])
    await db.tables.delete_many({}); await db.tables.insert_many([dict(m) for m in TABLES])
    await db.music.delete_many({}); await db.music.insert_many([dict(m) for m in MUSIC])
    # admin user
    if not await db.users.find_one({"email": "admin@lemarrakechi.com"}):
        await db.users.insert_one({"id": str(uuid.uuid4()), "name": "Admin",
            "email": "admin@lemarrakechi.com", "password": hash_pw("admin123"),
            "role": "admin", "loyalty_points": 0, "loyalty_tier": "Royal",
            "phone": "", "created_at": now_iso()})
    return {"status": "seeded", "menu": len(MENU), "products": len(PRODUCTS)}


app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
