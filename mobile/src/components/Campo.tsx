import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { colors, styles } from "../theme";

interface CampoProps extends Omit<TextInputProps, "style"> {
  rotulo: string;
  erro?: string;
}

/** Campo de formulário: rótulo em versalete, linha embaixo, erro logo abaixo. */
export function Campo({ rotulo, erro, ...resto }: CampoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.campo}>
      <Text style={styles.campoRotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        onFocus={(e) => {
          setFocado(true);
          resto.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          resto.onBlur?.(e);
        }}
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.accent}
        accessibilityLabel={rotulo}
        style={[
          styles.campoEntrada,
          focado && styles.campoEntradaFoco,
          erro && styles.campoEntradaErro,
        ]}
      />
      {erro && <Text style={styles.campoErro}>{erro}</Text>}
    </View>
  );
}
