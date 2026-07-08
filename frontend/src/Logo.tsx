import { View, Text, StyleSheet, TextStyle } from "react-native";

/**
 * LE MARRAKECHI brand logo with Quranic-style Arabic calligraphy (Aref Ruqaa)
 * for the word "المراكشي", with an optional Latin subtitle.
 */
export function Logo({
  size = 52,
  color = "#D4AF37",
  latinColor = "#B8A88F",
  showLatin = true,
  align = "center",
}: {
  size?: number;
  color?: string;
  latinColor?: string;
  showLatin?: boolean;
  align?: "center" | "flex-start" | "flex-end";
}) {
  return (
    <View style={{ alignItems: align }}>
      <Text style={[styles.arabic, { fontSize: size, color, textShadowColor: "rgba(0,0,0,0.35)" } as TextStyle]}>
        المراكشي
      </Text>
      {showLatin && (
        <Text style={[styles.latin, { color: latinColor, fontSize: Math.max(11, size * 0.24) }]}>
          LE MARRAKECHI
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  arabic: {
    fontFamily: "ArefRuqaa",
    includeFontPadding: false,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: undefined,
  },
  latin: {
    fontWeight: "800",
    letterSpacing: 5,
    marginTop: 6,
  },
});
