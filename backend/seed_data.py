# Sample data for LE MARRAKECHI
def img(q):
    return f"https://images.unsplash.com/{q}?w=800&q=80&auto=format&fit=crop"

MENU = [
    # Coffee
    {"id": "m1", "category": "coffee", "name": "Café Marrakchi", "name_ar": "قهوة مراكشية", "price": 2.5,
     "image": img("photo-1509042239860-f550ce710b93"), "desc": "Spiced Moroccan coffee with cardamom and cinnamon.",
     "ingredients": ["Arabica", "Cardamom", "Cinnamon", "Nutmeg"], "allergens": ["None"]},
    {"id": "m2", "category": "coffee", "name": "Nous-Nous", "name_ar": "نص نص", "price": 2.2,
     "image": img("photo-1541167760496-1628856ab772"), "desc": "Half espresso, half steamed milk, Moroccan style.",
     "ingredients": ["Espresso", "Steamed milk"], "allergens": ["Milk"]},
    {"id": "m3", "category": "coffee", "name": "Cappuccino Royal", "name_ar": "كابتشينو رويال", "price": 3.0,
     "image": img("photo-1572442388796-11668a67e53d"), "desc": "Velvety cappuccino topped with gold dust.",
     "ingredients": ["Espresso", "Milk foam", "Edible gold"], "allergens": ["Milk"]},
    # Moroccan tea
    {"id": "m4", "category": "tea", "name": "Thé à la Menthe Royal", "name_ar": "أتاي بالنعناع الملكي", "price": 3.5,
     "image": img("photo-1544787219-7f47ccb76574"), "desc": "Signature green tea with fresh mint & pine nuts.",
     "ingredients": ["Green tea", "Fresh mint", "Sugar", "Pine nuts"], "allergens": ["Nuts"]},
    {"id": "m5", "category": "tea", "name": "Thé Safran & Rose", "name_ar": "شاي الزعفران والورد", "price": 4.0,
     "image": img("photo-1597481499750-3e6b22637e12"), "desc": "Delicate saffron tea infused with rose petals.",
     "ingredients": ["Saffron", "Rose petals", "Green tea"], "allergens": ["None"]},
    {"id": "m6", "category": "tea", "name": "Thé Verveine", "name_ar": "شاي اللويزة", "price": 3.2,
     "image": img("photo-1563822249366-3efb23b8e0c9"), "desc": "Soothing verbena herbal infusion.",
     "ingredients": ["Verbena", "Honey"], "allergens": ["None"]},
    # Fresh juices
    {"id": "m7", "category": "juices", "name": "Jus d'Orange Frais", "name_ar": "عصير برتقال طازج", "price": 3.0,
     "image": img("photo-1613478223719-2ab802602423"), "desc": "Freshly squeezed Valencia oranges.",
     "ingredients": ["Orange"], "allergens": ["None"]},
    {"id": "m8", "category": "juices", "name": "Avocat-Amande", "name_ar": "أفوكادو باللوز", "price": 4.5,
     "image": img("photo-1623065422902-30a2d299bbe4"), "desc": "Creamy avocado & almond milk shake.",
     "ingredients": ["Avocado", "Almond milk", "Dates"], "allergens": ["Nuts"]},
    # Mocktails
    {"id": "m9", "category": "mocktails", "name": "Sohar Sunset", "name_ar": "غروب صحار", "price": 5.0,
     "image": img("photo-1536935338788-846bb9981813"), "desc": "Pomegranate, orange blossom & sparkling water.",
     "ingredients": ["Pomegranate", "Orange blossom", "Soda"], "allergens": ["None"]},
    {"id": "m10", "category": "mocktails", "name": "Menthe Mojito", "name_ar": "موهيتو النعناع", "price": 5.5,
     "image": img("photo-1551538827-9c037cb4f32a"), "desc": "Virgin mojito with Moroccan mint & lime.",
     "ingredients": ["Mint", "Lime", "Soda", "Sugar"], "allergens": ["None"]},
    # Breakfast
    {"id": "m11", "category": "breakfast", "name": "Petit-Déjeuner Marocain", "name_ar": "فطور مغربي", "price": 8.5,
     "image": img("photo-1533089860892-a7c6f0a88666"), "desc": "Msemen, honey, amlou, olives, cheese & mint tea.",
     "ingredients": ["Msemen", "Honey", "Amlou", "Olives"], "allergens": ["Gluten", "Nuts"]},
    {"id": "m12", "category": "breakfast", "name": "Baghrir au Miel", "name_ar": "بغرير بالعسل", "price": 5.0,
     "image": img("photo-1590301157890-4810ed352733"), "desc": "Thousand-hole pancakes with honey & butter.",
     "ingredients": ["Semolina", "Honey", "Butter"], "allergens": ["Gluten", "Milk"]},
    # Moroccan sweets
    {"id": "m13", "category": "sweets", "name": "Cornes de Gazelle", "name_ar": "كعب الغزال", "price": 4.0,
     "image": img("photo-1519915028121-7d3463d20b13"), "desc": "Almond-filled crescent pastries with orange blossom.",
     "ingredients": ["Almond", "Orange blossom", "Flour"], "allergens": ["Nuts", "Gluten"]},
    {"id": "m14", "category": "sweets", "name": "Chebakia", "name_ar": "الشباكية", "price": 3.5,
     "image": img("photo-1600617953089-e2d7d3add8e0"), "desc": "Sesame honey-glazed rose-shaped cookies.",
     "ingredients": ["Sesame", "Honey", "Flour"], "allergens": ["Sesame", "Gluten"]},
    {"id": "m15", "category": "sweets", "name": "Pastilla au Lait", "name_ar": "بسطيلة بالحليب", "price": 5.5,
     "image": img("photo-1621303837174-89787a7d4729"), "desc": "Crispy layers with almond cream & milk.",
     "ingredients": ["Warqa", "Almond", "Milk"], "allergens": ["Nuts", "Milk", "Gluten"]},
    # Moroccan food
    {"id": "m16", "category": "food", "name": "Tajine d'Agneau", "name_ar": "طاجين لحم الغنم", "price": 14.0,
     "image": img("photo-1541518763669-27fef04b14ea"), "desc": "Slow-cooked lamb tajine with prunes & almonds.",
     "ingredients": ["Lamb", "Prunes", "Almond", "Spices"], "allergens": ["Nuts"]},
    {"id": "m17", "category": "food", "name": "Couscous Royal", "name_ar": "كسكس ملكي", "price": 13.0,
     "image": img("photo-1596040033229-a9821ebd058d"), "desc": "Steamed semolina with seven vegetables & meat.",
     "ingredients": ["Semolina", "Vegetables", "Lamb", "Chickpeas"], "allergens": ["Gluten"]},
    {"id": "m18", "category": "food", "name": "Pastilla au Poulet", "name_ar": "بسطيلة الدجاج", "price": 11.0,
     "image": img("photo-1544025162-d76694265947"), "desc": "Savory-sweet chicken pie with almonds & cinnamon.",
     "ingredients": ["Chicken", "Almond", "Warqa", "Cinnamon"], "allergens": ["Nuts", "Gluten", "Egg"]},
]

