import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context";
import { Screen, Header } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const STREAM = "https://customer-assets.emergentagent.com/job_marrakechi-sohar/artifacts/be22t5rn_1782255002360.mp4";
const LIVE_POSTER = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80";

export default function Live() {
  const { theme, t, lang } = useApp();
  const router = useRouter();
  const player = useVideoPlayer(STREAM, (p) => { p.loop = true; p.muted = true; p.play(); });

  const stats = [
    { icon: "thermometer", label: lang === "ar" ? "الحرارة" : "Temp", value: "29°C" },
    { icon: "partly-sunny", label: lang === "ar" ? "الطقس" : "Weather", value: lang === "ar" ? "صافٍ" : "Clear" },
    { icon: "water", label: lang === "ar" ? "الرطوبة" : "Humidity", value: "62%" },
    { icon: "moon", label: lang === "ar" ? "الغروب" : "Sunset", value: "18:42" },
  ];

  return (
    <Screen>
      <Header title={t("live")} back right={<View style={st.liveBadgeSmall}><View style={st.dot} /><Text style={st.liveTxt}>LIVE</Text></View>} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md, paddingBottom: 30 }}>
        <View style={[st.video, { borderColor: theme.border }]}>
          <Image source={{ uri: LIVE_POSTER }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
          <LinearGradient colors={["rgba(0,0,0,0.45)", "transparent", "rgba(0,0,0,0.75)"]} style={StyleSheet.absoluteFill} />
          <View style={st.liveBadge}><View style={st.dot} /><Text style={st.liveTxt}>LIVE</Text></View>
          <View style={st.viewers}><Ionicons name="eye" size={13} color="#fff" /><Text style={st.viewersTxt}>247</Text></View>
          <View style={st.info}>
            <Ionicons name="videocam" size={16} color="#fff" />
            <Text style={st.infoTxt}>{lang === "ar" ? "كاميرا السطح البانورامي · صحار" : "Panoramic Rooftop · Sohar"}</Text>
          </View>
        </View>

        {/* WEATHER / SUNSET STRIP */}
        <View style={st.statsRow}>
          {stats.map((s, i) => (
            <Animated.View key={s.label} entering={FadeInDown.delay(i * 70)} style={[st.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name={s.icon as any} size={20} color={theme.gold} />
              <Text style={[st.statVal, { color: theme.text }]}>{s.value}</Text>
              <Text style={[st.statLabel, { color: theme.textMuted }]}>{s.label}</Text>
            </Animated.View>
          ))}
        </View>

        <LinearGradient colors={["#241a10", "#3a2a18"]} style={[st.card, { borderColor: theme.gold }]}>
          <Ionicons name="wine" size={22} color={theme.gold} />
          <Text style={{ color: theme.text, fontWeight: "800", marginTop: 8, fontSize: 16, textAlign: "center" }}>
            {lang === "ar" ? "أجواء الغروب على الطراز المغربي" : "Moroccan Sunset Ambiance"}
          </Text>
          <Text style={{ color: theme.textMuted, marginTop: 6, textAlign: "center", lineHeight: 20 }}>
            {lang === "ar" ? "عِش أجواء السطح مباشرةً — لحظة مثالية لحجز طاولتك عند غروب صحار." : "Feel the rooftop live — the perfect moment to reserve your sunset table over the Sohar sea."}
          </Text>
          <Pressable testID="live-reserve" onPress={() => router.push("/(tabs)/reserve")} style={[st.cta, { borderColor: theme.gold }]}>
            <Ionicons name="calendar" size={16} color={theme.gold} />
            <Text style={{ color: theme.gold, fontWeight: "800", marginLeft: 8 }}>{t("quick_book")}</Text>
          </Pressable>
        </LinearGradient>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  video: { height: 300, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, backgroundColor: "#000" },
  liveBadge: { position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D64545", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  liveBadgeSmall: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#D64545", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  viewers: { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  viewersTxt: { color: "#fff", fontWeight: "700", fontSize: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
  liveTxt: { color: "#fff", fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  info: { position: "absolute", bottom: 14, left: 14, flexDirection: "row", alignItems: "center", gap: 8 },
  infoTxt: { color: "#fff", fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: radius.md, borderWidth: 1 },
  statVal: { fontSize: 15, fontWeight: "800", marginTop: 6 },
  statLabel: { fontSize: 10, marginTop: 2 },
  card: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, marginTop: 16, alignItems: "center" },
  cta: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 22, borderRadius: radius.pill, marginTop: 16 },
});
