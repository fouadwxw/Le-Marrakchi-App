import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { api } from "@/src/api";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Checkout() {
  const { theme, t, isRTL, cart, cartTotal, clearCart, user, refreshUser } = useApp();
  const router = useRouter();
  const [card, setCard] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<any>(null);

  const pay = async () => {
    if (!user) { router.push("/auth"); return; }
    setBusy(true);
    try {
      const r = await api.post("/orders", { items: cart, total: cartTotal, type: "boutique" });
      clearCart(); await refreshUser(); setDone(r);
    } catch {}
    setBusy(false);
  };

  if (done) return (
    <Screen>
      <Header title={t("checkout")} />
      <View style={st.success}>
        <View style={[st.circle, { backgroundColor: theme.royalGreen }]}><Ionicons name="checkmark" size={48} color="#fff" /></View>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>{t("order_placed")}</Text>
        <Text style={{ color: theme.gold, marginTop: 8, fontWeight: "700" }}>+{done.order.points_earned} {t("points")} · {done.loyalty_tier}</Text>
        <GoldButton label={t("home")} onPress={() => router.replace("/(tabs)")} style={{ marginTop: 24 }} />
      </View>
    </Screen>
  );

  return (
    <Screen>
      <Header title={t("checkout")} back right={<Ionicons name="lock-closed" size={18} color={theme.emerald} />} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <View style={[st.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[{ color: theme.gold, fontWeight: "800", marginBottom: 14 }, txtAlign(isRTL)]}>{t("pay_now")}</Text>
            <Field label={t("name")} value={name} onChange={setName} theme={theme} isRTL={isRTL} testID="pay-name" />
            <Field label="Card Number" value={card} onChange={setCard} theme={theme} isRTL={isRTL} keyboard="number-pad" placeholder="4242 4242 4242 4242" testID="pay-card" />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}><Field label="MM/YY" value={exp} onChange={setExp} theme={theme} isRTL={isRTL} placeholder="12/28" testID="pay-exp" /></View>
              <View style={{ flex: 1 }}><Field label="CVV" value={cvv} onChange={setCvv} theme={theme} isRTL={isRTL} keyboard="number-pad" placeholder="123" testID="pay-cvv" /></View>
            </View>
          </View>
          <View style={[st.totalRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Text style={{ color: theme.textMuted, fontSize: 16 }}>{t("total")}</Text>
            <Text style={{ color: theme.gold, fontSize: 24, fontWeight: "900" }}>{cartTotal.toFixed(2)} OMR</Text>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", marginBottom: 14 }}>🔒 Demo secure payment</Text>
          <GoldButton testID="pay-now-btn" label={busy ? "..." : t("pay_now")} icon="card" onPress={pay} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field({ label, value, onChange, theme, isRTL, keyboard, placeholder, testID }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[{ color: theme.textMuted, fontSize: 12, marginBottom: 6 }, txtAlign(isRTL)]}>{label}</Text>
      <TextInput testID={testID} value={value} onChangeText={onChange} keyboardType={keyboard} placeholder={placeholder} placeholderTextColor={theme.textMuted}
        style={[{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border, borderWidth: 1, borderRadius: radius.sm, padding: 14 }, txtAlign(isRTL)]} />
    </View>
  );
}

const st = StyleSheet.create({
  card: { padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, marginBottom: 20 },
  totalRow: { justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  success: { flex: 1, alignItems: "center", justifyContent: "center" },
  circle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 24 },
});
