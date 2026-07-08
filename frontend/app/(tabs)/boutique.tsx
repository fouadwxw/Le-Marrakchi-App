import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, FlatList } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const CATS = ["all", "tea", "coffee", "perfume", "candles", "gift", "teapot", "cups", "music"];

export default function Boutique() {
  const { theme, t, catName, lang, isRTL, addToCart, cartCount } = useApp();
  const router = useRouter();
  const [active, setActive] = useState("all");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { api.get("/products").then(setItems).catch(() => {}); }, []);
  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <Screen>
      <Header title={t("boutique")} right={
        <Pressable testID="boutique-cart" onPress={() => router.push("/cart")}>
          <Ionicons name="bag-handle" size={24} color={theme.gold} />
          {cartCount > 0 && <View style={st.badge}><Text style={st.badgeTxt}>{cartCount}</Text></View>}
        </Pressable>} />
      <View style={{ height: 56 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 10, alignItems: "center" }}>
          {CATS.map((c) => {
            const on = c === active;
            return (
              <Pressable key={c} testID={`bcat-${c}`} onPress={() => setActive(c)} style={[st.chip, { borderColor: on ? theme.bordeaux : theme.border, backgroundColor: on ? theme.bordeaux : theme.card }]}>
                <Text style={{ color: on ? "#F3E9D8" : theme.text, fontWeight: "700", fontSize: 13 }}>{c === "all" ? (lang === "ar" ? "الكل" : "All") : catName(c)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: spacing.md }}
        contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 30, gap: 14 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay((index % 6) * 60).springify()} style={{ flex: 1 }}>
          <Pressable testID={`product-${item.id}`} onPress={() => router.push(`/product/${item.id}?type=product`)} style={[st.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Image source={{ uri: item.image }} style={st.img} contentFit="cover" />
            <View style={{ padding: 10 }}>
              <Text style={[st.name, { color: theme.text }, txtAlign(isRTL)]} numberOfLines={1}>{lang === "ar" ? item.name_ar : item.name}</Text>
              <View style={st.row}>
                <Text style={[st.price, { color: theme.gold }]}>{item.price.toFixed(2)} OMR</Text>
                <Pressable testID={`badd-${item.id}`} onPress={() => addToCart({ product_id: item.id, name: lang === "ar" ? item.name_ar : item.name, price: item.price, image: item.image })} style={[st.add, { backgroundColor: theme.emerald }]}>
                  <Ionicons name="add" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </Pressable>
          </Animated.View>
        )}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  badge: { position: "absolute", top: -6, right: -8, backgroundColor: "#C87A3F", minWidth: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  chip: { height: 36, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  card: { flex: 1, borderRadius: radius.md, overflow: "hidden", borderWidth: 1 },
  img: { width: "100%", height: 140 },
  name: { fontSize: 14, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  price: { fontSize: 14, fontWeight: "800" },
  add: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
