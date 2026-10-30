import { View, Text, StyleSheet } from "react-native";
import { colors, space } from "../theme/tokens";

export function StepBar({ step, total, labels }: { step: number; total: number; labels?: string[] }) {
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const active = n <= step;
          return (
            <View key={n} style={s.item}>
              <View style={[s.dot, active && s.dotOn]}>
                <Text style={[s.dotText, active && s.dotTextOn]}>{n}</Text>
              </View>
              {n < total ? <View style={[s.line, n < step && s.lineOn]} /> : null}
            </View>
          );
        })}
      </View>
      <Text style={s.label}>
        Step {step} of {total}
        {labels?.[step - 1] ? ` · ${labels[step - 1]}` : ""}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: space.lg },
  row: { flexDirection: "row", alignItems: "center" },
  item: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  dotTextOn: { color: "#fff" },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },
  lineOn: { backgroundColor: colors.primary },
  label: { marginTop: space.sm, color: colors.textMuted, fontSize: 13, fontWeight: "600" },
});
