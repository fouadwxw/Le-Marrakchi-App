import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { storage } from "@/src/utils/storage";
import { dark, light, Theme } from "@/src/theme";
import { api } from "@/src/api";

/* ---------------- i18n ---------------- */
type Lang = "ar" | "en" | "fr";
const STR: Record<string, Record<Lang, string>> = {
  brand: { ar: "لو مراكشي", en: "LE MARRAKECHI", fr: "LE MARRAKECHI" },
  tagline: { ar: "صالون شاي مغربي فاخر · صحار", en: "Luxury Moroccan Tea Salon · Sohar", fr: "Salon de Thé Marocain · Sohar" },
  home: { ar: "الرئيسية", en: "Home", fr: "Accueil" },
  menu: { ar: "القائمة", en: "Menu", fr: "Menu" },
  boutique: { ar: "البوتيك", en: "Boutique", fr: "Boutique" },
  reserve: { ar: "الحجز", en: "Reserve", fr: "Réserver" },
  profile: { ar: "حسابي", en: "Profile", fr: "Profil" },
  quick_book: { ar: "حجز سريع", en: "Quick Booking", fr: "Réservation" },
  events: { ar: "الفعاليات", en: "Events", fr: "Événements" },
  loyalty: { ar: "برنامج الولاء", en: "Loyalty", fr: "Fidélité" },
  assistant: { ar: "المساعد الذكي", en: "AI Concierge", fr: "Concierge IA" },
  live: { ar: "بث مباشر", en: "Live Rooftop", fr: "Direct" },
  music: { ar: "الموسيقى", en: "Music", fr: "Musique" },
  qr: { ar: "طلب عبر QR", en: "QR Order", fr: "Commande QR" },
  add_cart: { ar: "أضف إلى السلة", en: "Add to Cart", fr: "Ajouter au panier" },
  ingredients: { ar: "المكونات", en: "Ingredients", fr: "Ingrédients" },
  allergens: { ar: "مسببات الحساسية", en: "Allergens", fr: "Allergènes" },
  description: { ar: "الوصف", en: "Description", fr: "Description" },
  cart: { ar: "السلة", en: "Cart", fr: "Panier" },
  checkout: { ar: "الدفع", en: "Checkout", fr: "Paiement" },
  total: { ar: "المجموع", en: "Total", fr: "Total" },
  pay_now: { ar: "ادفع الآن", en: "Pay Now", fr: "Payer" },
  date: { ar: "التاريخ", en: "Date", fr: "Date" },
  time: { ar: "الوقت", en: "Time", fr: "Heure" },
  guests: { ar: "عدد الضيوف", en: "Guests", fr: "Convives" },
  zone: { ar: "المنطقة", en: "Seating", fr: "Espace" },
  confirm: { ar: "تأكيد الحجز", en: "Confirm Booking", fr: "Confirmer" },
  indoor: { ar: "داخلية", en: "Indoor", fr: "Intérieur" },
  outdoor: { ar: "خارجية", en: "Outdoor", fr: "Extérieur" },
  sea_view: { ar: "إطلالة البحر", en: "Sea View", fr: "Vue Mer" },
  lounge: { ar: "لاونج", en: "Lounge", fr: "Lounge" },
  table_map: { ar: "خريطة الطاولات", en: "Table Map", fr: "Plan des tables" },
  login: { ar: "تسجيل الدخول", en: "Login", fr: "Connexion" },
  register: { ar: "إنشاء حساب", en: "Register", fr: "Inscription" },
  logout: { ar: "تسجيل الخروج", en: "Logout", fr: "Déconnexion" },
  name: { ar: "الاسم", en: "Name", fr: "Nom" },
  email: { ar: "البريد الإلكتروني", en: "Email", fr: "Email" },
  password: { ar: "كلمة المرور", en: "Password", fr: "Mot de passe" },
  points: { ar: "نقاط", en: "points", fr: "points" },
  order_placed: { ar: "تم تأكيد الطلب!", en: "Order confirmed!", fr: "Commande confirmée !" },
  empty_cart: { ar: "سلتك فارغة", en: "Your cart is empty", fr: "Panier vide" },
  admin: { ar: "لوحة التحكم", en: "Admin Panel", fr: "Admin" },
  explore_menu: { ar: "تصفح القائمة", en: "Explore Menu", fr: "Voir le menu" },
  ask_placeholder: { ar: "أخبرنا بذوقك...", en: "Tell us your taste...", fr: "Vos préférences..." },
  send: { ar: "إرسال", en: "Send", fr: "Envoyer" },
  dark_mode: { ar: "الوضع الداكن", en: "Dark Mode", fr: "Mode sombre" },
  language: { ar: "اللغة", en: "Language", fr: "Langue" },
  my_orders: { ar: "طلباتي", en: "My Orders", fr: "Mes commandes" },
  my_reservations: { ar: "حجوزاتي", en: "My Reservations", fr: "Réservations" },
  story: { ar: "القصة", en: "The Story", fr: "L'Histoire" },
  packaging: { ar: "التغليف", en: "Packaging", fr: "Emballage" },
  gift_idea: { ar: "فكرة هدية", en: "Gift Idea", fr: "Idée cadeau" },
  ambiance: { ar: "الأجواء", en: "Ambiance", fr: "Ambiance" },
  ambiance_sub: { ar: "اختر أجواءك ودعنا نقترح لك", en: "Choose your mood, we'll suggest", fr: "Choisissez votre ambiance" },
  suggested: { ar: "اقتراحنا لك", en: "Our Suggestion", fr: "Notre suggestion" },
  book_this: { ar: "احجز هذه التجربة", en: "Book this experience", fr: "Réserver" },
  playlists: { ar: "قوائم التشغيل", en: "Playlists", fr: "Playlists" },
  albums: { ar: "الألبومات", en: "Albums", fr: "Albums" },
  usb_collector: { ar: "مجموعة USB", en: "USB Collector", fr: "USB Collector" },
  now_playing: { ar: "قيد التشغيل", en: "Now Playing", fr: "En lecture" },
};
const CATS: Record<string, Record<Lang, string>> = {
  coffee: { ar: "القهوة", en: "Coffee", fr: "Café" },
  tea: { ar: "الشاي المغربي", en: "Moroccan Tea", fr: "Thé" },
  juices: { ar: "العصائر", en: "Juices", fr: "Jus" },
  mocktails: { ar: "الموكتيلات", en: "Mocktails", fr: "Mocktails" },
  breakfast: { ar: "الإفطار", en: "Breakfast", fr: "Petit-déj" },
  sweets: { ar: "الحلويات", en: "Sweets", fr: "Douceurs" },
  food: { ar: "المأكولات", en: "Food", fr: "Plats" },
  perfume: { ar: "العطور", en: "Perfumes", fr: "Parfums" },
  candles: { ar: "الشموع", en: "Candles", fr: "Bougies" },
  gift: { ar: "الهدايا", en: "Gift Boxes", fr: "Coffrets" },
  teapot: { ar: "الأباريق", en: "Teapots", fr: "Théières" },
  cups: { ar: "الكؤوس", en: "Glasses", fr: "Verres" },
};

