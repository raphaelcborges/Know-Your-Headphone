import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { formatPrice } from "../data/catalog";
import type { Product, Recommendation } from "../data/types";
import { styles } from "../theme";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  recommendation?: Recommendation;
  badge?: string;
  onCompare?: () => void;
  comparing?: boolean;
  featured?: boolean;
}

const SHORT_NAMES: Record<string, string> = {
  "haylou-s30-pro": "Haylou S30 Pro",
  "oneodio-pro-10": "OneOdio Pro-10",
  "anker-soundcore-q30": "Soundcore Q30",
  "qcy-h3-pro-anc": "QCY H3 Pro ANC",
};

function shortName(product: Product) {
  if (SHORT_NAMES[product.id]) return SHORT_NAMES[product.id];
  return product.name
    .split(/\s+[—–]\s+/)[0]
    .split(",")[0]
    .replace(/^headset para jogos\s+/i, "")
    .replace(/^headset gamer\s+/i, "")
    .replace(/^headset\s+/i, "")
    .replace(/^fone de ouvido\s+/i, "")
    .replace(/\s+com microfone.*$/i, "")
    .trim();
}

export function ProductCard({ product, onPress, recommendation, badge, onCompare, comparing, featured }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const displayName = shortName(product);
  if (featured) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.featuredCard, pressed && styles.buttonPressed]}>
        <View style={styles.featuredVisual}>
          {imageFailed || !product.imageUrl ? (
            <Text style={styles.cardFallback}>{displayName.slice(0, 2).toUpperCase()}</Text>
          ) : (
            <Image source={{ uri: product.imageUrl }} style={styles.featuredImage} resizeMode="contain" onError={() => setImageFailed(true)} />
          )}
          {recommendation && (
            <View style={styles.featuredScoreFloat}>
              <Text style={styles.featuredScoreNumber}>{recommendation.compatibility}%</Text>
              <Text style={styles.featuredScoreLabel}>MATCH</Text>
            </View>
          )}
        </View>
        <View style={styles.featuredContent}>
          <Text style={styles.cardBadge}>{badge ?? "Melhor escolha"}</Text>
          <Text style={styles.featuredName}>{displayName}</Text>
          <View style={styles.featuredFooter}>
            <Text style={styles.featuredPrice}>{formatPrice(product.price)}</Text>
            <Text style={styles.featuredOpen}>Ver detalhes  →</Text>
          </View>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.buttonPressed]}
    >
      <View style={[styles.cardThumb, featured && styles.cardThumbFeatured]}>
        {imageFailed || !product.imageUrl ? (
          <Text style={styles.cardFallback}>{displayName.slice(0, 2).toUpperCase()}</Text>
        ) : (
          <Image source={{ uri: product.imageUrl }} style={styles.cardImage} resizeMode="contain" onError={() => setImageFailed(true)} />
        )}
      </View>
      <View style={styles.cardBody}>
        {featured && recommendation && (
          <View style={styles.featuredMatch}>
            <Text style={styles.featuredMatchNumber}>{recommendation.compatibility}%</Text>
            <Text style={styles.featuredMatchLabel}>MATCH</Text>
          </View>
        )}
        {(badge || recommendation) && (
          <Text style={styles.cardBadge}>{badge ?? `${recommendation!.compatibility}% compatível`}</Text>
        )}
        <Text style={[styles.cardName, featured && styles.cardNameFeatured]} numberOfLines={3}>
          {displayName}
        </Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>
          {recommendation && !featured && <Text style={styles.cardScore}>{recommendation.compatibility}% compatível</Text>}
        </View>
        {onCompare && (
          <Pressable accessibilityRole="button" onPress={(event) => { event.stopPropagation(); onCompare(); }}>
            <Text style={styles.cardCompare}>{comparing ? "✓ Na comparação" : "+ Comparar"}</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.cardChevron}>›</Text>
    </Pressable>
  );
}
