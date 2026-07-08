import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { useApp } from "@/src/context";

export default function TabsLayout() {
  const { theme, t, cartCount } = useApp();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.gold,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 66,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: t("menu"), tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} /> }} />
      <Tabs.Screen name="boutique" options={{ title: t("boutique"), tabBarIcon: ({ color, size }) => (
        <View>
          <Ionicons name="bag-handle" size={size} color={color} />
          {cartCount > 0 && <View style={st.badge}><Text style={st.badgeTxt}>{cartCount}</Text></View>}
        </View>
      ) }} />
      <Tabs.Screen name="music" options={{ title: t("music"), tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" size={size} color={color} /> }} />
      <Tabs.Screen name="reserve" options={{ title: t("reserve"), tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}
const st = StyleSheet.create({
  badge: { position: "absolute", top: -6, right: -10, backgroundColor: "#C87A3F", minWidth: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
