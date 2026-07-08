import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, GoldButton } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const { width } = Dimensions.get("window");
const MAP_H = 420;

export default function TableMap() {
  const { theme, t, lang } = useApp();
  const router = useRouter();
  const [tables, setTables] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);

  useEffect(() => { api.get("/tables").then(setTables).catch(() => {}); }, []);

  return (
    <Screen>
      <Header title={t("table_map")} back />
      <View style={{ padding: spacing.md }}>
        <View style={[st.map, { borderColor: theme.border }]}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&q=80" }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={["rgba(20,16,12,0.55)", "rgba(20,16,12,0.35)"]} style={StyleSheet.absoluteFill} />
          <View style={st.seaLabel}><Ionicons name="water" size={14} color="#7fd8ff" /><Text style={st.seaTxt}>{t("sea_view")}</Text></View>
          {tables.map((tb) => {
            const on = sel?.id === tb.id;
            const color = !tb.available ? "#6b5842" : on ? theme.gold : theme.emerald;
            return (
              <Pressable key={tb.id} testID={`table-${tb.id}`} disabled={!tb.available} onPress={() => setSel(tb)}
                style={[st.table, { left: tb.x * (width - 32) - 24, top: tb.y * MAP_H - 24, backgroundColor: color, borderColor: on ? "#fff" : "transparent" }]}>
                <Text style={st.tableLabel}>{tb.label}</Text>
                <Text style={st.tableSeats}>{tb.seats}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={st.legend}>
          <Legend color={theme.emerald} label={lang === "ar" ? "متاحة" : "Available"} />
          <Legend color={theme.gold} label={lang === "ar" ? "مختارة" : "Selected"} />
          <Legend color="#6b5842" label={lang === "ar" ? "محجوزة" : "Reserved"} />
        </View>

        {sel && (
          <View style={[st.info, { backgroundColor: theme.card, borderColor: theme.gold }]}>
            <View>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>{sel.label} · {t(sel.zone)}</Text>
              <Text style={{ color: theme.textMuted, marginTop: 4 }}>{sel.seats} {t("guests")}</Text>
            </View>
          </View>
        )}
        <GoldButton testID="confirm-table" label={sel ? `${t("confirm")} · ${sel.label}` : t("confirm")} icon="checkmark" onPress={() => { if (sel) router.back(); }} style={{ marginTop: 20, opacity: sel ? 1 : 0.5 }} />
      </View>
    </Screen>
  );
}

function Legend({ color, label }: any) {
  const { theme } = useApp();
  return <View style={st.legendItem}><View style={[st.dot, { backgroundColor: color }]} /><Text style={{ color: theme.textMuted, fontSize: 12 }}>{label}</Text></View>;
}

const st = StyleSheet.create({
  map: { height: MAP_H, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1 },
  seaLabel: { position: "absolute", top: 10, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  seaTxt: { color: "#cdefff", fontSize: 12, fontWeight: "700" },
  table: { position: "absolute", width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  tableLabel: { color: "#fff", fontWeight: "800", fontSize: 13 },
  tableSeats: { color: "rgba(255,255,255,0.8)", fontSize: 10 },
  legend: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  info: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: radius.md, borderWidth: 1, marginTop: 20 },
});
