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

const CATS = ["coffee", "tea", "juices", "mocktails", "breakfast", "sweets", "food"];

export default function Menu() {
  const { theme, t, catName, lang, isRTL, addToCart } = useApp();
  const router = useRouter();
  const [active, setActive] = useState("coffee");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { api.get(`/menu?category=${active}`).then(setItems).catch(() => {}); }, [active]);

  return (
    <Screen>
      <Header title={t("menu")} right={<Ionicons name="cafe" size={22} color={theme.gold} />} />
      <View style={{ height: 56 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 10, alignItems: "center" }}>
          {CATS.map((c) => {
            const on = c === active;
            return (
              <Pressable key={c} testID={`cat-${c}`} onPress={() => setActive(c)} style={[st.chip, { borderColor: on ? theme.bordeaux : theme.border, backgroundColor: on ? theme.bordeaux : theme.card }]}>
                <Text style={{ color: on ? "#F3E9D8" : theme.text, fontWeight: "700", fontSize: 13 }}>{catName(c)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.sm, paddingBottom: 30, gap: 14 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
          <Pressable testID={`menu-item-${item.id}`} onPress={() => router.push(`/product/${item.id}?type=menu`)} style={[st.card, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Image source={{ uri: item.image }} style={st.img} contentFit="cover" />
            <View style={{ flex: 1, padding: spacing.md }}>
              <Text style={[st.name, { color: theme.text }, txtAlign(isRTL)]}>{lang === "ar" ? item.name_ar : item.name}</Text>
              <Text style={[st.desc, { color: theme.textMuted }, txtAlign(isRTL)]} numberOfLines={2}>{item.desc}</Text>
              <View style={[st.row, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Text style={[st.price, { color: theme.gold }]}>{item.price.toFixed(2)} OMR</Text>
                <Pressable testID={`add-${item.id}`} onPress={() => addToCart({ product_id: item.id, name: lang === "ar" ? item.name_ar : item.name, price: item.price, image: item.image })} style={[st.addBtn, { backgroundColor: theme.emerald }]}>
                  <Ionicons name="add" size={20} color="#fff" />
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
  chip: { height: 36, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  card: { borderRadius: radius.lg, overflow: "hidden", borderWidth: 1 },
  img: { width: 110, height: "100%", minHeight: 110 },
  name: { fontSize: 16, fontWeight: "800" },
  desc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  row: { justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  price: { fontSize: 16, fontWeight: "800" },
  addBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
});
