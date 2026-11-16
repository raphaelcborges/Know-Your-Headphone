import type { ReactNode } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { styles } from "../theme";

/** Acima disso a janela é desktop e a moldura de celular entra. */
const DESKTOP_BREAKPOINT = 768;

const PHONE = { width: 390, height: 844 };

/**
 * No navegador desktop, emoldura o app no tamanho de um celular para o preview
 * bater com o que se vê no aparelho. No app nativo e em telas estreitas
 * (celular real, PWA instalado) não faz nada — o app ocupa a tela inteira.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();

  const framed = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  if (!framed) return <>{children}</>;

  // Encolhe a moldura se a janela for baixa demais, mantendo a proporção.
  const frameHeight = Math.min(PHONE.height, height - 48);
  const frameWidth = Math.min(PHONE.width, frameHeight * (PHONE.width / PHONE.height));

  return (
    <View style={styles.frameBackdrop}>
      <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
        <View style={styles.frameClip}>{children}</View>
      </View>
    </View>
  );
}
