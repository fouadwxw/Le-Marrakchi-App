import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function ProductDetail() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { theme, t, lang, isRTL, addToCart, cartCount } = useApp();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const path = type === "product" ? `/products/${id}` : `/menu/${id}`;
    api.get(path).then(setItem).catch(() => {});
  }, [id, type]);

  if (!item) return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
  const name = lang === "ar" ? (item.name_ar || item.name) : item.name;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.imgWrap}>
          <Image source={{ uri: item.image }} style={s.img} contentFit="cover" />
          <LinearGradient colors={["rgba(0,0,0,0.4)", "transparent", theme.bg]} style={StyleSheet.absoluteFill} />
          <Pressable testID="detail-back" onPress={() => router.back()} style={[s.back, { backgroundColor: theme.overlay }]}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={26} color="#fff" />
          </Pressable>
          <Pressable testID="detail-cart" onPress={() => router.push("/cart")} style={[s.back, s.cartBtn, { backgroundColor: theme.overlay }]}>
            <Ionicons name="bag-handle" size={22} color="#fff" />
            {cartCount > 0 && <View style={s.badge}><Text style={s.badgeTxt}>{cartCount}</Text></View>}
          </Pressable>
        </View>

        <View style={{ padding: spacing.lg }}>
          <Text style={[s.name, { color: theme.text }, txtAlign(isRTL)]}>{name}</Text>
          <Text style={[s.price, { color: theme.gold }, txtAlign(isRTL)]}>{item.price.toFixed(2)} OMR</Text>

          <Text style={[s.label, { color: theme.gold }, txtAlign(isRTL)]}>{t("description")}</Text>
          <Text style={[s.body, { color: theme.textMuted }, txtAlign(isRTL)]}>{item.desc}</Text>

          {item.ingredients?.length ? (
            <>
              <Text style={[s.label, { color: theme.gold }, txtAlign(isRTL)]}>{t("ingredients")}</Text>
              <View style={[s.tags, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                {item.ingredients.map((ing: string) => (
                  <View key={ing} style={[s.tag, { backgroundColor: theme.card, borderColor: theme.border }]}><Text style={{ color: theme.text, fontSize: 12 }}>{ing}</Text></View>
                ))}
              </View>
            </>
          ) : null}

          {item.allergens?.length ? (
            <>
              <Text style={[s.label, { color: theme.gold }, txtAlign(isRTL)]}>{t("allergens")}</Text>
              <View style={[s.tags, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                {item.allergens.map((a: string) => (
                  <View key={a} style={[s.tag, { backgroundColor: "rgba(200,122,63,0.15)", borderColor: theme.copper }]}><Text style={{ color: theme.copper, fontSize: 12, fontWeight: "600" }}>{a}</Text></View>
                ))}
              </View>
            </>
          ) : null}

          {item.story ? (
            <>
              <Text style={[s.label, { color: theme.gold }, txtAlign(isRTL)]}>{t("story")}</Text>
              <Text style={[s.body, { color: theme.textMuted }, txtAlign(isRTL)]}>{lang === "ar" ? item.story_ar : item.story}</Text>
              <View style={[s.luxRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View style={[s.luxCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Ionicons name="cube-outline" size={20} color={theme.gold} />
                  <Text style={[s.luxTitle, { color: theme.text }, txtAlign(isRTL)]}>{t("packaging")}</Text>
                  <Text style={[s.luxTxt, { color: theme.textMuted }, txtAlign(isRTL)]}>{lang === "ar" ? item.packaging_ar : item.packaging}</Text>
                </View>
                <View style={[s.luxCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Ionicons name="gift-outline" size={20} color={theme.gold} />
                  <Text style={[s.luxTitle, { color: theme.text }, txtAlign(isRTL)]}>{t("gift_idea")}</Text>
                  <Text style={[s.luxTxt, { color: theme.textMuted }, txtAlign(isRTL)]}>{lang === "ar" ? item.gift_ar : item.gift}</Text>
                </View>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={[s.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <GoldButton testID="add-to-cart-btn" icon={added ? "checkmark" : "bag-add"} label={added ? t("order_placed") : t("add_cart")}
          onPress={() => { addToCart({ product_id: item.id, name, price: item.price, image: item.image }); setAdded(true); setTimeout(() => setAdded(false), 1200); }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  imgWrap: { height: 360 },
  img: { width: "100%", height: "100%" },
  back: { position: "absolute", top: 50, left: 16, width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  cartBtn: { left: undefined, right: 16 },
  badge: { position: "absolute", top: -2, right: -2, backgroundColor: "#C87A3F", minWidth: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  name: { fontSize: 26, fontWeight: "900" },
  price: { fontSize: 20, fontWeight: "800", marginTop: 6 },
  label: { fontSize: 13, fontWeight: "800", marginTop: 22, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  body: { fontSize: 15, lineHeight: 23 },
  tags: { flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1 },
  luxRow: { gap: 12, marginTop: 12 },
  luxCard: { flex: 1, padding: 14, borderRadius: radius.md, borderWidth: 1 },
  luxTitle: { fontWeight: "800", fontSize: 13, marginTop: 8, marginBottom: 4 },
  luxTxt: { fontSize: 12, lineHeight: 17 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.md, paddingBottom: 28, borderTopWidth: StyleSheet.hairlineWidth },
});
