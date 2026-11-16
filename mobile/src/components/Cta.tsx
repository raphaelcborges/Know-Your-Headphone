import { Pressable, Text } from "react-native";
import { styles } from "../theme";

/** Ação principal: bloco ciano cheio. No máximo um por tela. */
export function Cta({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
    >
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}
