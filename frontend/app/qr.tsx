import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { Screen, Header } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function QROrder() {
  const { theme, t, lang, user } = useApp();
  const [table] = useState("T2");
  const payload = JSON.stringify({ venue: "LE_MARRAKECHI", table, uid: user?.id || "guest" });

  return (
    <Screen>
      <Header title={t("qr")} back />
      <View style={{ padding: spacing.lg, alignItems: "center" }}>
        <View style={[st.qrCard, { backgroundColor: "#fff", borderColor: theme.gold }]}>
          <QRCode value={payload} size={220} color="#2B1B12" backgroundColor="#fff"
            logoBackgroundColor="#fff" />
        </View>
        <Text style={[st.table, { color: theme.gold }]}>{lang === "ar" ? "طاولة" : "Table"} {table}</Text>
        <View style={[st.info, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="qr-code" size={22} color={theme.gold} />
          <Text style={{ color: theme.text, fontWeight: "700", marginTop: 10, fontSize: 16, textAlign: "center" }}>
            {lang === "ar" ? "امسح الرمز للطلب من طاولتك" : "Scan to order from your table"}
          </Text>
          <Text style={{ color: theme.textMuted, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
            {lang === "ar" ? "وجّه كاميرا هاتفك نحو الرمز على الطاولة لعرض القائمة والطلب مباشرة." : "Point your camera at the code on your table to browse the menu and order instantly."}
          </Text>
        </View>
        <View style={[st.steps]}>
          {[
            { i: "scan-outline", ar: "امسح الرمز", en: "Scan code" },
            { i: "list-outline", ar: "اختر طلبك", en: "Pick items" },
            { i: "card-outline", ar: "ادفع بأمان", en: "Pay securely" },
          ].map((s, k) => (
            <View key={k} style={st.step}>
              <View style={[st.stepIcon, { backgroundColor: theme.cardAlt }]}><Ionicons name={s.i as any} size={20} color={theme.gold} /></View>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>{lang === "ar" ? s.ar : s.en}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  qrCard: { padding: 24, borderRadius: radius.lg, borderWidth: 2 },
  table: { fontSize: 20, fontWeight: "900", marginTop: 16 },
  info: { padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, marginTop: 20, alignItems: "center", width: "100%" },
  steps: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 24 },
  step: { alignItems: "center" },
  stepIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
});
