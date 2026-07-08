import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/context";
import { Screen, Header, GoldButton, txtAlign } from "@/src/ui";
import { spacing, radius } from "@/src/theme";

export default function Auth() {
  const { theme, t, isRTL, login, register } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register(name.trim(), email.trim(), password);
      router.back();
    } catch (e: any) { setErr(e.message || "Error"); }
    setBusy(false);
  };

  return (
    <Screen>
      <Header title={mode === "login" ? t("login") : t("register")} back />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Image source={require("@/assets/images/brand-logo.png")} style={st.brandLogo} contentFit="contain" />

          <View style={[st.tabs, { backgroundColor: theme.card }]}>
            {(["login", "register"] as const).map((m) => (
              <Pressable key={m} testID={`tab-${m}`} onPress={() => setMode(m)} style={[st.tab, mode === m && { backgroundColor: theme.gold }]}>
                <Text style={{ color: mode === m ? "#2B1B12" : theme.text, fontWeight: "700" }}>{t(m)}</Text>
              </Pressable>
            ))}
          </View>

          {mode === "register" && (
            <Input icon="person" placeholder={t("name")} value={name} onChange={setName} theme={theme} isRTL={isRTL} testID="auth-name" />
          )}
          <Input icon="mail" placeholder={t("email")} value={email} onChange={setEmail} theme={theme} isRTL={isRTL} keyboard="email-address" testID="auth-email" />
          <Input icon="lock-closed" placeholder={t("password")} value={password} onChange={setPassword} theme={theme} isRTL={isRTL} secure testID="auth-password" />

          {err ? <Text style={{ color: theme.copper, marginBottom: 12, textAlign: "center" }}>{err}</Text> : null}
          <GoldButton testID="auth-submit" label={busy ? "..." : (mode === "login" ? t("login") : t("register"))} onPress={submit} />

          <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 18, fontSize: 12 }}>Admin: admin@lemarrakechi.com / admin123</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Input({ icon, placeholder, value, onChange, theme, isRTL, keyboard, secure, testID }: any) {
  return (
    <View style={[st.inputWrap, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <Ionicons name={icon} size={20} color={theme.gold} />
      <TextInput testID={testID} placeholder={placeholder} placeholderTextColor={theme.textMuted} value={value} onChangeText={onChange}
        secureTextEntry={secure} keyboardType={keyboard} autoCapitalize="none"
        style={[{ flex: 1, color: theme.text, marginHorizontal: 10, fontSize: 15 }, txtAlign(isRTL)]} />
    </View>
  );
}

const st = StyleSheet.create({
  logo: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 12 },
  brandLogo: { width: 220, height: 150, alignSelf: "center", marginBottom: 20 },
  brand: { fontSize: 24, fontWeight: "900", letterSpacing: 2, textAlign: "center", marginBottom: 28 },
  tabs: { flexDirection: "row", borderRadius: radius.pill, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: radius.pill, alignItems: "center" },
  inputWrap: { alignItems: "center", padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 14 },
});
