import { Pressable, Text, View } from "react-native";
import { useFavoritos } from "../favoritos/FavoritosContext";
import { styles } from "../theme";

interface BotaoFavoritoProps {
  produtoId: string;
}

export function BotaoFavorito({ produtoId }: BotaoFavoritoProps) {
  const { ehFavorito, alternar, erro } = useFavoritos();
  const salvo = ehFavorito(produtoId);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: salvo }}
        onPress={() => void alternar(produtoId)}
        style={({ pressed }) => [
          styles.favoritoBotao,
          salvo && styles.favoritoBotaoAtivo,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={[styles.favoritoMarca, salvo && styles.favoritoMarcaAtiva]} />
        <Text style={styles.favoritoTexto}>{salvo ? "Salvo" : "Salvar"}</Text>
      </Pressable>
      {erro && <Text style={styles.favoritoAviso}>{erro}</Text>}
    </View>
  );
}
