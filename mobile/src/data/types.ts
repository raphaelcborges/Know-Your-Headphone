export type Activity =
  | "jogos"
  | "filme"
  | "musica"
  | "estudo"
  | "jogos-competitivos"
  | "jogos-casuais"
  | "filmes-series"
  | "trabalho-chamadas"
  | "academia-corrida"
  | "producao-musical";

/** "fone" = intra-auricular; "headset" = com microfone (jogos); "headphone" = over-ear */
export type HeadphoneType = "fone" | "headset" | "headphone";

export type Environment = "casa" | "rua" | "trabalho";
export type Priority =
  | "som"
  | "conforto"
  | "microfone"
  | "isolamento"
  | "bateria"
  | "portabilidade"
  | "custo-beneficio";
export type Connection = "cabeado" | "bluetooth" | "tanto-faz";
export type SoundPreference = "grave" | "natural" | "vozes" | "detalhes" | "nao-sei";
export type Fit = "intra-auricular" | "earbud" | "on-ear" | "over-ear";
export type Design = "aberto" | "fechado";
export type Platform = "pc" | "playstation" | "xbox" | "iphone" | "android";
export type SoundSignature =
  | "natural"
  | "energetico"
  | "basshead"
  | "neutro-quente"
  | "neutro-frio"
  | "v-shaped"
  | "musical";

export interface RecommendationPreferences {
  activity: Activity;
  range: PriceRange;
  type: HeadphoneType;
  environment: Environment;
  priority: Priority;
  connection: Connection;
  soundPreference: SoundPreference;
  /** Substitui o teto da faixa quando a pessoa digita um valor próprio. */
  maxPrice?: number;
  /** Se falso, importados são comparados pelo preço do produto antes dos tributos estimados. */
  includeImportTaxes?: boolean;
}

export interface Recommendation {
  product: Product;
  compatibility: number;
  reasons: string[];
  warning?: string;
  breakdown: {
    label: string;
    points: number;
    maxPoints: number;
    explanation: string;
    /** Filtro que todo fone da lista já cumpre — não entra na porcentagem. */
    requisito?: boolean;
  }[];
}

/** Uma loja onde o modelo pode ser comprado. */
export interface Store {
  /** Como aparece no botão: "Amazon", "Mercado Livre", "AliExpress"… */
  label: string;
  url: string;
}

/** Uma linha da ficha técnica: "Driver" → "Dinâmico de 10mm". */
export interface Spec {
  label: string;
  value: string;
}

export interface FrequencyResponseMeasurement {
  label: string;
  url: string;
  source: string;
}

export interface Product {
  /** Identificador único e estável, em kebab-case. */
  id: string;
  name: string;
  /** Em reais, como número — o preço formatado é derivado na UI. */
  price: number;
  /** Para importados, permite explicar como o preço final foi composto. */
  importBasePrice?: number;
  estimatedImportTaxes?: number;
  /** Quando esse preço foi conferido, em AAAA-MM-DD. Preço envelhece. */
  priceCheckedAt?: string;
  /** Opcional: quando ausente, a interface usa as iniciais do modelo. */
  imageUrl?: string;
  description?: string;
  /** Uma ou mais lojas; a primeira aparece em destaque. */
  stores?: Store[];
  /** A oferta indicada é internacional e pode gerar tributos no Brasil. */
  internationalPurchase?: boolean;
  /** Review em vídeo, se houver. */
  reviewUrl?: string;
  /**
   * Link para a curva de resposta em frequência medida, no graph.hangout.audio.
   * Formato: ?share=Nome_Do_Arquivo_Com_Underscores
   */
  graphUrl?: string;
  /** Medições verificadas do mesmo modelo em um ou mais bancos. */
  frequencyResponse?: FrequencyResponseMeasurement[];
  /** Ficha técnica, mostrada como lista na tela de detalhes. */
  specs?: Spec[];
  /**
   * Sua leitura sobre o fone — para quem serve, o que incomoda, com o que
   * combina. Fica recolhida atrás de "Aprofundamento do curador"; sem texto,
   * a seção some.
   */
  curadoria?: string;
  type: HeadphoneType;
  /** Para quais usos este modelo é indicado — pode ser mais de um. */
  activities: Activity[];
  /** Metadados objetivos opcionais. Só preencha depois de conferir com o fabricante. */
  connection?: Exclude<Connection, "tanto-faz"> | "ambos";
  soundSignature?: SoundSignature;
  hasMicrophone?: boolean;
  hasANC?: boolean;
  batteryHours?: number;
  fit?: Fit;
  design?: Design;
  strengths?: Priority[];
  weaknesses?: string[];
  bestFor?: string[];
  avoidIf?: string[];
  platforms?: Platform[];
  equalization?: string;
  score?: {
    sound: number;
    comfort: number;
    microphone: number;
    isolation: number;
    battery: number;
    portability: number;
    value: number;
  };
  priceHistory?: { date: string; price: number }[];
  /** Curadorias externas que recomendam o modelo (ex.: Mind the Headphone). */
  recommendedBy?: { label: string; url: string; checkedAt?: string; note?: string }[];
}

export interface UserReview {
  id: string;
  productId: string;
  userId: string;
  comfort: number;
  sound: number;
  microphone?: number;
  comment?: string;
  createdAt: string;
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}
