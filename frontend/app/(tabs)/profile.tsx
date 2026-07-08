import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/src/context";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

const LANGS: { id: "ar" | "en" | "fr"; label: string }[] = [
  { id: "ar", label: "العربية" }, { id: "en", label: "English" }, { id: "fr", label: "Français" },
];

export default function Profile() {
  const { theme, t, isRTL, lang, setLang, isDark, toggleDark, user, logout } = useApp();
  const router = useRouter();

  const rows = [
    { icon: "diamond", label: t("loyalty"), route: "/loyalty" },
    { icon: "receipt", label: t("my_orders"), route: "/orders" },
    { icon: "calendar", label: t("my_reservations"), route: "/reservations" },
    { icon: "calendar-clear", label: t("events"), route: "/events" },
    { icon: "sparkles", label: t("assistant"), route: "/assistant" },
  ];

  return (
    <Screen>
      <Header title={t("profile")} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {user ? (
          <LinearGradient colors={["#B23347", "#7A1F2E", "#4E121D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.userCard}>
            <View style={st.avatar}><Text style={{ color: "#7A1F2E", fontSize: 28, fontWeight: "900" }}>{user.name?.[0]?.toUpperCase()}</Text></View>
            <Text style={st.userName}>{user.name}</Text>
            <Text style={st.userEmail}>{user.email}</Text>
            <View style={st.tierPill}><Ionicons name="diamond" size={14} color="#D4AF37" /><Text style={st.tierTxt}>{user.loyalty_tier} · {user.loyalty_points} {t("points")}</Text></View>
          </LinearGradient>
        ) : (
          <View style={[st.loginCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="person-circle-outline" size={60} color={theme.gold} />
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginVertical: 12 }}>{t("login")} / {t("register")}</Text>
            <GoldButton testID="go-login" label={t("login")} onPress={() => router.push("/auth")} />
          </View>
        )}

        <Text style={[st.section, { color: theme.gold }, txtAlign(isRTL)]}>{t("language")}</Text>
        <View style={[st.langRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          {LANGS.map((l) => {
            const on = l.id === lang;
            return (
              <Pressable key={l.id} testID={`lang-${l.id}`} onPress={() => setLang(l.id)} style={[st.langChip, { backgroundColor: on ? theme.gold : theme.card, borderColor: on ? theme.gold : theme.border }]}>
                <Text style={{ color: on ? "#2B1B12" : theme.text, fontWeight: "700" }}>{l.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[st.settingRow, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <View style={[st.rowLeft, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Ionicons name="moon" size={20} color={theme.gold} />
            <Text style={{ color: theme.text, fontWeight: "600", marginHorizontal: 12 }}>{t("dark_mode")}</Text>
          </View>
          <Switch testID="dark-toggle" value={isDark} onValueChange={toggleDark} trackColor={{ true: theme.emerald }} thumbColor="#fff" />
        </View>

        {rows.map((r) => (
          <Pressable key={r.route} testID={`nav-${r.icon}`} onPress={() => router.push(r.route as any)} style={[st.settingRow, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={[st.rowLeft, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Ionicons name={r.icon as any} size={20} color={theme.gold} />
              <Text style={{ color: theme.text, fontWeight: "600", marginHorizontal: 12 }}>{r.label}</Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={theme.textMuted} />
          </Pressable>
        ))}

        {user?.role === "admin" && (
          <Pressable testID="nav-admin" onPress={() => router.push("/admin")} style={[st.settingRow, { backgroundColor: theme.royalGreen, borderColor: theme.royalGreen, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={[st.rowLeft, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Ionicons name="stats-chart" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", marginHorizontal: 12 }}>{t("admin")}</Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#fff" />
          </Pressable>
        )}

        {user && (
          <Pressable testID="logout-btn" onPress={logout} style={[st.logout, { borderColor: theme.copper }]}>
            <Ionicons name="log-out-outline" size={20} color={theme.copper} />
            <Text style={{ color: theme.copper, fontWeight: "700", marginHorizontal: 10 }}>{t("logout")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  userCard: { borderRadius: radius.lg, padding: spacing.lg, alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F3E9D8", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  userName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  userEmail: { color: "rgba(255,255,255,0.85)", marginTop: 4 },
  tierPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.25)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginTop: 14 },
  tierTxt: { color: "#F3E9D8", fontWeight: "700" },
  loginCard: { borderRadius: radius.lg, padding: spacing.lg, alignItems: "center", borderWidth: 1 },
  section: { fontSize: 13, fontWeight: "800", marginTop: 24, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  langRow: { gap: 10 },
  langChip: { flex: 1, paddingVertical: 12, borderRadius: radius.pill, borderWidth: 1.5, alignItems: "center" },
  settingRow: { justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: radius.md, borderWidth: 1, marginTop: 12 },
  rowLeft: { alignItems: "center" },
  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, borderRadius: radius.md, borderWidth: 1.5, marginTop: 24 },
});
