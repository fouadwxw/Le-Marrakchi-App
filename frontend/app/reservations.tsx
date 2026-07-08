import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, GoldButton } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Reservations() {
  const { theme, t, lang, user } = useApp();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { if (user) api.get("/reservations").then(setItems).catch(() => {}); }, [user]);

  if (!user) return (
    <Screen><Header title={t("my_reservations")} back />
      <View style={st.empty}><Ionicons name="lock-closed" size={50} color={theme.textMuted} /><GoldButton label={t("login")} onPress={() => router.push("/auth")} style={{ marginTop: 16 }} /></View>
    </Screen>
  );

  return (
    <Screen>
      <Header title={t("my_reservations")} back />
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.md, gap: 12 }}
        ListEmptyComponent={<Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>{lang === "ar" ? "لا توجد حجوزات" : "No reservations"}</Text>}
        renderItem={({ item }) => (
          <View style={[st.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[st.iconBox, { backgroundColor: theme.cardAlt }]}><Ionicons name="calendar" size={22} color={theme.gold} /></View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "800" }}>{item.date} · {item.time}</Text>
              <Text style={{ color: theme.textMuted, marginTop: 4, fontSize: 12 }}>{item.guests} {t("guests")} · {t(item.zone)}</Text>
            </View>
            <View style={[st.status, { backgroundColor: theme.emerald }]}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{item.status}</Text></View>
          </View>
        )}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: radius.md, borderWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});
