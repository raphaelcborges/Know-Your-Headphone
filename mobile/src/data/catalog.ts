import { PRODUCTS as RAW_PRODUCTS } from "./products.ts";
import { MTH_BY_ID, MTH_SOURCE } from "./mindtheheadphone.ts";
import type {
  Activity,
  Connection,
  Environment,
  HeadphoneType,
  PriceRange,
  Priority,
  Product,
  Recommendation,
  RecommendationPreferences,
  SoundPreference,
} from "./types.ts";

/**
 * O catálogo com as classificações do Mind the Headphone por baixo: o que está
 * em products.ts sempre ganha; a fonte externa só preenche o que falta.
 */
function enrich(product: Product): Product {
  const mth = MTH_BY_ID.get(product.id);
  if (!mth) return product;
  return {
    ...product,
    soundSignature: product.soundSignature ?? mth.signature,
    fit: product.fit ?? mth.fit,
    connection: product.connection ?? mth.connection,
    hasMicrophone: product.hasMicrophone ?? (mth.gamer ? true : undefined),
    reviewUrl: product.reviewUrl ?? mth.reviewUrl,
    recommendedBy: product.recommendedBy ?? [
      {
        label: MTH_SOURCE.label,
        url: MTH_SOURCE[mth.list],
        checkedAt: MTH_SOURCE.collectedAt,
        note: MTH_SOURCE.ownBrandIdPrefixes.some((prefix) => product.id.startsWith(prefix))
          ? MTH_SOURCE.ownBrandNote
          : undefined,
      },
    ],
  };
}

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(enrich);

export const SIGNATURE_LABELS: Record<NonNullable<Product["soundSignature"]>, string> = {
  natural: "Natural",
  "neutro-quente": "Neutro-quente",
  "neutro-frio": "Neutro-frio",
  energetico: "Enérgico",
  basshead: "Basshead (muito grave)",
  "v-shaped": "Em V (graves e agudos fortes)",
  musical: "Musical",
};

export const ACTIVITIES: { id: Activity; label: string; hint: string }[] = [
  { id: "musica", label: "Música", hint: "Ouvir no dia a dia" },
  { id: "jogos-competitivos", label: "Jogos competitivos", hint: "Passos, direção e voz no chat" },
  { id: "jogos-casuais", label: "Jogos casuais", hint: "Imersão e diversão" },
  { id: "filmes-series", label: "Filmes e séries", hint: "Diálogos e impacto" },
  { id: "trabalho-chamadas", label: "Trabalho e chamadas", hint: "Voz clara e conforto" },
  { id: "academia-corrida", label: "Academia e corrida", hint: "Firmeza e portabilidade" },
  { id: "estudo", label: "Estudo", hint: "Horas de uso sem incomodar" },
  { id: "producao-musical", label: "Produção musical", hint: "Som preciso e equilibrado" },
];

export const ACTIVITY_LABELS = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a.label]),
) as Record<Activity, string>;
ACTIVITY_LABELS.jogos = "Jogos";
ACTIVITY_LABELS.filme = "Filme";

export const PRICE_RANGES: PriceRange[] = [
  { id: "ate-100", label: "Até R$ 100", min: 0, max: 100 },
  { id: "100-250", label: "R$ 100 a R$ 250", min: 100, max: 250 },
  { id: "250-500", label: "R$ 250 a R$ 500", min: 250, max: 500 },
  { id: "500-1000", label: "R$ 500 a R$ 1.000", min: 500, max: 1000 },
  { id: "1000+", label: "Acima de R$ 1.000", min: 1000, max: Infinity },
];

/** Tipos oferecidos por atividade — jogos pede headset, o resto pede headphone. */
export function typesForActivity(activity: Activity): HeadphoneType[] {
  return activity === "jogos" || activity.startsWith("jogos-") || activity === "trabalho-chamadas"
    ? ["headset", "headphone", "fone"]
    : ["headphone", "fone"];
}

export const TYPE_META: Record<HeadphoneType, { label: string; hint: string }> = {
  fone: { label: "Fone", hint: "Intra-auricular, cabe no bolso" },
  headset: { label: "Headset", hint: "Com microfone, para jogar e conversar" },
  headphone: { label: "Headphone", hint: "Over-ear, abafa o ambiente" },
};