PRODUCTS = [
    {"id": "p1", "category": "tea", "name": "Menthe Nanah Tea 250g", "name_ar": "شاي النعناع", "price": 12.0,
     "image": img("photo-1564890369478-c89ca6d9cde9"), "desc": "Premium loose leaf Moroccan mint green tea."},
    {"id": "p2", "category": "coffee", "name": "Marrakchi Coffee Blend 500g", "name_ar": "قهوة مراكشية", "price": 18.0,
     "image": img("photo-1447933601403-0c6688de566e"), "desc": "Spiced house coffee blend, whole beans."},
    {"id": "p3", "category": "perfume", "name": "Oud Al Marrakech Perfume", "name_ar": "عطر عود مراكش", "price": 45.0,
     "image": img("photo-1541643600914-78b084683601"), "desc": "Signature oud & amber eau de parfum, 50ml."},
    {"id": "p4", "category": "candles", "name": "Amber Candle", "name_ar": "شمعة العنبر", "price": 22.0,
     "image": img("photo-1602874801006-e26c4c5b5f8a"), "desc": "Hand-poured soy candle, amber & rose scent."},
    {"id": "p5", "category": "gift", "name": "Luxury Gift Box", "name_ar": "علبة هدايا فاخرة", "price": 60.0,
     "image": img("photo-1549465220-1a8b9238cd48"), "desc": "Curated box: tea, sweets, candle & teacups."},
    {"id": "p6", "category": "teapot", "name": "Brass Teapot", "name_ar": "إبريق شاي نحاسي", "price": 38.0,
     "image": img("photo-1571934811356-5cc061b6821f"), "desc": "Traditional engraved brass Moroccan teapot."},
    {"id": "p7", "category": "cups", "name": "Zellige Tea Glasses (Set of 6)", "name_ar": "كؤوس شاي الزليج", "price": 30.0,
     "image": img("photo-1578924825042-31d14cf11f4a"), "desc": "Hand-painted traditional tea glasses."},
    {"id": "p8", "category": "music", "name": "LE MARRAKECHI Music USB", "name_ar": "مجموعة موسيقية USB", "price": 25.0,
     "image": img("photo-1610145607059-a3c04bc9c1cb"), "desc": "Curated Gnawa & Andalusian playlist on USB."},
    {"id": "p9", "category": "music", "name": "Digital Album — Nights of Sohar", "name_ar": "ألبوم رقمي", "price": 9.99,
     "image": img("photo-1493225457124-a3eb161ffa5f"), "desc": "Digital download, 12 exclusive tracks."},
]

