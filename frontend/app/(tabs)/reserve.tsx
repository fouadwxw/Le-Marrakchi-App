import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const TIMES = ["12:00", "13:30", "15:00", "17:00", "18:30", "20:00", "21:30"];
const ZONES = [
  { id: "sea_view", icon: "sunny" },
  { id: "outdoor", icon: "leaf" },
  { id: "lounge", icon: "wine" },
  { id: "indoor", icon: "home" },
];

function nextDays(n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    arr.push({ iso: d.toISOString().slice(0, 10), day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate() });
  }
  return arr;
}

export default function Reserve() {
  const { theme, t, isRTL, user } = useApp();
  const router = useRouter();
  const days = nextDays(10);
  const [date, setDate] = useState(days[0].iso);
  const [time, setTime] = useState("18:30");
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState("sea_view");
  const [table, setTable] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!user) { router.push("/auth"); return; }
    setBusy(true);
    try {
      await api.post("/reservations", { date, time, guests, zone, table_id: table, name: user.name });
      setDone(true);
    } catch {}
    setBusy(false);
  };

  if (done) return (
    <Screen>
      <Header title={t("reserve")} />
      <View style={st.success}>
        <View style={[st.checkCircle, { backgroundColor: theme.royalGreen }]}><Ionicons name="checkmark" size={48} color="#fff" /></View>
        <Text style={[st.successTitle, { color: theme.text }]}>{t("order_placed")}</Text>
        <Text style={[st.successSub, { color: theme.textMuted }]}>{date} · {time} · {guests} {t("guests")}</Text>
        <GoldButton label={t("home")} onPress={() => router.replace("/(tabs)")} style={{ marginTop: 24 }} />
      </View>
    </Screen>
  );

  return (
    <Screen>
      <Header title={t("reserve")} right={<Pressable testID="open-table-map" onPress={() => router.push("/table-map")}><Ionicons name="map" size={22} color={theme.gold} /></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Label text={t("date")} theme={theme} isRTL={isRTL} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {days.map((d) => {
            const on = d.iso === date;
            return (
              <Pressable key={d.iso} testID={`date-${d.iso}`} onPress={() => setDate(d.iso)} style={[st.dayCard, { backgroundColor: on ? theme.gold : theme.card, borderColor: on ? theme.gold : theme.border }]}>
                <Text style={{ color: on ? "#2B1B12" : theme.textMuted, fontSize: 12 }}>{d.day}</Text>
                <Text style={{ color: on ? "#2B1B12" : theme.text, fontSize: 20, fontWeight: "800" }}>{d.num}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Label text={t("time")} theme={theme} isRTL={isRTL} />
        <View style={st.wrapRow}>
          {TIMES.map((tm) => {
            const on = tm === time;
            return (
              <Pressable key={tm} testID={`time-${tm}`} onPress={() => setTime(tm)} style={[st.timeChip, { backgroundColor: on ? theme.gold : theme.card, borderColor: on ? theme.gold : theme.border }]}>
                <Text style={{ color: on ? "#2B1B12" : theme.text, fontWeight: "700" }}>{tm}</Text>
              </Pressable>
            );
          })}
        </View>

        <Label text={t("guests")} theme={theme} isRTL={isRTL} />
        <View style={[st.stepper, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Pressable testID="guests-minus" onPress={() => setGuests((g) => Math.max(1, g - 1))} style={[st.stepBtn, { backgroundColor: theme.cardAlt }]}><Ionicons name="remove" size={22} color={theme.gold} /></Pressable>
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>{guests}</Text>
          <Pressable testID="guests-plus" onPress={() => setGuests((g) => Math.min(20, g + 1))} style={[st.stepBtn, { backgroundColor: theme.cardAlt }]}><Ionicons name="add" size={22} color={theme.gold} /></Pressable>
        </View>

        <Label text={t("zone")} theme={theme} isRTL={isRTL} />
        <View style={st.zoneGrid}>
          {ZONES.map((z) => {
            const on = z.id === zone;
            return (
              <Pressable key={z.id} testID={`zone-${z.id}`} onPress={() => setZone(z.id)} style={[st.zoneCard, { backgroundColor: on ? theme.emerald : theme.card, borderColor: on ? theme.emerald : theme.border }]}>
                <Ionicons name={z.icon as any} size={26} color={on ? "#fff" : theme.gold} />
                <Text style={{ color: on ? "#fff" : theme.text, fontWeight: "700", marginTop: 8 }}>{t(z.id)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable testID="pick-table" onPress={() => router.push("/table-map")} style={[st.tableLink, { borderColor: theme.border }]}>
          <Ionicons name="grid" size={20} color={theme.gold} />
          <Text style={{ color: theme.text, fontWeight: "700", flex: 1, marginHorizontal: 10 }}>{table ? `${t("table_map")}: ${table}` : t("table_map")}</Text>
          <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={theme.textMuted} />
        </Pressable>

        <GoldButton testID="confirm-reservation" label={busy ? "..." : t("confirm")} icon="checkmark-circle" onPress={confirm} style={{ marginTop: 24 }} />
      </ScrollView>
    </Screen>
  );
}

function Label({ text, theme, isRTL }: any) {
  return <Text style={[st.label, { color: theme.gold }, txtAlign(isRTL)]}>{text}</Text>;
}

const st = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "800", marginTop: 22, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  dayCard: { width: 58, height: 72, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1, gap: 4 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timeChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.pill, borderWidth: 1 },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: radius.md, borderWidth: 1 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  zoneGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  zoneCard: { width: "47%", flexGrow: 1, height: 96, borderRadius: radius.md, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  tableLink: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: radius.md, borderWidth: 1, marginTop: 22 },
  success: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  checkCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: "900" },
  successSub: { fontSize: 15, marginTop: 8 },
});