export const TYPE_LABELS: Record<HeadphoneType, string> = {
  fone: "Fone (intra-auricular)",
  headset: "Headset (com microfone)",
  headphone: "Headphone (over-ear)",
};

export const ENVIRONMENTS: { id: Environment; label: string; hint: string }[] = [
  { id: "casa", label: "Em casa", hint: "Ambiente mais silencioso" },
  { id: "rua", label: "Rua e transporte", hint: "Barulho e uso em movimento" },
  { id: "trabalho", label: "Trabalho ou estudo", hint: "Chamadas e muitas horas de uso" },
];

export const PRIORITIES: { id: Priority; label: string; hint: string }[] = [
  { id: "som", label: "Qualidade de som", hint: "Clareza e reprodução musical" },
  { id: "conforto", label: "Conforto", hint: "Uso por várias horas" },
  { id: "microfone", label: "Microfone", hint: "Chamadas e conversa em jogos" },
  { id: "isolamento", label: "Menos ruído", hint: "Isolamento ou ANC" },
  { id: "bateria", label: "Bateria", hint: "Mais tempo longe da tomada" },
  { id: "portabilidade", label: "Portabilidade", hint: "Levar e guardar com facilidade" },
  { id: "custo-beneficio", label: "Custo-benefício", hint: "Aproveitar melhor o orçamento" },
];

export const SOUND_PREFERENCES: { id: SoundPreference; label: string; hint: string }[] = [
  { id: "grave", label: "Mais grave e impacto", hint: "Batidas fortes e mais energia" },
  { id: "natural", label: "Equilibrado e natural", hint: "Nada chama atenção demais" },
  { id: "vozes", label: "Vozes em destaque", hint: "Vocais e diálogos mais presentes" },
  { id: "detalhes", label: "Mais detalhes e agudos", hint: "Clareza e sensação de definição" },
  { id: "nao-sei", label: "Não sei ainda", hint: "Uma escolha versátil para começar" },
];

export const CONNECTIONS: { id: Connection; label: string; hint: string }[] = [
  { id: "tanto-faz", label: "Tanto faz", hint: "Mostre todas as opções" },
  { id: "bluetooth", label: "Bluetooth", hint: "Liberdade sem cabo" },
  { id: "cabeado", label: "Com fio", hint: "Sem bateria ou atraso" },
];

