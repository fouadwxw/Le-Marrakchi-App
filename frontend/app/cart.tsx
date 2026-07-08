import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Cart() {
  const { theme, t, isRTL, cart, setQty, removeFromCart, cartTotal } = useApp();
  const router = useRouter();

  if (cart.length === 0) return (
    <Screen>
      <Header title={t("cart")} back />
      <View style={st.empty}>
        <Ionicons name="bag-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.textMuted, fontSize: 16, marginTop: 16 }}>{t("empty_cart")}</Text>
        <GoldButton label={t("explore_menu")} onPress={() => router.replace("/(tabs)/menu")} style={{ marginTop: 20 }} />
      </View>
    </Screen>
  );

  return (
    <Screen>
      <Header title={t("cart")} back />
      <FlatList
        data={cart}
        keyExtractor={(i) => i.product_id}
        contentContainerStyle={{ padding: spacing.md, gap: 12, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[st.row, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Image source={{ uri: item.image }} style={st.img} contentFit="cover" />
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={[st.name, { color: theme.text }, txtAlign(isRTL)]} numberOfLines={1}>{item.name}</Text>
              <Text style={[{ color: theme.gold, fontWeight: "800", marginTop: 4 }, txtAlign(isRTL)]}>{(item.price * item.qty).toFixed(2)} OMR</Text>
              <View style={[st.qtyRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Pressable testID={`dec-${item.product_id}`} onPress={() => setQty(item.product_id, item.qty - 1)} style={[st.qBtn, { backgroundColor: theme.cardAlt }]}><Ionicons name="remove" size={16} color={theme.gold} /></Pressable>
                <Text style={{ color: theme.text, fontWeight: "800", minWidth: 26, textAlign: "center" }}>{item.qty}</Text>
                <Pressable testID={`inc-${item.product_id}`} onPress={() => setQty(item.product_id, item.qty + 1)} style={[st.qBtn, { backgroundColor: theme.cardAlt }]}><Ionicons name="add" size={16} color={theme.gold} /></Pressable>
              </View>
            </View>
            <Pressable testID={`remove-${item.product_id}`} onPress={() => removeFromCart(item.product_id)} hitSlop={10}><Ionicons name="trash-outline" size={22} color={theme.copper} /></Pressable>
          </View>
        )}
      />
      <View style={[st.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={[st.totalRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={{ color: theme.textMuted, fontSize: 16 }}>{t("total")}</Text>
          <Text style={{ color: theme.gold, fontSize: 22, fontWeight: "900" }}>{cartTotal.toFixed(2)} OMR</Text>
        </View>
        <GoldButton testID="checkout-btn" label={t("checkout")} icon="card" onPress={() => router.push("/checkout")} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { padding: 10, borderRadius: radius.md, borderWidth: 1, alignItems: "center" },
  img: { width: 74, height: 74, borderRadius: radius.sm },
  name: { fontSize: 15, fontWeight: "700" },
  qtyRow: { alignItems: "center", gap: 12, marginTop: 8 },
  qBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  footer: { padding: spacing.md, paddingBottom: 28, borderTopWidth: StyleSheet.hairlineWidth },
  totalRow: { justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
});
