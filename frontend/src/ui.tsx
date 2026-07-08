import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useApp } from "@/src/context";
import { spacing, radius } from "@/src/theme";

const LOGO = require("@/assets/images/brand-logo.png");

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { theme } = useApp();
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[{ flex: 1, backgroundColor: theme.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

export function Header({ title, back = false, right }: { title: string; back?: boolean; right?: React.ReactNode }) {
  const { theme, isRTL } = useApp();
  const router = useRouter();
  return (
    <View style={[hs.wrap, { borderBottomColor: theme.border, backgroundColor: theme.bg }]}>
      {back ? (
        <Pressable testID="header-back" onPress={() => router.back()} style={hs.icon} hitSlop={10}>
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={26} color={theme.gold} />
        </Pressable>
      ) : <View style={hs.icon} />}
      <View style={hs.center}>
        <Image source={LOGO} style={hs.logo} contentFit="contain" />
        <Text style={[hs.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
      </View>
      <View style={hs.icon}>{right}</View>
    </View>
  );
}

export function GoldButton({ label, onPress, testID, icon, style }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <LinearGradient colors={["#E8C766", "#C9A24B", "#A8791F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={gb.btn}>
        {icon ? <Ionicons name={icon} size={18} color="#2B1B12" style={{ marginRight: 8 }} /> : null}
        <Text style={gb.txt}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function Price({ value, color }: { value: number; color?: string }) {
  return <Text style={{ color: color || "#D4AF37", fontWeight: "800" }}>{value.toFixed(2)} OMR</Text>;
}

export function txtAlign(isRTL: boolean) {
  return { textAlign: isRTL ? "right" as const : "left" as const, writingDirection: isRTL ? "rtl" as const : "ltr" as const };
}

const hs = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderBottomWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  logo: { width: 30, height: 30 },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", flexShrink: 1 },
});
const gb = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 15, borderRadius: radius.pill, paddingHorizontal: 24 },
  txt: { color: "#2B1B12", fontWeight: "800", fontSize: 16 },
});
export { ScrollView };
