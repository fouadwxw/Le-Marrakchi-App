# LE MARRAKECHI — PRD

## Original Problem Statement
Luxury trilingual (AR/EN/FR) mobile app for "LE MARRAKECHI", a premium Moroccan rooftop tea salon
with direct sea views in Sohar, Oman. Moroccan-inspired luxury design (beige, gold, dark wood,
emerald, copper, zellige) with dark mode. 18 feature areas incl. splash, home (sea video), digital
menu, product detail, table reservation, interactive table map, QR ordering, cart, secure checkout,
profile, 4-tier loyalty, boutique, music player, events, AI assistant, live rooftop, admin dashboard.

## Architecture
- Frontend: Expo Router (React Native), reanimated animations, expo-video/expo-audio, i18n + theme
  context (AR default/RTL), gold/bronze/ivory/deep-emerald luxury palette, dark mode.
- Backend: FastAPI + MongoDB (motor). JWT auth (bcrypt). Emergent Universal LLM key (GPT-5.5) for
  AI concierge with graceful fallback.
- Data seeded automatically & idempotently on app load (POST /api/seed).

## User Choices (defaults applied)
AI: GPT-5.5 · Auth: JWT (customer + admin) · Payment: mock UI (real order created) · Video/Live: sample.

## Implemented (2026-07-02)
- Splash with luxury animation; Tab nav (Home, Menu, Boutique, Music, Reserve, Profile).
- Home: sea video hero, quick book/menu, quick-access, Ambiance CTA, gold loyalty banner, events & boutique rails.
- Menu (7 categories) with staggered animations; product detail (desc/ingredients/allergens/price/add-to-cart).
- Boutique with luxury storytelling (story/packaging/gift), cart, mock secure checkout, loyalty accrual.
- Reservation (date/time/guests/4 zones) + interactive table map + QR order screen.
- 4-tier loyalty (Bronze/Silver/Gold/Royal) with progress; profile (lang switch, dark mode, orders, reservations).
- Music tab: now-playing player, playlists, albums, USB collector.
- Ambiance concierge (6 moods → suggested table/zone/time/signature); AI assistant chat.
- Live Rooftop: live video + weather/sunset stats + reserve CTA. Events page.
- Admin dashboard: analytics (revenue/orders/bookings/customers/top-selling), reservations, orders, customers.
- Testing: backend 22/22 pass; all frontend flows verified.

## Credentials
Admin: admin@lemarrakechi.com / admin123 · Customer: register via /auth.

## Backlog
- P1: Real payment (Stripe/PayPal), real live-stream RTSP/HLS ingest, employee management + product CRUD in admin.
- P1: Push notifications (requires deploy + build + Firebase google-services.json).
- P2: Full RTL mirroring, order status tracking, gift-wrapping checkout option, multi-currency.

## Next Tasks
Add employee management & product/menu CRUD to admin; wire real payment when keys provided.
