import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const PLAYLISTS = [
  { id: "sunset", ar: "غروب", en: "Sunset", img: "photo-1470252649378-9c29740c9fa8", c: ["#E8935B", "#8C3F2B"] },
  { id: "lounge", ar: "لاونج ليلي", en: "Night Lounge", img: "photo-1514320291840-2e0a9bf2a9ae", c: ["#4A2A6B", "#1C1030"] },
  { id: "andalusian", ar: "أندلسي", en: "Andalusian", img: "photo-1507838153414-b4b713384a76", c: ["#1C5D4E", "#0C332B"] },
  { id: "gnawa", ar: "كناوة", en: "Gnawa Roots", img: "photo-1516450360452-9312f5e86fc7", c: ["#B8912E", "#6b4d15"] },
];

export default function MusicTab() {
  const { theme, t, lang } = useApp();
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  useEffect(() => { api.get("/music").then(setTracks).catch(() => {}); }, []);

  const playTrack = (i: number) => { setIdx(i); player.replace({ uri: tracks[i].url }); player.play(); };
  const toggle = () => { if (status.playing) player.pause(); else { if (tracks[idx]) { player.replace({ uri: tracks[idx].url }); player.play(); } } };
  const current = tracks[idx];
  const progress = status.duration ? status.currentTime / status.duration : 0;

  return (
    <Screen>
      <Header title={t("music")} right={<Ionicons name="musical-notes" size={22} color={theme.gold} />} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* NOW PLAYING */}
        {current && (
          <LinearGradient colors={["#2A2018", "#1a130c", theme.bg]} style={st.player}>
            <Image source={{ uri: current.cover }} style={st.cover} contentFit="cover" />
            <Text style={[st.nowLabel, { color: theme.gold }]}>{t("now_playing")}</Text>
            <Text style={[st.title, { color: theme.text }]}>{current.title}</Text>
            <Text style={[st.artist, { color: theme.textMuted }]}>{current.artist}</Text>
            <View style={st.progressBg}><View style={[st.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.gold }]} /></View>
            <View style={st.controls}>
              <Pressable testID="prev-track" onPress={() => playTrack((idx - 1 + tracks.length) % tracks.length)}><Ionicons name="play-skip-back" size={30} color={theme.text} /></Pressable>
              <Pressable testID="play-toggle" onPress={toggle} style={[st.playBtn]}>
                <LinearGradient colors={["#E8C766", "#A8791F"]} style={st.playGrad}><Ionicons name={status.playing ? "pause" : "play"} size={32} color="#2B1B12" /></LinearGradient>
              </Pressable>
              <Pressable testID="next-track" onPress={() => playTrack((idx + 1) % tracks.length)}><Ionicons name="play-skip-forward" size={30} color={theme.text} /></Pressable>
            </View>
          </LinearGradient>
        )}

        {/* PLAYLISTS */}
        <Text style={[st.section, { color: theme.text }]}>{t("playlists")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 12 }}>
          {PLAYLISTS.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInDown.delay(i * 70)}>
              <Pressable testID={`playlist-${p.id}`} onPress={() => tracks.length && playTrack(0)} style={st.plCard}>
                <Image source={{ uri: `https://images.unsplash.com/${p.img}?w=500&q=80` }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient colors={["transparent", p.c[1]]} style={StyleSheet.absoluteFill} />
                <View style={st.plPlay}><Ionicons name="play" size={16} color="#2B1B12" /></View>
                <Text style={st.plTxt}>{lang === "ar" ? p.ar : p.en}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>

        {/* ALBUMS / TRACKS */}
        <Text style={[st.section, { color: theme.text }]}>{t("albums")}</Text>
        <View style={{ paddingHorizontal: spacing.md, gap: 10 }}>
          {tracks.map((item, index) => (
            <Pressable key={item.id} testID={`track-${item.id}`} onPress={() => playTrack(index)} style={[st.row, { backgroundColor: index === idx ? theme.cardAlt : theme.card, borderColor: index === idx ? theme.gold : theme.border }]}>
              <Image source={{ uri: item.cover }} style={st.thumb} contentFit="cover" />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={{ color: theme.text, fontWeight: "700" }}>{item.title}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{item.artist} · {item.duration}</Text>
              </View>
              <Ionicons name={index === idx && status.playing ? "pause-circle" : "play-circle"} size={30} color={theme.gold} />
            </Pressable>
          ))}
        </View>

        {/* USB COLLECTOR */}
        <Text style={[st.section, { color: theme.text }]}>{t("usb_collector")}</Text>
        <Pressable testID="usb-collector" onPress={() => router.push("/product/p8?type=product")} style={{ paddingHorizontal: spacing.md }}>
          <LinearGradient colors={["#241a10", "#3a2a18"]} style={[st.usb, { borderColor: theme.gold }]}>
            <View style={[st.usbIcon, { backgroundColor: "rgba(212,175,55,0.12)" }]}><Ionicons name="hardware-chip" size={26} color={theme.gold} /></View>
            <View style={{ flex: 1, marginHorizontal: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "800", fontSize: 16 }}>LE MARRAKECHI · USB</Text>
              <Text style={{ color: theme.textMuted, marginTop: 4, fontSize: 12 }}>{lang === "ar" ? "مجموعة موسيقية مختارة · إصدار محدود" : "Curated Gnawa & Andalusian · Limited edition"}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.gold} />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  player: { alignItems: "center", paddingVertical: spacing.lg },
  cover: { width: 170, height: 170, borderRadius: radius.lg, marginBottom: 14 },
  nowLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
  title: { fontSize: 22, fontWeight: "900", marginTop: 4 },
  artist: { fontSize: 14, marginTop: 2 },
  progressBg: { width: "70%", height: 4, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 2, marginTop: 16, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2 },
  controls: { flexDirection: "row", alignItems: "center", gap: 28, marginTop: 16 },
  playBtn: { width: 64, height: 64 },
  playGrad: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  section: { fontSize: 18, fontWeight: "800", paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  plCard: { width: 130, height: 150, borderRadius: radius.md, overflow: "hidden", justifyContent: "flex-end", padding: 10 },
  plPlay: { position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(243,233,216,0.9)", alignItems: "center", justifyContent: "center" },
  plTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
  row: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: radius.md, borderWidth: 1 },
  thumb: { width: 50, height: 50, borderRadius: radius.sm },
  usb: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: radius.lg, borderWidth: 1 },
  usbIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
});
