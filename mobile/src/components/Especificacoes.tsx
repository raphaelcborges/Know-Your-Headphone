import { Text, View } from "react-native";
import type { Spec } from "../data/types";
import { styles } from "../theme";

export function Especificacoes({ specs }: { specs: Spec[] }) {
  return (
    <View style={styles.ficha}>
      {specs.map((spec) => (
        <View key={spec.label} style={styles.fichaLinha}>
          <Text style={styles.fichaRotulo}>{spec.label}</Text>
          <Text style={styles.fichaValor}>{spec.value}</Text>
        </View>
      ))}
    </View>
  );
}