EVENTS = [
    {"id": "e1", "title": "Gnawa Live Night", "title_ar": "ليلة كناوة", "date": "2026-07-12", "time": "21:00",
     "image": img("photo-1514525253161-7a46d19cd819"), "desc": "Live Gnawa music on the panoramic rooftop."},
    {"id": "e2", "title": "Andalusian Sunset", "title_ar": "غروب أندلسي", "date": "2026-07-19", "time": "18:30",
     "image": img("photo-1470229722913-7c0e2dbbafd3"), "desc": "Oud & sunset over the Sohar sea."},
    {"id": "e3", "title": "Ramadan Iftar Special", "title_ar": "إفطار رمضان", "date": "2026-03-01", "time": "18:00",
     "image": img("photo-1523301343968-6a6ebf63c672"), "desc": "Traditional iftar buffet with sea view."},
]

TABLES = [
    {"id": "t1", "label": "T1", "zone": "sea_view", "seats": 2, "x": 0.15, "y": 0.2, "available": True},
    {"id": "t2", "label": "T2", "zone": "sea_view", "seats": 4, "x": 0.5, "y": 0.2, "available": True},
    {"id": "t3", "label": "T3", "zone": "sea_view", "seats": 2, "x": 0.82, "y": 0.2, "available": False},
    {"id": "t4", "label": "L1", "zone": "lounge", "seats": 6, "x": 0.2, "y": 0.5, "available": True},
    {"id": "t5", "label": "L2", "zone": "lounge", "seats": 6, "x": 0.7, "y": 0.5, "available": True},
    {"id": "t6", "label": "O1", "zone": "outdoor", "seats": 4, "x": 0.18, "y": 0.78, "available": True},
    {"id": "t7", "label": "O2", "zone": "outdoor", "seats": 4, "x": 0.5, "y": 0.78, "available": True},
    {"id": "t8", "label": "I1", "zone": "indoor", "seats": 2, "x": 0.82, "y": 0.78, "available": True},
]

MUSIC = [
    {"id": "s1", "title": "Ya Rayah", "artist": "Gnawa Diffusion", "duration": "4:12",
     "cover": img("photo-1511671782779-c97d3d27a1d4"),
     "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
    {"id": "s2", "title": "Desert Rose", "artist": "Andalusian Ensemble", "duration": "3:45",
     "cover": img("photo-1508700115892-45ecd05ae2ad"),
     "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
    {"id": "s3", "title": "Sohar Breeze", "artist": "Oud Masters", "duration": "5:02",
     "cover": img("photo-1465847899084-d164df4dedc6"),
     "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
    {"id": "s4", "title": "Marrakech Nights", "artist": "Gnawa Fusion", "duration": "4:33",
     "cover": img("photo-1493225457124-a3eb161ffa5f"),
     "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
    {"id": "s5", "title": "Amber Lounge", "artist": "Chill Oud", "duration": "6:10",
     "cover": img("photo-1459749411175-04bf5292ceea"),
     "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"},
]

# Enrich boutique products with luxury storytelling
_STORY = {
    "en": "Sourced from the finest Moroccan artisans and the souks of Marrakech, each piece is "
          "selected for its craftsmanship and soul — a fragment of Morocco to treasure at home.",
    "ar": "مستوحاة من أمهر الحرفيين المغاربة وأسواق مراكش العريقة، اختيرت كل قطعة بعناية لحرفيتها "
          "وروحها — قطعة من المغرب لتقتنيها في منزلك.",
}
for _p in PRODUCTS:
    _p.setdefault("story", _STORY["en"])
    _p.setdefault("story_ar", _STORY["ar"])
    _p.setdefault("packaging", "Presented in a signature ivory & gold gift box, sealed with wax.")
    _p.setdefault("packaging_ar", "يُقدَّم في علبة هدايا عاجية مذهبة بختم شمعي فاخر.")
    _p.setdefault("gift", "A refined gift for cherished moments and distinguished guests.")
    _p.setdefault("gift_ar", "هدية راقية للحظات العزيزة والضيوف المميزين.")

