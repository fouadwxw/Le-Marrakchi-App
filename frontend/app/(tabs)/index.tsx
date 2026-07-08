import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { spacing, radius } from "@/src/theme";
import { GoldButton, txtAlign } from "@/src/ui";
import { Logo } from "@/src/Logo";

const { width } = Dimensions.get("window");
const HERO_VIDEO = "https://customer-assets.emergentagent.com/job_marrakechi-sohar/artifacts/00bis6d5_compose_video_1782256641592.mp4";
const HERO_IMG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80";

export default function Home() {
  const { theme, t, lang, isRTL, user } = useApp();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const player = useVideoPlayer(HERO_VIDEO, (p) => { p.loop = true; p.muted = true; p.play(); });

  useEffect(() => {
    api.get("/events").then(setEvents).catch(() => {});
    api.get("/products").then((p) => setProducts(p.slice(0, 6))).catch(() => {});
  }, []);

  const quick = [
    { icon: "sparkles", label: t("assistant"), route: "/assistant" },
    { icon: "musical-notes", label: t("music"), route: "/(tabs)/music" },
    { icon: "videocam", label: t("live"), route: "/live" },
    { icon: "qr-code", label: t("qr"), route: "/qr" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* HERO */}
        <View style={s.hero}>
          <Image source={{ uri: HERO_IMG }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
          <LinearGradient colors={["rgba(20,16,12,0.35)", "rgba(20,16,12,0.55)", theme.bg]} style={StyleSheet.absoluteFill} />
          <View style={s.heroContent}>
            <Logo size={56} color="#F3E9D8" latinColor="#D4AF37" align={isRTL ? "flex-end" : "flex-start"} />
            <Text style={[s.heroTag, txtAlign(isRTL)]}>{t("tagline")}</Text>
            <View style={s.heroBtns}>
              <GoldButton testID="quick-book-btn" label={t("quick_book")} icon="calendar" onPress={() => router.push("/(tabs)/reserve")} style={{ flex: 1 }} />
              <Pressable testID="menu-btn" onPress={() => router.push("/(tabs)/menu")} style={s.outlineBtn}>
                <Ionicons name="restaurant-outline" size={18} color="#F3E9D8" />
                <Text style={s.outlineTxt}>{t("menu")}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <View style={s.quickRow}>
          {quick.map((q, i) => (
            <Animated.View key={q.route} entering={FadeInDown.delay(i * 80)} style={{ flex: 1 }}>
              <Pressable testID={`quick-${q.icon}`} onPress={() => router.push(q.route as any)} style={[s.quickCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[s.quickIcon, { backgroundColor: theme.cardAlt }]}><Ionicons name={q.icon as any} size={22} color={theme.gold} /></View>
                <Text style={[s.quickLabel, { color: theme.text }]} numberOfLines={1}>{q.label}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* AMBIANCE CONCIERGE */}
        <Pressable testID="ambiance-cta" onPress={() => router.push("/ambiance")} style={s.ambianceWrap}>
          <LinearGradient colors={["#241a10", "#3a2a18", "#14100C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ambiance}>
            <View style={[s.ambianceIcon, { borderColor: theme.gold }]}><Ionicons name="color-wand" size={22} color={theme.gold} /></View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={s.ambianceTitle}>{t("ambiance")}</Text>
              <Text style={s.ambianceSub}>{t("ambiance_sub")}</Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={22} color={theme.gold} />
          </LinearGradient>
        </Pressable>

        {/* LOYALTY BANNER */}
        <Pressable testID="loyalty-banner" onPress={() => router.push("/loyalty")} style={s.loyaltyWrap}>
          <LinearGradient colors={["#B23347", "#7A1F2E", "#4E121D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.loyalty}>
            <View style={{ flex: 1 }}>
              <Text style={s.loyaltyTitle}>{t("loyalty")}</Text>
              <Text style={s.loyaltyDesc}>{user ? `${user.loyalty_tier} · ${user.loyalty_points} ${t("points")}` : "Bronze · Silver · Gold · Royal"}</Text>
            </View>
            <Ionicons name="diamond" size={30} color="#D4AF37" />
          </LinearGradient>
        </Pressable>

        <SectionHeader title={t("events")} onMore={() => router.push("/events")} theme={theme} isRTL={isRTL} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 14 }}>
          {events.map((e) => (
            <Pressable key={e.id} testID={`event-${e.id}`} onPress={() => router.push("/events")} style={[s.eventCard, { backgroundColor: theme.card }]}>
              <Image source={{ uri: e.image }} style={s.eventImg} contentFit="cover" />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={s.eventOverlay} />
              <View style={s.eventTxt}>
                <Text style={s.eventDate}>{e.date} · {e.time}</Text>
                <Text style={s.eventTitle} numberOfLines={1}>{lang === "ar" ? e.title_ar : e.title}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeader title={t("boutique")} onMore={() => router.push("/(tabs)/boutique")} theme={theme} isRTL={isRTL} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 14 }}>
          {products.map((p) => (
            <Pressable key={p.id} testID={`home-product-${p.id}`} onPress={() => router.push(`/product/${p.id}?type=product`)} style={[s.prodCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Image source={{ uri: p.image }} style={s.prodImg} contentFit="cover" />
              <Text style={[s.prodName, { color: theme.text }, txtAlign(isRTL)]} numberOfLines={1}>{lang === "ar" ? p.name_ar : p.name}</Text>
              <Text style={[s.prodPrice, { color: theme.gold }]}>{p.price.toFixed(2)} OMR</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, onMore, theme, isRTL }: any) {
  return (
    <View style={[s.sectionHead, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <Text style={[s.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Pressable onPress={onMore}><Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={22} color={theme.gold} /></Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { height: 460, justifyContent: "flex-end" },
  heroContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  heroBrand: { color: "#F3E9D8", fontSize: 32, fontWeight: "900", letterSpacing: 3 },
  heroTag: { color: "#D4AF37", fontSize: 14, marginTop: 6, marginBottom: 20 },
  heroBtns: { flexDirection: "row", gap: 12, alignItems: "center" },
  outlineBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1.5, borderColor: "#F3E9D8", paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.pill },
  outlineTxt: { color: "#F3E9D8", fontWeight: "700" },
  quickRow: { flexDirection: "row", gap: 10, paddingHorizontal: spacing.md, marginTop: -10, marginBottom: spacing.md },
  quickCard: { alignItems: "center", paddingVertical: 14, borderRadius: radius.md, borderWidth: 1 },
  quickIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  quickLabel: { fontSize: 11, fontWeight: "600" },
  loyaltyWrap: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  loyalty: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg },
  loyaltyTitle: { color: "#F3E9D8", fontSize: 18, fontWeight: "900" },
  loyaltyDesc: { color: "#E8C766", marginTop: 4, fontWeight: "700" },
  ambianceWrap: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  ambiance: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: "rgba(212,175,55,0.35)" },
  ambianceIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  ambianceTitle: { color: "#F3E9D8", fontSize: 17, fontWeight: "800" },
  ambianceSub: { color: "#B8A88F", fontSize: 12, marginTop: 2 },
  sectionHead: { justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 20, fontWeight: "800" },
  eventCard: { width: width * 0.7, height: 170, borderRadius: radius.lg, overflow: "hidden" },
  eventImg: { width: "100%", height: "100%" },
  eventOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, height: 90 },
  eventTxt: { position: "absolute", bottom: 12, left: 14, right: 14 },
  eventDate: { color: "#D4AF37", fontSize: 12, fontWeight: "700" },
  eventTitle: { color: "#fff", fontSize: 17, fontWeight: "800", marginTop: 2 },
  prodCard: { width: 140, borderRadius: radius.md, padding: 8, borderWidth: 1 },
  prodImg: { width: "100%", height: 110, borderRadius: radius.sm, marginBottom: 8 },
  prodName: { fontSize: 13, fontWeight: "600" },
  prodPrice: { fontSize: 13, fontWeight: "800", marginTop: 4 },
});