/* ---------------- App Context ---------------- */
type Ctx = {
  lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; catName: (c: string) => string; isRTL: boolean;
  theme: Theme; isDark: boolean; toggleDark: () => void;
  user: any; token: string | null; login: (e: string, p: string) => Promise<void>;
  register: (n: string, e: string, p: string) => Promise<void>; logout: () => void; refreshUser: () => Promise<void>;
  cart: any[]; addToCart: (i: any) => void; removeFromCart: (id: string) => void; setQty: (id: string, q: number) => void;
  clearCart: () => void; cartTotal: number; cartCount: number;
};
const AppCtx = createContext<Ctx>({} as Ctx);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const l = await storage.getItem<string>("lang", "ar");
      const d = await storage.getItem<boolean>("dark", true);
      const tk = await storage.secureGet<string>("token", "");
      setLangState((l as Lang) || "ar");
      setIsDark(d ?? true);
      if (tk) { setToken(tk); try { setUser(await api.get("/auth/me")); } catch {} }
      setReady(true);
    })();
  }, []);

  const setLang = (l: Lang) => { setLangState(l); storage.setItem("lang", l); };
  const toggleDark = () => { setIsDark((v) => { storage.setItem("dark", !v); return !v; }); };
  const t = useCallback((k: string) => STR[k]?.[lang] ?? k, [lang]);
  const catName = useCallback((c: string) => CATS[c]?.[lang] ?? c, [lang]);

  const login = async (email: string, password: string) => {
    const r = await api.post("/auth/login", { email, password });
    await storage.secureSet("token", r.token); setToken(r.token); setUser(r.user);
  };
  const register = async (name: string, email: string, password: string) => {
    const r = await api.post("/auth/register", { name, email, password });
    await storage.secureSet("token", r.token); setToken(r.token); setUser(r.user);
  };
  const logout = async () => { await storage.secureRemove("token"); setToken(null); setUser(null); };
  const refreshUser = async () => { try { setUser(await api.get("/auth/me")); } catch {} };

  const addToCart = (item: any) => setCart((c) => {
    const ex = c.find((x) => x.product_id === item.product_id);
    if (ex) return c.map((x) => x.product_id === item.product_id ? { ...x, qty: x.qty + 1 } : x);
    return [...c, { ...item, qty: 1 }];
  });
  const removeFromCart = (id: string) => setCart((c) => c.filter((x) => x.product_id !== id));
  const setQty = (id: string, q: number) => setCart((c) => q <= 0 ? c.filter((x) => x.product_id !== id) : c.map((x) => x.product_id === id ? { ...x, qty: q } : x));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const value: Ctx = {
    lang, setLang, t, catName, isRTL: lang === "ar",
    theme: isDark ? dark : light, isDark, toggleDark,
    user, token, login, register, logout, refreshUser,
    cart, addToCart, removeFromCart, setQty, clearCart, cartTotal, cartCount,
  };
  if (!ready) return null;
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
