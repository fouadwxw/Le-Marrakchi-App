import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useApp } from "@/src/context";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const MOODS = [
  { id: "sunset", icon: "partly-sunny", emoji: "🌅", ar: "غروب", en: "Sunset", fr: "Coucher de soleil", img: "photo-1470252649378-9c29740c9fa8", c: ["#E8935B", "#8C3F2B"],
    zone: "sea_view", time: "18:45", sig: { ar: "طاولة 12 مقابل البحر مع طبق الغروب المميز", en: "Table 12 facing the sea with our signature Sunset platter", fr: "Table 12 face à la mer avec notre plateau Sunset" } },
  { id: "romantic", icon: "heart", emoji: "💕", ar: "رومانسي", en: "Romantic", fr: "Romantique", img: "photo-1519671482749-fd09be7ccebf", c: ["#A8324A", "#5A1830"],
    zone: "sea_view", time: "20:00", sig: { ar: "ركن خاص بإطلالة بحرية مع شاي الورد والزعفران", en: "Private sea-view nook with Rose & Saffron tea for two", fr: "Coin privé vue mer avec thé Rose & Safran" } },
  { id: "family", icon: "people", emoji: "👨‍👩‍👧", ar: "عائلي", en: "Family", fr: "Famille", img: "photo-1414235077428-338989a2e8c0", c: ["#1C5D4E", "#0C332B"],
    zone: "lounge", time: "17:00", sig: { ar: "لاونج عائلي واسع مع كسكس ملكي وحلويات مغربية", en: "Spacious family lounge with Royal Couscous & Moroccan sweets", fr: "Lounge familial avec Couscous Royal" } },
  { id: "business", icon: "briefcase", emoji: "💼", ar: "أعمال", en: "Business", fr: "Business", img: "photo-1517248135467-4c7edcad34c4", c: ["#3A3A44", "#16161C"],
    zone: "indoor", time: "13:30", sig: { ar: "طاولة هادئة داخلية مع قهوة مراكشية وبسطيلة", en: "Quiet indoor table with Marrakchi coffee & Pastilla", fr: "Table intérieure calme, café & Pastilla" } },
  { id: "live_music", icon: "musical-notes", emoji: "🎶", ar: "موسيقى حية", en: "Live Music", fr: "Musique live", img: "photo-1516450360452-9312f5e86fc7", c: ["#B8912E", "#6b4d15"],
    zone: "outdoor", time: "21:00", sig: { ar: "طاولة أمام المسرح مع موكتيل غروب صحار", en: "Front-stage table with Sohar Sunset mocktail", fr: "Table près de la scène, mocktail Sohar" } },
  { id: "night_lounge", icon: "moon", emoji: "🌙", ar: "لاونج ليلي", en: "Night Lounge", fr: "Night Lounge", img: "photo-1514320291840-2e0a9bf2a9ae", c: ["#4A2A6B", "#1C1030"],
    zone: "lounge", time: "22:00", sig: { ar: "أرائك اللاونج مع شاي بالنعناع وأجواء العود", en: "Lounge sofas with mint tea & ambient Oud", fr: "Sofas lounge, thé menthe & Oud" } },
];

export default function Ambiance() {
  const { theme, t, lang, isRTL } = useApp();
  const router = useRouter();
  const [sel, setSel] = useState<any>(null);

  return (
    <Screen>
      <Header title={t("ambiance")} back />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[st.intro, { color: theme.textMuted }, txtAlign(isRTL)]}>{t("ambiance_sub")}</Text>
        <View style={st.grid}>
          {MOODS.map((m, i) => {
            const on = sel?.id === m.id;
            return (
              <Animated.View key={m.id} entering={FadeInDown.delay(i * 60)} style={{ width: "47%", flexGrow: 1 }}>
                <Pressable testID={`mood-${m.id}`} onPress={() => setSel(m)} style={[st.card, on && { borderColor: theme.gold, borderWidth: 2 }]}>
                  <Image source={{ uri: `https://images.unsplash.com/${m.img}?w=500&q=80` }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient colors={["transparent", m.c[1]]} style={StyleSheet.absoluteFill} />
                  <Text style={st.emoji}>{m.emoji}</Text>
                  <Text style={st.moodTxt}>{lang === "ar" ? m.ar : lang === "fr" ? m.fr : m.en}</Text>
                  {on && <View style={st.check}><Ionicons name="checkmark" size={14} color="#2B1B12" /></View>}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {sel && (
          <Animated.View entering={FadeIn} style={[st.suggest, { backgroundColor: theme.card, borderColor: theme.gold }]}>
            <View style={[st.sugHead, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <LinearGradient colors={["#E8C766", "#A8791F"]} style={st.sugIcon}><Ionicons name="sparkles" size={18} color="#2B1B12" /></LinearGradient>
              <Text style={[st.sugTitle, { color: theme.gold }]}>{t("suggested")}</Text>
            </View>
            <Text style={[st.sugBody, { color: theme.text }, txtAlign(isRTL)]}>{lang === "ar" ? sel.sig.ar : lang === "fr" ? sel.sig.fr : sel.sig.en}</Text>
            <View style={[st.metaRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={[st.meta, { flexDirection: isRTL ? "row-reverse" : "row" }]}><Ionicons name="location" size={16} color={theme.gold} /><Text style={[st.metaTxt, { color: theme.textMuted }]}>{t(sel.zone)}</Text></View>
              <View style={[st.meta, { flexDirection: isRTL ? "row-reverse" : "row" }]}><Ionicons name="time" size={16} color={theme.gold} /><Text style={[st.metaTxt, { color: theme.textMuted }]}>{sel.time}</Text></View>
            </View>
            <GoldButton testID="ambiance-reserve" label={t("book_this")} icon="calendar" onPress={() => router.push("/(tabs)/reserve")} style={{ marginTop: 16 }} />
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  intro: { fontSize: 14, marginBottom: 18, lineHeight: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { height: 130, borderRadius: radius.lg, overflow: "hidden", justifyContent: "flex-end", padding: 12 },
  emoji: { fontSize: 26, position: "absolute", top: 12, left: 12 },
  moodTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  check: { position: "absolute", top: 10, right: 10, width: 24, height: 24, borderRadius: 12, backgroundColor: "#D4AF37", alignItems: "center", justifyContent: "center" },
  suggest: { marginTop: 20, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1 },
  sugHead: { alignItems: "center", gap: 10, marginBottom: 12 },
  sugIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  sugTitle: { fontSize: 14, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  sugBody: { fontSize: 16, fontWeight: "600", lineHeight: 23 },
  metaRow: { gap: 20, marginTop: 14 },
  meta: { alignItems: "center", gap: 6 },
  metaTxt: { fontSize: 14, fontWeight: "600" },
});
