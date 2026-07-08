import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/src/context";
import { Screen, Header, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const TIERS = [
  { id: "Bronze", min: 0, colors: ["#B87333", "#8C5A2B"], ar: "برونزي", perks: { ar: "خصم 5% · مشروب ترحيبي", en: "5% off · Welcome drink" } },
  { id: "Silver", min: 600, colors: ["#C0C0C0", "#8E8E8E"], ar: "فضي", perks: { ar: "خصم 10% · أولوية الحجز", en: "10% off · Priority booking" } },
  { id: "Gold", min: 1500, colors: ["#E8C766", "#A8791F"], ar: "ذهبي", perks: { ar: "خصم 15% · طاولة إطلالة البحر", en: "15% off · Sea-view table" } },
  { id: "Royal", min: 3000, colors: ["#0E7D57", "#063D2C"], ar: "ملكي", perks: { ar: "خصم 20% · لاونج خاص · هدايا", en: "20% off · Private lounge · Gifts" } },
];

export default function Loyalty() {
  const { theme, t, lang, user } = useApp();
  const isRTL = lang === "ar";
  const pts = user?.loyalty_points ?? 0;
  const current = [...TIERS].reverse().find((x) => pts >= x.min) || TIERS[0];
  const next = TIERS.find((x) => x.min > pts);
  const progress = next ? Math.min(1, (pts - current.min) / (next.min - current.min)) : 1;

  return (
    <Screen>
      <Header title={t("loyalty")} back />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={current.colors as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.hero}>
          <Ionicons name="diamond" size={30} color="#fff" />
          <Text style={st.tier}>{lang === "ar" ? current.ar : current.id}</Text>
          <Text style={st.pts}>{pts} {t("points")}</Text>
          {next && (
            <View style={{ width: "100%", marginTop: 16 }}>
              <View style={st.barBg}><View style={[st.barFill, { width: `${progress * 100}%` }]} /></View>
              <Text style={st.nextTxt}>{next.min - pts} {t("points")} → {lang === "ar" ? next.ar : next.id}</Text>
            </View>
          )}
        </LinearGradient>

        <Text style={[st.section, { color: theme.gold }, txtAlign(isRTL)]}>{lang === "ar" ? "المستويات" : "Tiers"}</Text>
        {TIERS.map((tr) => {
          const active = tr.id === current.id;
          return (
            <View key={tr.id} style={[st.tierRow, { backgroundColor: theme.card, borderColor: active ? theme.gold : theme.border, borderWidth: active ? 2 : 1, flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <LinearGradient colors={tr.colors as any} style={st.badge}><Ionicons name="diamond" size={20} color="#fff" /></LinearGradient>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[{ color: theme.text, fontWeight: "800", fontSize: 16 }, txtAlign(isRTL)]}>{lang === "ar" ? tr.ar : tr.id}</Text>
                <Text style={[{ color: theme.textMuted, fontSize: 12, marginTop: 3 }, txtAlign(isRTL)]}>{tr.min}+ {t("points")} · {lang === "ar" ? tr.perks.ar : tr.perks.en}</Text>
              </View>
              {active && <Ionicons name="checkmark-circle" size={22} color={theme.gold} />}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { borderRadius: radius.lg, padding: spacing.lg, alignItems: "center" },
  tier: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 8 },
  pts: { color: "rgba(255,255,255,0.9)", fontSize: 16, marginTop: 4 },
  barBg: { height: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
  nextTxt: { color: "#fff", fontSize: 12, marginTop: 8, textAlign: "center" },
  section: { fontSize: 13, fontWeight: "800", marginTop: 24, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  tierRow: { alignItems: "center", padding: 14, borderRadius: radius.md, marginBottom: 12 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
