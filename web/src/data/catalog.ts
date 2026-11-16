import type { Activity, HeadphoneType, PriceRange, Product } from "./types";

export const ACTIVITIES: { id: Activity; label: string; emoji: string }[] = [
  { id: "jogos", label: "Jogos", emoji: "🎮" },
  { id: "musica", label: "Música", emoji: "🎵" },
  { id: "filme", label: "Filme", emoji: "🎬" },
  { id: "estudo", label: "Estudo", emoji: "📚" },
];

export const PRICE_RANGES: PriceRange[] = [
  { id: "50-100", label: "Entre R$ 50 e R$ 100", min: 50, max: 100 },
  { id: "100-150", label: "Entre R$ 100 e R$ 150", min: 100, max: 150 },
  { id: "150-250", label: "Entre R$ 150 e R$ 250", min: 150, max: 250 },
  { id: "250-450", label: "Entre R$ 250 e R$ 450", min: 250, max: 450 },
  { id: "500-800", label: "Entre R$ 500 e R$ 800", min: 500, max: 800 },
  { id: "800+", label: "Acima de R$ 800", min: 800, max: Infinity },
];

/** Tipos oferecidos por atividade — jogos pede headset, o resto pede headphone. */
export function typesForActivity(activity: Activity): HeadphoneType[] {
  return activity === "jogos" ? ["headset", "fone"] : ["headphone", "fone"];
}

export const TYPE_LABELS: Record<HeadphoneType, string> = {
  fone: "Fone (intra-auricular)",
  headset: "Headset (com microfone)",
  headphone: "Headphone (over-ear)",
};

export const PRODUCTS: Product[] = [
  {
    id: "havit-h2015d",
    name: "Headset para jogos HAVIT H2015d, com microfone, alto-falante 50mm, plugue 3,5mm",
    price: 189.0,
    imageUrl: "https://m.media-amazon.com/images/I/41+xySdozSL._AC_SX679_.jpg",
    description: "Compatível com PS5, PS4 e Xbox. Alto-falante de 50mm e microfone embutido.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "havit-hv-h2002d",
    name: "Headset Havit HV-H2002d Pink, Gamer, com Microfone, Falante 53mm",
    price: 175.0,
    imageUrl: "https://m.media-amazon.com/images/I/61paInMrBkL._AC_SX679_.jpg",
    description: "Plug 3,5mm, compatível com Xbox One e PS4. Falante de 53mm.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "fifine-ampligame-h3",
    name: "FIFINE Ampligame H3 — microfone destacável, cancelamento passivo de ruído, RGB",
    price: 227.0,
    imageUrl: "https://m.media-amazon.com/images/I/716bSraFfUL._AC_SX679_.jpg",
    description: "Conector 3,5mm, compatível com Switch, Xbox, PC, PS4 e PS5.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "pichau-p852-atria",
    name: "Headset Gamer Pichau P852 Atria, com microfone, falante 53mm",
    price: 328.9,
    imageUrl: "https://m.media-amazon.com/images/I/51Dd-LBl67L._AC_SX679_.jpg",
    description: "Plug 3,5mm, compatível com PC, Xbox One e PS4.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "redragon-zeus-pro-h510",
    name: "Headset Redragon Sem Fio Zeus Pro 7.1 — H510-PRO",
    price: 349.99,
    imageUrl: "https://m.media-amazon.com/images/I/619T-Fp+EkL._AC_SX679_.jpg",
    description: "Som surround 7.1 e conexão sem fio.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "havit-hv-h2232d",
    name: "Headset Havit HV-H2232d",
    price: 79.99,
    imageUrl: "https://m.media-amazon.com/images/I/516HwNOJoUL._AC_SX679_.jpg",
    description: "Opção de entrada para quem quer gastar pouco.",
    type: "headset",
    activities: ["jogos"],
  },
  {
    id: "kz-edx-pro",
    name: "Fone de Ouvido KZ EDX Pro com Microfone — Ciano",
    price: 69.8,
    imageUrl: "https://m.media-amazon.com/images/I/61021LVPjvL._AC_SX679_.jpg",
    description: "Intra-auricular com microfone no cabo. Bom custo-benefício para uso geral.",
    type: "fone",
    activities: ["jogos", "musica", "filme", "estudo"],
  },
  {
    id: "qcy-h3-pro-anc",
    name: "QCY H3 PRO ANC — Bluetooth, cancelamento ativo de 50 dB, LDAC, 55h",
    price: 350.1,
    imageUrl: "https://m.media-amazon.com/images/I/51uYWKaLJ0L._AC_SX679_.jpg",
    description: "Over-ear com ANC adaptativo, áudio de alta resolução LDAC e 55 horas de bateria.",
    type: "headphone",
    activities: ["musica", "filme", "estudo"],
  },
];

export function filterProducts(
  activity: Activity,
  range: PriceRange,
  type: HeadphoneType,
): Product[] {
  return PRODUCTS.filter(
    (p) =>
      p.type === type &&
      p.activities.includes(activity) &&
      p.price >= range.min &&
      p.price <= range.max,
  ).sort((a, b) => a.price - b.price);
}

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
