import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { AppProvider } from "@/src/context";
import { api } from "@/src/api";

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();
  const [arLoaded] = useFonts({
    ArefRuqaa: require("@/assets/fonts/ArefRuqaa-Bold.ttf"),
    ArefRuqaaRegular: require("@/assets/fonts/ArefRuqaa-Regular.ttf"),
    Amiri: require("@/assets/fonts/Amiri-Bold.ttf"),
  });

  useEffect(() => {
    if ((loaded || error) && arLoaded) SplashScreen.hideAsync();
  }, [loaded, error, arLoaded]);

  useEffect(() => {
    // Seed demo data once (idempotent server-side).
    api.post("/seed").catch(() => {});
  }, []);

  if ((!loaded && !error) || !arLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
