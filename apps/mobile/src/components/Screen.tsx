import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, space } from "../theme/tokens";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  padded?: boolean;
};

/** One SafeArea wrapper for all main screens — prevents status-bar overlap */
export function Screen({ children, style, edges = ["top"], padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[padded && styles.pad, style, { flex: 1 }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: space.lg },
});
