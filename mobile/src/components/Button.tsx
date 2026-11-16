import { Pressable, Text } from "react-native";
import { styles } from "../theme";

/** Ação secundária: só contorno, para não competir com o CTA. */
export function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}
