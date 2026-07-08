import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, GoldButton } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Orders() {
  const { theme, t, lang, user } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { if (user) api.get("/orders").then(setOrders).catch(() => {}); }, [user]);

  if (!user) return (
    <Screen><Header title={t("my_orders")} back />
      <View style={st.empty}><Ionicons name="lock-closed" size={50} color={theme.textMuted} /><GoldButton label={t("login")} onPress={() => router.push("/auth")} style={{ marginTop: 16 }} /></View>
    </Screen>
  );

  return (
    <Screen>
      <Header title={t("my_orders")} back />
      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.md, gap: 12 }}
        ListEmptyComponent={<Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>{lang === "ar" ? "لا توجد طلبات" : "No orders yet"}</Text>}
        renderItem={({ item }) => (
          <View style={[st.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.text, fontWeight: "800" }}>#{item.id.slice(0, 6).toUpperCase()}</Text>
              <View style={[st.status, { backgroundColor: theme.emerald }]}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{item.status}</Text></View>
            </View>
            <Text style={{ color: theme.textMuted, marginTop: 6, fontSize: 12 }}>{item.created_at?.slice(0, 10)} · {item.items?.length} items</Text>
            <Text style={{ color: theme.gold, fontWeight: "900", fontSize: 18, marginTop: 8 }}>{item.total.toFixed(2)} OMR</Text>
            <Text style={{ color: theme.emerald, fontSize: 12, marginTop: 2 }}>+{item.points_earned} {t("points")}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { padding: 16, borderRadius: radius.md, borderWidth: 1 },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});