function searchableText(product: Product): string {
  return [
    product.name,
    product.description,
    ...(product.specs?.flatMap((spec) => [spec.label, spec.value]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("pt-BR");
}

/** Usa apenas metadados conferidos ou indícios objetivos já presentes na ficha. */
function detectedConnection(product: Product): Product["connection"] | undefined {
  if (product.connection) return product.connection;
  const text = searchableText(product);
  if (/bluetooth|tws|wireless|sem fio/.test(text)) return "bluetooth";
  if (/p2|p3|3,5\s*mm|usb|cabo|cabeado/.test(text)) return "cabeado";
  return undefined;
}

function supportsPriority(product: Product, priority: Priority): boolean | undefined {
  if (product.strengths?.includes(priority)) return true;
  if (priority === "microfone") {
    if (product.hasMicrophone !== undefined) return product.hasMicrophone;
    return product.type === "headset" ? true : undefined;
  }
  if (priority === "isolamento") {
    if (product.hasANC !== undefined) return product.hasANC;
    return undefined;
  }
  if (priority === "bateria") return product.batteryHours === undefined ? undefined : product.batteryHours >= 20;
  if (priority === "portabilidade") return product.fit ? ["intra-auricular", "earbud", "on-ear"].includes(product.fit) : product.type === "fone";
  return undefined;
}

function activityMatches(product: Product, activity: Activity): boolean {
  if (product.activities.includes(activity)) return true;
  if (activity.startsWith("jogos-")) return product.activities.includes("jogos");
  if (activity === "filmes-series") return product.activities.includes("filme");
  if (activity === "trabalho-chamadas") return product.activities.includes("estudo") || product.activities.includes("jogos");
  if (activity === "academia-corrida") return product.activities.includes("musica") && product.type === "fone";
  if (activity === "producao-musical") return product.activities.includes("musica");
  return false;
}

const SOUND_MATCH: Record<SoundPreference, Product["soundSignature"][]> = {
  grave: ["basshead", "energetico", "v-shaped"],
  natural: ["natural", "neutro-quente", "musical"],
  vozes: ["natural", "neutro-quente", "neutro-frio"],
  detalhes: ["neutro-frio", "v-shaped", "energetico"],
  "nao-sei": ["natural", "musical", "neutro-quente"],
};

export function rankProducts(preferences: RecommendationPreferences): Recommendation[] {
  const { activity, range, type, environment, priority, connection, soundPreference, maxPrice, includeImportTaxes = true } = preferences;
  const ceiling = maxPrice ?? range.max;
  const budgetPrice = (product: Product) =>
    !includeImportTaxes && product.internationalPurchase && product.importBasePrice !== undefined
      ? product.importBasePrice
      : product.price;
  const candidates = PRODUCTS.filter(
    (product) =>
      product.type === type &&
      activityMatches(product, activity) &&
      budgetPrice(product) >= range.min &&
      budgetPrice(product) <= ceiling &&
      !(priority === "microfone" && product.hasMicrophone === false),
  );

  return candidates
    .map((product) => {
      const breakdown: Recommendation["breakdown"] = [
        { label: "Orçamento", points: 25, maxPoints: 25, explanation: maxPrice ? `Dentro do limite de ${formatPrice(maxPrice)}` : `Dentro da faixa ${range.label.toLowerCase()}` },
        { label: "Uso principal", points: 20, maxPoints: 20, explanation: `Indicado para ${ACTIVITY_LABELS[activity].toLowerCase()}` },
        { label: "Formato", points: 10, maxPoints: 10, explanation: "É do tipo que você escolheu" },
      ];
      const reasons = [breakdown[1].explanation, breakdown[0].explanation];
      let warning: string | undefined;
      const actualConnection = detectedConnection(product);

      if (connection === "tanto-faz") {
        breakdown.push({ label: "Conexão", points: 10, maxPoints: 10, explanation: "Você aceita qualquer tipo de conexão" });
      } else if (!actualConnection) {
        breakdown.push({ label: "Conexão", points: 5, maxPoints: 10, explanation: "A conexão ainda não foi confirmada" });
      }
      else if (actualConnection === connection || actualConnection === "ambos") {
        const explanation = connection === "bluetooth" ? "Tem conexão sem fio" : "Pode ser usado com fio";
        breakdown.push({ label: "Conexão", points: 10, maxPoints: 10, explanation });
        reasons.push(explanation);
      } else {
        breakdown.push({ label: "Conexão", points: 0, maxPoints: 10, explanation: "Não corresponde à conexão escolhida" });
        warning = connection === "bluetooth" ? "A conexão sem fio não foi confirmada" : "O uso com fio não foi confirmado";
      }

      const prioritySupport = supportsPriority(product, priority);
      let priorityPoints = 8;
      let priorityExplanation = "Não há dados suficientes para confirmar totalmente este critério";
      if (prioritySupport === true) {
        priorityPoints = 15;
        priorityExplanation = `Atende à prioridade: ${PRIORITIES.find((item) => item.id === priority)?.label.toLowerCase()}`;
        reasons.push(priorityExplanation);
      } else if (prioritySupport === false) {
        priorityPoints = 0;
        priorityExplanation = "Não atende bem à prioridade escolhida";
        warning ||= `Pode não atender bem à prioridade escolhida`;
      } else if (priority === "custo-beneficio") {
        const span = Number.isFinite(range.max) ? range.max - range.min : Math.max(range.min, 1);
        const position = Math.max(0, Math.min(1, (budgetPrice(product) - range.min) / Math.max(span, 1)));
        priorityPoints = Math.round(15 * (1 - position));
        priorityExplanation = "Aproveita bem o orçamento disponível";
        reasons.push(priorityExplanation);
      }

      const scoreKey = {
        som: "sound",
        conforto: "comfort",
        microfone: "microphone",
        isolamento: "isolation",
        bateria: "battery",
        portabilidade: "portability",
        "custo-beneficio": "value",
      }[priority] as keyof NonNullable<Product["score"]>;
      const productScore = product.score?.[scoreKey];
      if (prioritySupport === undefined && priority !== "custo-beneficio" && productScore !== undefined) {
        priorityPoints = Math.round((productScore / 10) * 15);
        priorityExplanation = `Desempenho registrado: ${productScore}/10 neste critério`;
      }
      breakdown.push({ label: "Sua prioridade", points: priorityPoints, maxPoints: 15, explanation: priorityExplanation });

      const soundMatches = product.soundSignature && SOUND_MATCH[soundPreference].includes(product.soundSignature);
      const soundPoints = soundMatches ? 10 : (!product.soundSignature || soundPreference === "nao-sei" ? 7 : 2);
      const soundExplanation = soundMatches
        ? "A assinatura sonora combina com sua preferência"
        : soundPreference === "nao-sei"
          ? "Perfil sonoro versátil para quem ainda está descobrindo sua preferência"
          : !product.soundSignature ? "A assinatura sonora ainda não foi confirmada" : "O perfil sonoro difere do escolhido";
      breakdown.push({ label: "Som", points: soundPoints, maxPoints: 10, explanation: soundExplanation });
      if (soundMatches) reasons.push(soundExplanation);

      let environmentPoints = 10;
      let environmentExplanation = "Funciona bem em um ambiente mais silencioso";
      if (environment === "rua") {
        environmentPoints = product.hasANC === true ? 10 : product.hasANC === false ? 2 : 5;
        environmentExplanation = product.hasANC === true ? "O ANC ajuda em ambientes barulhentos" : product.hasANC === false ? "Não possui ANC para reduzir o barulho externo" : "O isolamento ainda não foi confirmado";
      } else if (environment === "trabalho") {
        environmentPoints = product.hasMicrophone === true ? 10 : product.hasMicrophone === false ? 2 : 5;
        environmentExplanation = product.hasMicrophone === true ? "Tem microfone para chamadas" : product.hasMicrophone === false ? "Não possui microfone para chamadas" : "O microfone ainda não foi confirmado";
      }
      breakdown.push({ label: "Ambiente", points: environmentPoints, maxPoints: 10, explanation: environmentExplanation });

      const score = breakdown.reduce((total, item) => total + item.points, 0);

      return { product, compatibility: Math.max(1, Math.min(100, score)), reasons: reasons.slice(0, 3), warning, breakdown };
    })
    .sort((a, b) => b.compatibility - a.compatibility || a.product.price - b.product.price);
}

export function cheaperAlternative(recommendation: Recommendation, all: Recommendation[]) {
  return all.find((item) => item.product.price < recommendation.product.price);
}

export function premiumAlternative(recommendation: Recommendation, preferences: RecommendationPreferences) {
  return PRODUCTS.filter(
    (product) => product.type === preferences.type && activityMatches(product, preferences.activity) && product.price > recommendation.product.price,
  ).sort((a, b) => a.price - b.price)[0];
}

export function filterProducts(
  activity: Activity,
  range: PriceRange,
  type: HeadphoneType,
): Product[] {
  return PRODUCTS.filter(
    (p) =>
      p.type === type &&
      activityMatches(p, activity) &&
      p.price >= range.min &&
      p.price <= range.max,
  ).sort((a, b) => a.price - b.price);
}

/**
 * Modelos do mesmo uso e tipo fora da faixa escolhida — servem de saída quando o
 * filtro exato não devolve nada, em vez de deixar a tela vazia.
 */
export function nearbyProducts(activity: Activity, type: HeadphoneType): Product[] {
  return PRODUCTS.filter((p) => p.type === type && activityMatches(p, activity)).sort(
    (a, b) => a.price - b.price,
  );
}

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Quantos dias faz que o preço foi conferido. `null` quando não há data. */
export function priceAgeInDays(product: Product): number | null {
  if (!product.priceCheckedAt) return null;
  const checked = new Date(`${product.priceCheckedAt}T12:00:00`);
  if (Number.isNaN(checked.getTime())) return null;
  return Math.floor((Date.now() - checked.getTime()) / 86_400_000);
}

/**
 * Texto que acompanha o preço. Passados 30 dias o preço deixa de ser confiável,
 * então o app diz isso em vez de fingir que está atualizado.
 */
export function priceNote(product: Product): string {
  const days = priceAgeInDays(product);
  if (days === null) return "Confira o preço na loja";
  if (days <= 1) return "Preço conferido hoje";
  if (days < 30) return `Preço conferido há ${days} dias`;
  const checked = new Date(`${product.priceCheckedAt}T12:00:00`);
  const quando = checked.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return `Preço de ${quando} — confira na loja`;
}
