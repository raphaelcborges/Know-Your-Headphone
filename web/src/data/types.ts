export type Activity = "jogos" | "musica" | "filme" | "estudo";

/** "fone" = intra-auricular; "headset" = com microfone (jogos); "headphone" = over-ear */
export type HeadphoneType = "fone" | "headset" | "headphone";

export interface Product {
  id: string;
  name: string;
  /** Em reais, como número — o preço formatado é derivado na UI. */
  price: number;
  imageUrl: string;
  description?: string;
  productUrl?: string;
  type: HeadphoneType;
  activities: Activity[];
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}
