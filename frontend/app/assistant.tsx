import { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Assistant() {
  const { theme, t, lang, isRTL } = useApp();
  const [msgs, setMsgs] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: lang === "ar" ? "مرحباً بك في لو مراكشي! أخبرني بذوقك وسأقترح لك أفضل المشروبات والحلويات." : lang === "fr" ? "Bienvenue ! Dites-moi vos goûts et je vous conseille." : "Welcome! Tell me your taste and I'll recommend the perfect drinks & desserts." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroll = useRef<ScrollView>(null);

  const chips = lang === "ar"
    ? ["أحب النكهات الحلوة", "شيء منعش وبارد", "قهوة قوية", "حلويات باللوز"]
    : ["Sweet flavors", "Refreshing & cold", "Strong coffee", "Almond desserts"];

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]); setInput(""); setBusy(true);
    try {
      const r = await api.post("/assistant", { preferences: text });
      setMsgs((m) => [...m, { role: "bot", text: r.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "..." }]);
    }
    setBusy(false);
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <Screen>
      <Header title={t("assistant")} back right={<Ionicons name="sparkles" size={22} color={theme.gold} />} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        <ScrollView ref={scroll} contentContainerStyle={{ padding: spacing.md, gap: 12 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
          {msgs.map((m, i) => (
            m.role === "bot" ? (
              <View key={i} style={[st.botRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <LinearGradient colors={["#C9A24B", "#A8791F"]} style={st.botAvatar}><Ionicons name="sparkles" size={16} color="#2B1B12" /></LinearGradient>
                <View style={[st.bubble, { backgroundColor: theme.card, borderColor: theme.border, maxWidth: "80%" }]}>
                  <Text style={[{ color: theme.text, lineHeight: 21 }, txtAlign(isRTL)]}>{m.text}</Text>
                </View>
              </View>
            ) : (
              <View key={i} style={{ alignItems: isRTL ? "flex-start" : "flex-end" }}>
                <LinearGradient colors={["#0C6B47", "#063D2A"]} style={[st.bubble, { maxWidth: "80%" }]}>
                  <Text style={[{ color: "#fff", lineHeight: 21 }, txtAlign(isRTL)]}>{m.text}</Text>
                </LinearGradient>
              </View>
            )
          ))}
          {busy && <View style={[st.botRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}><ActivityIndicator color={theme.gold} /></View>}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8, paddingVertical: 8 }} style={{ maxHeight: 50 }}>
          {chips.map((c) => (
            <Pressable key={c} testID={`chip-${c}`} onPress={() => send(c)} style={[st.chip, { backgroundColor: theme.card, borderColor: theme.gold }]}>
              <Text style={{ color: theme.gold, fontSize: 12, fontWeight: "600" }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[st.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <TextInput testID="assistant-input" value={input} onChangeText={setInput} placeholder={t("ask_placeholder")} placeholderTextColor={theme.textMuted}
            style={[{ flex: 1, color: theme.text, backgroundColor: theme.card, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 12 }, txtAlign(isRTL)]}
            onSubmitEditing={() => send(input)} />
          <Pressable testID="assistant-send" onPress={() => send(input)} style={[st.sendBtn, { backgroundColor: theme.gold }]}>
            <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={22} color="#2B1B12" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const st = StyleSheet.create({
  botRow: { alignItems: "flex-end", gap: 8 },
  botAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  bubble: { padding: 12, borderRadius: radius.md, borderWidth: 1 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, height: 34 },
  inputBar: { alignItems: "center", gap: 10, padding: spacing.sm, paddingBottom: 24, borderTopWidth: StyleSheet.hairlineWidth },
  sendBtn: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
});
