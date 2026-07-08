import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Events() {
  const { theme, t, lang, isRTL } = useApp();
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => { api.get("/events").then(setEvents).catch(() => {}); }, []);

  return (
    <Screen>
      <Header title={t("events")} back />
      <FlatList
        data={events}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.md, gap: 16, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={[st.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Image source={{ uri: item.image }} style={st.img} contentFit="cover" />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.75)"]} style={st.overlay} />
            <View style={st.dateBadge}><Text style={st.dateTxt}>{item.date}</Text><Text style={st.timeTxt}>{item.time}</Text></View>
            <View style={st.content}>
              <Text style={[st.title, txtAlign(isRTL)]}>{lang === "ar" ? item.title_ar : item.title}</Text>
              <Text style={[st.desc, txtAlign(isRTL)]}>{item.desc}</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, height: 220 },
  img: { width: "100%", height: "100%" },
  overlay: { position: "absolute", left: 0, right: 0, bottom: 0, height: 130 },
  dateBadge: { position: "absolute", top: 14, right: 14, backgroundColor: "rgba(212,175,55,0.95)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  dateTxt: { color: "#2B1B12", fontWeight: "900", fontSize: 13 },
  timeTxt: { color: "#2B1B12", fontWeight: "700", fontSize: 11 },
  content: { position: "absolute", bottom: 16, left: 16, right: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "900" },
  desc: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 4 },
});
