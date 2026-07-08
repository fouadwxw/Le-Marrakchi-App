import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const TABS = ["analytics", "reservations", "orders", "customers"];

export default function Admin() {
  const { theme, t, lang, user } = useApp();
  const [tab, setTab] = useState("analytics");
  const [data, setData] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { api.get("/admin/analytics").then(setData).catch(() => {}); }, []);
  useEffect(() => {
    if (tab === "reservations") api.get("/reservations").then(setList).catch(() => {});
    else if (tab === "orders") api.get("/orders").then(setList).catch(() => {});
    else if (tab === "customers") api.get("/admin/customers").then(setList).catch(() => {});
  }, [tab]);

  if (user?.role !== "admin") return (
    <Screen><Header title={t("admin")} back />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Ionicons name="lock-closed" size={50} color={theme.textMuted} />
        <Text style={{ color: theme.textMuted, marginTop: 12 }}>Admin only · admin@lemarrakechi.com</Text>
      </View>
    </Screen>
  );

  const label: any = { analytics: lang === "ar" ? "التحليلات" : "Analytics", reservations: lang === "ar" ? "الحجوزات" : "Bookings", orders: lang === "ar" ? "الطلبات" : "Orders", customers: lang === "ar" ? "العملاء" : "Customers" };

  return (
    <Screen>
      <Header title={t("admin")} back right={<Ionicons name="stats-chart" size={22} color={theme.gold} />} />
      <View style={{ height: 54 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 10, alignItems: "center" }}>
          {TABS.map((tb) => {
            const on = tb === tab;
            return <Pressable key={tb} testID={`atab-${tb}`} onPress={() => setTab(tb)} style={[stt.chip, { backgroundColor: on ? theme.bordeaux : theme.card, borderColor: on ? theme.bordeaux : theme.border }]}>
              <Text style={{ color: on ? "#F3E9D8" : theme.text, fontWeight: "700", fontSize: 13 }}>{label[tb]}</Text></Pressable>;
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}>
        {tab === "analytics" && data && (
          <>
            <View style={stt.grid}>
              <Stat icon="cash" label={lang === "ar" ? "الإيرادات" : "Revenue"} value={`${data.revenue} OMR`} theme={theme} c={["#0A5C3E", "#063D2A"]} />
              <Stat icon="receipt" label={lang === "ar" ? "الطلبات" : "Orders"} value={data.orders} theme={theme} c={["#C9A24B", "#A8791F"]} />
              <Stat icon="calendar" label={lang === "ar" ? "الحجوزات" : "Bookings"} value={data.reservations} theme={theme} c={["#C87A3F", "#8C5A2B"]} />
              <Stat icon="people" label={lang === "ar" ? "العملاء" : "Customers"} value={data.customers} theme={theme} c={["#A22A3C", "#6E1C29"]} />
            </View>
            <Text style={[stt.section, { color: theme.gold }]}>{lang === "ar" ? "الأكثر مبيعاً" : "Top Selling"}</Text>
            {data.top_items?.map((it: any, i: number) => (
              <View key={i} style={[stt.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={{ color: theme.gold, fontWeight: "900", width: 28 }}>#{i + 1}</Text>
                <Text style={{ color: theme.text, flex: 1, fontWeight: "600" }}>{it.name}</Text>
                <Text style={{ color: theme.textMuted }}>{it.qty}x</Text>
              </View>
            ))}
            {(!data.top_items || data.top_items.length === 0) && <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 20 }}>{lang === "ar" ? "لا توجد بيانات بعد" : "No sales yet"}</Text>}
          </>
        )}
        {tab !== "analytics" && (
          list.length ? list.map((it, i) => (
            <View key={i} style={[stt.listItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {tab === "reservations" && <><Text style={{ color: theme.text, fontWeight: "800" }}>{it.user_name} · {it.guests} {t("guests")}</Text><Text style={{ color: theme.textMuted, marginTop: 4 }}>{it.date} · {it.time} · {t(it.zone)}</Text></>}
              {tab === "orders" && <><Text style={{ color: theme.text, fontWeight: "800" }}>{it.user_name} · {it.total.toFixed(2)} OMR</Text><Text style={{ color: theme.textMuted, marginTop: 4 }}>{it.items?.length} items · {it.status}</Text></>}
              {tab === "customers" && <><Text style={{ color: theme.text, fontWeight: "800" }}>{it.name}</Text><Text style={{ color: theme.textMuted, marginTop: 4 }}>{it.email} · {it.loyalty_tier} · {it.loyalty_points} {t("points")}</Text></>}
            </View>
          )) : <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 30 }}>{lang === "ar" ? "لا توجد بيانات" : "No data"}</Text>
        )}
      </ScrollView>
    </Screen>
  );
}

function Stat({ icon, label, value, theme, c }: any) {
  return (
    <LinearGradient colors={c} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={stt.stat}>
      <Ionicons name={icon} size={24} color="#fff" />
      <Text style={stt.statValue}>{value}</Text>
      <Text style={stt.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

const stt = StyleSheet.create({
  chip: { height: 36, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  stat: { width: "47%", flexGrow: 1, borderRadius: radius.md, padding: spacing.md, minHeight: 100 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 8 },
  statLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 },
  section: { fontSize: 14, fontWeight: "800", marginTop: 24, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  row: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 10 },
  listItem: { padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 10 },
});
