import { Pressable, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { useFavoritos } from "../favoritos/FavoritosContext";
import { styles } from "../theme";

interface BotaoFavoritoProps {
  produtoId: string;
  /** Chamado quando é preciso ter conta para salvar. */
  onPrecisaEntrar: () => void;
}

export function BotaoFavorito({ produtoId, onPrecisaEntrar }: BotaoFavoritoProps) {
  const { usuario, disponivel } = useAuth();
  const { ehFavorito, alternar, erro } = useFavoritos();

  if (!disponivel) return null;

  const salvo = ehFavorito(produtoId);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: salvo }}
        onPress={() => {
          if (!usuario) onPrecisaEntrar();
          else void alternar(produtoId);
        }}
        style={({ pressed }) => [
          styles.favoritoBotao,
          salvo && styles.favoritoBotaoAtivo,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={[styles.favoritoMarca, salvo && styles.favoritoMarcaAtiva]} />
        <Text style={styles.favoritoTexto}>
          {!usuario ? "Entrar para salvar" : salvo ? "Salvo" : "Salvar"}
        </Text>
      </Pressable>
      {erro && <Text style={styles.favoritoAviso}>{erro}</Text>}
    </View>
  );
}
