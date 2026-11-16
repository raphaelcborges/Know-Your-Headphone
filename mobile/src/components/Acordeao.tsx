import { useState } from "react";
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from "react-native";
import type { ReactNode } from "react";
import { styles } from "../theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AcordeaoProps {
  titulo: string;
  children: ReactNode;
  /** Começa aberto? Por padrão fica recolhido. */
  aberto?: boolean;
}

/** Seção que só aparece quando a pessoa pede. */
export function Acordeao({ titulo, children, aberto = false }: AcordeaoProps) {
  const [visivel, setVisivel] = useState(aberto);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: visivel }}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setVisivel((v) => !v);
        }}
        style={styles.acordeaoCabecalho}
      >
        <Text style={styles.acordeaoTitulo}>{titulo}</Text>
        <Text style={styles.acordeaoSinal}>{visivel ? "−" : "+"}</Text>
      </Pressable>
      {visivel && <View style={styles.acordeaoCorpo}>{children}</View>}
    </View>
  );
}
