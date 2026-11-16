import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import type { ReactNode } from "react";

/**
 * Some e volta a cada troca de tela: um deslize curto com esmaecida. É o que
 * separa a sensação de "aplicativo" da de "página que recarregou".
 */
export function Transicao({ chave, children }: { chave: string; children: ReactNode }) {
  const progresso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progresso.setValue(0);
    Animated.timing(progresso, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [chave, progresso]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: progresso,
        transform: [{ translateY: progresso.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}
