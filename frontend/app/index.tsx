import { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, Easing, withRepeat } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Splash() {
  const router = useRouter();
  const scale = useSharedValue(0.82);
  const opacity = useSharedValue(0);
  const glow = useSharedValue(0.3);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(withTiming(1.03, { duration: 1100, easing: Easing.out(Easing.cubic) }), withTiming(1, { duration: 500 }));
    glow.value = withRepeat(withTiming(0.85, { duration: 1600 }), -1, true);
    shimmer.value = withDelay(500, withTiming(1, { duration: 1200 }));
    const tmr = setTimeout(() => router.replace("/(tabs)"), 3000);
    return () => clearTimeout(tmr);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const lineStyle = useAnimatedStyle(() => ({ width: `${shimmer.value * 55}%`, opacity: shimmer.value }));

  return (
    <View style={s.c} testID="splash-screen">
      <LinearGradient colors={["#0d0a06", "#1B120A", "#0d0a06"]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[s.glow, glowStyle]}>
        <LinearGradient colors={["rgba(212,175,55,0.18)", "transparent"]} style={s.glowInner} />
      </Animated.View>
      <Animated.View style={[s.logoWrap, logoStyle]}>
        <Image source={require("../assets/images/brand-logo.png")} style={s.logo} contentFit="contain" />
      </Animated.View>
      <Animated.View style={[s.divider, lineStyle]} />
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0d0a06" },
  glow: { position: "absolute", width: width, height: width, alignItems: "center", justifyContent: "center" },
  glowInner: { width: width, height: width, borderRadius: width / 2 },
  logoWrap: { width: 330, height: 330, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logo: { width: 330, height: 330 },
  divider: { height: 2, backgroundColor: "#C9A24B", borderRadius: 2, marginTop: -20 },
});
