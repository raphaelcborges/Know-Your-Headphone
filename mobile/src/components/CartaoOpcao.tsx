import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../theme";

interface CartaoOpcaoProps {
  numero: number;
  titulo: string;
  dica?: string;
  onPress: () => void;
}

function iconePara(titulo: string) {
  const texto = titulo.toLowerCase();
  if (texto.includes("música") || texto.includes("som")) return "♫";
  if (texto.includes("jogo") || texto.includes("game")) return "◇";
  if (texto.includes("filme") || texto.includes("série")) return "▶";
  if (texto.includes("trabalho") || texto.includes("estudo") || texto.includes("escritório")) return "▤";
  if (texto.includes("academia") || texto.includes("corrida")) return "↗";
  if (texto.includes("transporte") || texto.includes("rua") || texto.includes("viagem")) return "⇄";
  if (texto.includes("bluetooth") || texto.includes("sem fio")) return "⌁";
  if (texto.includes("microfone") || texto.includes("headset")) return "◉";
  if (texto.includes("grave")) return "≈";
  if (texto.includes("natural") || texto.includes("equilibr")) return "—";
  if (texto.includes("não sei") || texto.includes("tanto faz")) return "?";
  if (texto.includes("r$")) return "$";
  return "◌";
}

/** Escolha visual do onboarding. */
export function CartaoOpcao({ numero, titulo, dica, onPress }: CartaoOpcaoProps) {
  const [ativo, setAtivo] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => setAtivo(true)}
      onPressOut={() => setAtivo(false)}
      style={[styles.gradeCartao, numero === 1 && styles.gradeCartaoDestaque, ativo && styles.gradeCartaoAtivo]}
    >
      <View style={styles.gradeTopo}>
        <View style={styles.gradeMarca}><Text style={styles.gradeIcone}>{iconePara(titulo)}</Text></View>
        <Text style={styles.gradeNumeroVisivel}>{String(numero).padStart(2, "0")}</Text>
      </View>
      <View>
        <Text style={styles.gradeTitulo}>{titulo}</Text>
        {dica && <Text style={styles.gradeDica}>{dica}</Text>}
      </View>
      <View style={styles.gradeAcao}><Text style={styles.gradeAcaoTexto}>Escolher</Text><Text style={styles.gradeSeta}>→</Text></View>
    </Pressable>
  );
}
