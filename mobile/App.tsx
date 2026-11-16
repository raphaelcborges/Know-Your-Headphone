import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Image, Linking, Pressable, Share, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/lib/supabase";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import { FavoritosProvider, useFavoritos } from "./src/favoritos/FavoritosContext";
import { BotaoFavorito } from "./src/components/BotaoFavorito";
import { AuthScreen } from "./src/screens/AuthScreen";
import { Transicao } from "./src/components/Transicao";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "./src/components/Button";
import { Cta } from "./src/components/Cta";
import { Acordeao } from "./src/components/Acordeao";
import { CartaoOpcao } from "./src/components/CartaoOpcao";
import { Especificacoes } from "./src/components/Especificacoes";
import { PhoneFrame } from "./src/components/PhoneFrame";
import { ProductCard } from "./src/components/ProductCard";
import { Screen } from "./src/components/Screen";
import {
  SIGNATURE_LABELS,
  ACTIVITIES,
  ACTIVITY_LABELS,
  CONNECTIONS,
  ENVIRONMENTS,
  PRIORITIES,
  PRODUCTS,
  SOUND_PREFERENCES,
  TYPE_LABELS,
  TYPE_META,
  formatPrice,
  nearbyProducts,
  priceNote,
  rankProducts,
  premiumAlternative,
  typesForActivity,
} from "./src/data/catalog";
import type {
  Activity,
  Connection,
  Environment,
  HeadphoneType,
  PriceRange,
  Priority,
  Product,
  SoundPreference,
} from "./src/data/types";
import { GRADIENTS, styles } from "./src/theme";

type Step =
  | "inicio"
  | "entrar"
  | "registrar"
  | "atividade"
  | "preco"
  | "tipo"
  | "ambiente"
  | "prioridade"
  | "som"
  | "conexao"
  | "resumo"
  | "analisando"
  | "resultados"
  | "detalhes"
  | "favoritos"
  | "comparador";

interface Choices {
  activity?: Activity;
  range?: PriceRange;
  type?: HeadphoneType;
  environment?: Environment;
  priority?: Priority;
  connection?: Connection;
  soundPreference?: SoundPreference;
  maxPrice?: number;
  includeImportTaxes?: boolean;
  product?: Product;
}

const LOGO = require("./assets/logo.png");

const ICMS_IMPORT_GROUPS = [
  { rate: 0.17, states: "AP, AM, DF, ES, GO, MA, MT, MS, PA, PR, PE, RJ, RS, RO, SC, SP e TO" },
  { rate: 0.20, states: "AC, AL, BA, CE, MG, PB, PI, RN, RR e SE" },
];

export default function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <Fluxo />
      </FavoritosProvider>
    </AuthProvider>
  );
}

function Fluxo() {
  const { usuario, sair } = useAuth();
  const favoritos = useFavoritos();
  const [step, setStep] = useState<Step>("inicio");
  const [choices, setChoices] = useState<Choices>({});
  const [budgetValue, setBudgetValue] = useState(600);
  const [budgetTrackWidth, setBudgetTrackWidth] = useState(1);
  const [includeImportTaxes, setIncludeImportTaxes] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertSaved, setAlertSaved] = useState(false);
  const [reviewScores, setReviewScores] = useState({ sound: "", comfort: "", microphone: "" });
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [analysisStage, setAnalysisStage] = useState(0);
  const [returnToSummary, setReturnToSummary] = useState(false);

  const advance = (next: Step) => {
    if (returnToSummary) {
      setReturnToSummary(false);
      setStep("resumo");
    } else {
      setStep(next);
    }
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : current.length < 3
          ? [...current, productId]
          : current,
    );
  };

  const results = useMemo(() => {
    const { activity, range, type, environment, priority, connection, soundPreference, maxPrice, includeImportTaxes } = choices;
    if (!activity || !range || !type || !environment || !priority || !connection || !soundPreference) return [];
    return rankProducts({ activity, range, type, environment, priority, connection, soundPreference, maxPrice, includeImportTaxes });
  }, [choices]);

  const restart = useCallback(() => {
    setChoices({});
    setStep("inicio");
  }, []);

  /** Um passo para trás; devolve false quando já estamos na tela inicial. */
  const goBack = useCallback(() => {
    switch (step) {
      case "favoritos":
      case "entrar":
      case "registrar":
        setStep("inicio");
        return true;
      case "atividade":
        restart();
        return true;
      case "preco":
        setStep("atividade");
        return true;
      case "tipo":
        setStep("preco");
        return true;
      case "comparador":
        setStep("resultados");
        return true;
      case "ambiente":
        setStep("tipo");
        return true;
      case "prioridade":
        setStep("ambiente");
        return true;
      case "conexao":
        setStep("som");
        return true;
      case "som":
        setStep("prioridade");
        return true;
      case "analisando":
        setStep("resumo");
        return true;
      case "resumo":
        setStep("conexao");
        return true;
      case "resultados":
        setStep("resumo");
        return true;
      case "detalhes":
        setStep("resultados");
        return true;
      default:
        return false;
    }
  }, [step, restart]);

  // Botão físico de voltar do Android sai do app só na tela inicial.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => sub.remove();
  }, [goBack]);

  useEffect(() => {
    if (step !== "analisando") return;
    setAnalysisStage(0);
    const timers = [
      setTimeout(() => setAnalysisStage(1), 250),
      setTimeout(() => setAnalysisStage(2), 600),
      setTimeout(() => setAnalysisStage(3), 950),
      setTimeout(() => setAnalysisStage(4), 1300),
      setTimeout(() => setStep("resultados"), 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  if (step === "inicio") {
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.inicio}>
          <View style={styles.homeTopline}>
            <Text style={styles.homeMonogram}>KYH</Text>
            <Text style={styles.homeToplineText}>PERSONAL AUDIO FINDER</Text>
          </View>
          <View style={styles.hero}>
            <View style={styles.heroVisual}>
              <View style={styles.heroGlow} />
              <Image source={LOGO} style={styles.logoCompact} resizeMode="contain" accessibilityLabel="Know Your Headphone" />
            </View>
            <Text style={styles.heroEyebrow}>ESCOLHA COM CONFIANÇA</Text>
            <Text style={styles.heroTitle}>Seu próximo fone,{`\n`}sem complicação.</Text>
            <Text style={styles.tagline}>
              Descubra em poucos passos qual modelo combina com seu uso e seu orçamento.
            </Text>
            <Text style={styles.heroSteps}>7 PERGUNTAS  ·  CERCA DE 2 MINUTOS</Text>
          </View>
          <View style={styles.heroFooter}>
            <Cta label="Descobrir meu fone" onPress={() => setStep("atividade")} />
            {usuario ? (
              <>
                <Button
                  label={`Seus salvos (${favoritos.produtos.length})`}
                  onPress={() => setStep("favoritos")}
                />
                <View style={styles.contaLinha}>
                  <Text style={styles.contaNome}>Você está em {usuario.email}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void sair().catch(() => {})}
                    hitSlop={12}
                  >
                    <Text style={styles.contaAcao}>Sair</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Button label="Entrar" onPress={() => setStep("entrar")} />
                <Text style={styles.guestNote}>Não precisa criar uma conta para fazer o teste.</Text>
              </>
            )}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "entrar" || step === "registrar") {
    return (
      <Shell chave={step}>
        <AuthScreen
          modo={step}
          onTrocarModo={(modo) => setStep(modo)}
          onPronto={() => setStep("inicio")}
          onVoltar={() => setStep("inicio")}
          onGuest={() => setStep("atividade")}
        />
      </Shell>
    );
  }

  if (step === "favoritos") {
    return (
      <Shell chave={step}>
        <Screen
          gradient={GRADIENTS.lista}
          title="Seus salvos"
          subtitle={
            favoritos.produtos.length > 0
              ? `${favoritos.produtos.length} fone(s) guardados na sua conta.`
              : undefined
          }
          onBack={goBack}
        >
          {favoritos.erro && <Text style={styles.favoritoAviso}>{favoritos.erro}</Text>}
          {favoritos.carregando && <Text style={styles.emptyText}>Carregando…</Text>}
          {!favoritos.carregando && favoritos.produtos.length === 0 && !favoritos.erro && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Você ainda não salvou nenhum fone. Abra um modelo nas recomendações e toque em
                Salvar.
              </Text>
              <Button label="Buscar um fone" onPress={() => setStep("atividade")} />
            </View>
          )}
          <View style={styles.options}>
            {favoritos.produtos.map((product) => (
              <ProductCard key={product.id} product={product} onPress={() => open(product)} />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "atividade") {
    return (
      <Shell chave={step}>
        <Screen
          gradient={GRADIENTS.atividade}
          quiz
          step="Passo 1 de 7"
          progresso={1}
          title="Para que você vai usar?"
          onBack={goBack}
        >
          <View style={styles.grade}>
            {ACTIVITIES.map((activity, i) => (
              <CartaoOpcao
                key={activity.id}
                numero={i + 1}
                titulo={activity.label}
                dica={activity.hint}
                onPress={() => {
                  setChoices((prev) => ({ ...prev, activity: activity.id }));
                  advance("preco");
                }}
              />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "preco") {
    const budgetPercent = ((budgetValue - 100) / 1900) * 100;
    const pricedModels = PRODUCTS.filter((product) => {
      const consideredPrice = !includeImportTaxes && product.internationalPurchase && product.importBasePrice !== undefined
        ? product.importBasePrice
        : product.price;
      return consideredPrice <= budgetValue;
    }).length;
    const updateBudget = (locationX: number) => {
      const raw = 100 + (Math.max(0, Math.min(locationX, budgetTrackWidth)) / budgetTrackWidth) * 1900;
      setBudgetValue(Math.round(raw / 50) * 50);
    };
    return (
      <Shell chave={step}>
        <Screen
          gradient={GRADIENTS.preco}
          quiz
          step="Passo 2 de 7"
          progresso={2}
          title="Qual é o seu limite?"
          subtitle="Ajuste o valor máximo que faz sentido para você."
          onBack={goBack}
        >
          <View style={styles.budgetPanel}>
            <Text style={styles.budgetLabel}>ATÉ</Text>
            <Text style={styles.budgetValue}>{formatPrice(budgetValue)}</Text>
            <View
              style={styles.budgetTrackTouch}
              onLayout={(event) => setBudgetTrackWidth(event.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(event) => updateBudget(event.nativeEvent.locationX)}
              onResponderMove={(event) => updateBudget(event.nativeEvent.locationX)}
              accessibilityLabel={`Orçamento máximo ${formatPrice(budgetValue)}`}
            >
              <View style={styles.budgetTrack}>
                <View style={[styles.budgetTrackFill, { width: `${budgetPercent}%` }]} />
                <View style={[styles.budgetThumb, { left: `${budgetPercent}%` }]} />
              </View>
            </View>
            <View style={styles.budgetScale}>
              <Text style={styles.budgetScaleText}>R$ 100</Text>
              <Text style={styles.budgetScaleText}>R$ 2.000+</Text>
            </View>
            <View style={styles.budgetShortcuts}>
              {[150, 300, 600, 1000].map((value) => (
                <Pressable key={value} onPress={() => setBudgetValue(value)} style={[styles.budgetChip, budgetValue === value && styles.budgetChipActive]}>
                  <Text style={[styles.budgetChipText, budgetValue === value && styles.budgetChipTextActive]}>{value === 1000 ? "R$ 1.000+" : `R$ ${value}`}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.budgetCount}>{pricedModels} modelos no catálogo até esse valor</Text>
          </View>
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: includeImportTaxes }} onPress={() => setIncludeImportTaxes((current) => !current)} style={styles.taxToggleRow}>
            <View style={[styles.taxToggle, includeImportTaxes && styles.taxToggleActive]}>
              <View style={[styles.taxToggleThumb, includeImportTaxes && styles.taxToggleThumbActive]} />
            </View>
            <View style={styles.taxToggleCopy}>
              <Text style={styles.taxToggleTitle}>Incluir impostos no orçamento</Text>
              <Text style={styles.taxToggleHint}>Para ofertas internacionais, considera o total estimado.</Text>
            </View>
          </Pressable>
          <Cta label="Continuar" onPress={() => {
            const range = { id: `max-${budgetValue}`, label: `Até ${formatPrice(budgetValue)}`, min: 0, max: budgetValue };
            setChoices((prev) => ({ ...prev, range, maxPrice: budgetValue, includeImportTaxes, type: undefined }));
            advance("tipo");
          }} />
        </Screen>
      </Shell>
    );
  }

  if (step === "tipo" && choices.activity) {
    return (
      <Shell chave={step}>
        <Screen
          gradient={GRADIENTS.tipo}
          quiz
          step="Passo 3 de 7"
          progresso={3}
          title="Qual formato você prefere?"
          onBack={goBack}
        >
          <View style={styles.grade}>
            {typesForActivity(choices.activity).map((type, i) => (
              <CartaoOpcao
                key={type}
                numero={i + 1}
                titulo={TYPE_META[type].label}
                dica={TYPE_META[type].hint}
                onPress={() => {
                  setChoices((prev) => ({ ...prev, type }));
                  advance("ambiente");
                }}
              />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "ambiente") {
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.tipo} quiz step="Passo 4 de 7" progresso={4} title="Onde você mais vai usar?" onBack={goBack}>
          <View style={styles.grade}>
            {ENVIRONMENTS.map((item, i) => (
              <CartaoOpcao key={item.id} numero={i + 1} titulo={item.label} dica={item.hint} onPress={() => {
                setChoices((prev) => ({ ...prev, environment: item.id }));
                advance("prioridade");
              }} />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "prioridade") {
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.atividade} quiz step="Passo 5 de 7" progresso={5} title="O que mais importa?" onBack={goBack}>
          <View style={styles.grade}>
            {PRIORITIES.map((item, i) => (
              <CartaoOpcao key={item.id} numero={i + 1} titulo={item.label} dica={item.hint} onPress={() => {
                setChoices((prev) => ({ ...prev, priority: item.id }));
                advance("som");
              }} />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "som") {
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.tipo} quiz step="Passo 6 de 7" progresso={6} title="Qual som você prefere?" onBack={goBack}>
          <View style={styles.grade}>
            {SOUND_PREFERENCES.map((item, i) => (
              <CartaoOpcao key={item.id} numero={i + 1} titulo={item.label} dica={item.hint} onPress={() => {
                setChoices((prev) => ({ ...prev, soundPreference: item.id }));
                advance("conexao");
              }} />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "conexao") {
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.preco} quiz step="Passo 7 de 7" progresso={7} title="Com fio ou Bluetooth?" onBack={goBack}>
          <View style={styles.grade}>
            {CONNECTIONS.map((item, i) => (
              <CartaoOpcao key={item.id} numero={i + 1} titulo={item.label} dica={item.hint} onPress={() => {
                setChoices((prev) => ({ ...prev, connection: item.id }));
                advance("resumo");
              }} />
            ))}
          </View>
        </Screen>
      </Shell>
    );
  }

  if (
    step === "resumo" && choices.activity && choices.range && choices.type &&
    choices.environment && choices.priority && choices.soundPreference && choices.connection
  ) {
    const summaryItems: { label: string; value: string; edit: Step }[] = [
      { label: "Uso", value: ACTIVITY_LABELS[choices.activity], edit: "atividade" },
      { label: "Orçamento", value: choices.maxPrice ? `Até ${formatPrice(choices.maxPrice)}` : choices.range.label, edit: "preco" },
      { label: "Formato", value: TYPE_META[choices.type].label, edit: "tipo" },
      { label: "Ambiente", value: ENVIRONMENTS.find((item) => item.id === choices.environment)?.label ?? "", edit: "ambiente" },
      { label: "Prioridade", value: PRIORITIES.find((item) => item.id === choices.priority)?.label ?? "", edit: "prioridade" },
      { label: "Som", value: SOUND_PREFERENCES.find((item) => item.id === choices.soundPreference)?.label ?? "", edit: "som" },
      { label: "Conexão", value: CONNECTIONS.find((item) => item.id === choices.connection)?.label ?? "", edit: "conexao" },
    ];
    const environmentLabel = ENVIRONMENTS.find((item) => item.id === choices.environment)?.label.toLowerCase();
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.atividade} onBack={goBack}>
          <View style={styles.summaryIntro}>
            <Text style={styles.analysisEyebrow}>SEU PERFIL</Text>
            <Text style={styles.summaryTitle}>{ACTIVITY_LABELS[choices.activity]}</Text>
            <Text style={styles.summarySubtitle}>{environmentLabel}</Text>
          </View>
          <View style={styles.summaryCard}>
            {summaryItems.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                onPress={() => { setReturnToSummary(true); setStep(item.edit); }}
                style={({ pressed }) => [styles.summaryRow, pressed && styles.buttonPressed]}
              >
                <View style={styles.summaryRowText}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
                <Text style={styles.summaryEdit}>Editar</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.summaryActions}>
            <Cta label="Encontrar meu fone" onPress={() => setStep("analisando")} />
            <Text style={styles.guestNote}>Confira as respostas antes de continuar.</Text>
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "analisando") {
    const checks = [
      "Entendemos seu tipo de uso",
      "Analisamos seu orçamento",
      "Comparamos os recursos importantes",
      "Ordenamos as melhores opções",
    ];
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.atividade}>
          <View style={styles.analysisPage}>
            <View style={styles.analysisOrb}>
              <View style={styles.analysisOrbInner} />
            </View>
            <View>
              <Text style={styles.analysisEyebrow}>RECOMENDAÇÃO PERSONALIZADA</Text>
              <Text style={styles.analysisTitle}>Encontrando seu fone...</Text>
              <Text style={styles.analysisLead}>Cruzando suas respostas com o catálogo.</Text>
            </View>
            <View style={styles.analysisList}>
              {checks.map((label, index) => {
                const done = analysisStage > index;
                return (
                  <View key={label} style={styles.analysisItem}>
                    <View style={[styles.analysisCheck, done && styles.analysisCheckDone]}>
                      <Text style={[styles.analysisCheckText, done && styles.analysisCheckTextDone]}>{done ? "✓" : ""}</Text>
                    </View>
                    <Text style={[styles.analysisItemText, done && styles.analysisItemTextDone]}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Screen>
      </Shell>
    );
  }

  if (step === "comparador") {
    const compared = compareIds.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean) as Product[];
    const rows: { label: string; value: (product: Product) => string }[] = [
      { label: "Preço", value: (product) => formatPrice(product.price) },
      { label: "Som", value: (product) => product.soundSignature ? SIGNATURE_LABELS[product.soundSignature] : "Não informado" },
      { label: "Conexão", value: (product) => product.connection ?? "Não informada" },
      { label: "ANC", value: (product) => product.hasANC === undefined ? "Não informado" : product.hasANC ? "Sim" : "Não" },
      { label: "Bateria", value: (product) => product.batteryHours ? `${product.batteryHours} h` : "Não informada" },
      { label: "Microfone", value: (product) => product.hasMicrophone === undefined ? "Não informado" : product.hasMicrophone ? "Sim" : "Não" },
      { label: "Melhor para", value: (product) => product.bestFor?.join(", ") || product.activities.map((activity) => ACTIVITY_LABELS[activity]).join(", ") },
    ];
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.lista} title="Comparar fones" subtitle={`${compared.length} de 3 selecionados`} onBack={goBack}>
          <View style={styles.compareGrid}>
            <View style={styles.compareRow}>
              <Text style={styles.compareLabel}>Modelo</Text>
              {compared.map((product) => <Text key={product.id} style={styles.compareValue}>{product.name}</Text>)}
            </View>
            {rows.map((row) => (
              <View key={row.label} style={styles.compareRow}>
                <Text style={styles.compareLabel}>{row.label}</Text>
                {compared.map((product) => <Text key={product.id} style={styles.compareValue}>{row.value(product)}</Text>)}
              </View>
            ))}
          </View>
          <Button label="Voltar às recomendações" onPress={() => setStep("resultados")} />
        </Screen>
      </Shell>
    );
  }

  if (step === "detalhes" && choices.product) {
    const product = choices.product;
    const recommendation = results.find((item) => item.product.id === product.id);
    const cheaper = recommendation ? results.find((item) => item.product.price < product.price) : undefined;
    const canFindPremium = choices.activity && choices.range && choices.type && choices.environment && choices.priority && choices.connection && choices.soundPreference;
    const premium = recommendation && canFindPremium ? premiumAlternative(recommendation, {
      activity: choices.activity!, range: choices.range!, type: choices.type!, environment: choices.environment!,
      priority: choices.priority!, connection: choices.connection!, soundPreference: choices.soundPreference!, maxPrice: choices.maxPrice,
    }) : undefined;
    const displayName = product.name.split(/\s+[—–]\s+/)[0].split(",")[0];
    const strength = product.strengths?.[0]
      ? PRIORITIES.find((item) => item.id === product.strengths![0])?.label
      : recommendation?.reasons[0];
    const warning = product.weaknesses?.[0] ?? recommendation?.warning;
    const bestFor = product.bestFor?.slice(0, 3) ?? product.activities.slice(0, 3).map((activity) => ACTIVITY_LABELS[activity]);
    const stateTaxScenarios = product.importBasePrice !== undefined
      ? ICMS_IMPORT_GROUPS.map((group) => {
          const tax = product.importBasePrice! / (1 - group.rate) - product.importBasePrice!;
          return { ...group, tax, total: product.importBasePrice! + tax };
        })
      : [];
    return (
      <Shell chave={step}>
        <Screen gradient={GRADIENTS.lista} onBack={goBack}>
          <View style={styles.details}>
            <View style={styles.detailsImageBand}>
              {product.imageUrl ? (
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.detailsImage}
                  resizeMode="contain"
                  accessibilityLabel={product.name}
                />
              ) : <Text style={styles.detailsImageFallback}>{displayName.slice(0, 2).toUpperCase()}</Text>}
            </View>
            <Text style={styles.productEyebrow}>{TYPE_META[product.type].label}</Text>
            <Text style={styles.detailsName}>{displayName}</Text>
            <View style={styles.productPriceRow}>
              <View>
                <Text style={styles.detailsPrice}>{formatPrice(product.price)}</Text>
                <Text style={styles.priceNote}>{priceNote(product)}</Text>
                {product.importBasePrice !== undefined && product.estimatedImportTaxes !== undefined ? (
                  <Text style={styles.importPriceBreakdown}>
                    Produto {formatPrice(product.importBasePrice)} + impostos estimados {formatPrice(product.estimatedImportTaxes)}
                  </Text>
                ) : null}
              </View>
              {recommendation && <View style={styles.compatibilityPill}><Text style={styles.compatibilityPillText}>{recommendation.compatibility}% compatível</Text></View>}
            </View>
            {product.internationalPurchase && stateTaxScenarios.length > 0 ? (
              <Acordeao titulo="Ver impostos por estado">
                <View style={styles.stateTaxList}>
                  {stateTaxScenarios.map((scenario) => (
                    <View key={scenario.rate} style={styles.stateTaxGroup}>
                      <View style={styles.stateTaxHeading}>
                        <Text style={styles.stateTaxRate}>ICMS {(scenario.rate * 100).toFixed(0)}%</Text>
                        <Text style={styles.stateTaxValue}>{formatPrice(scenario.tax)} · total {formatPrice(scenario.total)}</Text>
                      </View>
                      <Text style={styles.stateTaxStates}>{scenario.states}</Text>
                    </View>
                  ))}
                  <Text style={styles.scoreBreakdownNote}>Estimativa com ICMS calculado “por dentro” sobre o preço exibido. A loja pode incluir outros tributos, frete ou descontos; o valor do checkout é o definitivo.</Text>
                  <Button label="Consultar regra utilizada" onPress={() => Linking.openURL("https://comsefaz.org.br/novo/manifesto-do-comsefaz-sobre-o-regime-de-tributacao-simplificada/")} />
                </View>
              </Acordeao>
            ) : null}
            <View style={styles.bestForRow}>
              {bestFor.map((label) => <View key={label} style={styles.bestForChip}><Text style={styles.bestForText}>{label}</Text></View>)}
            </View>
            {recommendation && (
              <View style={styles.matchExplanation}>
                <Text style={styles.matchExplanationLabel}>Por que combina com você</Text>
                <View style={styles.matchReasons}>
                  {recommendation.breakdown.filter((item) => item.points === item.maxPoints).slice(0, 3).map((item) => (
                    <View key={item.label} style={styles.matchReasonRow}>
                      <Text style={styles.matchReasonCheck}>✓</Text>
                      <View style={styles.matchReasonCopy}>
                        <Text style={styles.matchReasonTitle}>{item.label}</Text>
                        <Text style={styles.matchReasonText}>{item.explanation}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <Acordeao titulo={`Como chegamos a ${recommendation.compatibility}%?`}>
                  <View style={styles.scoreBreakdown}>
                    {recommendation.breakdown.map((item) => (
                      <View key={item.label} style={styles.scoreBreakdownRow}>
                        <View style={styles.scoreBreakdownCopy}>
                          <Text style={styles.scoreBreakdownLabel}>{item.label}</Text>
                          <Text style={styles.scoreBreakdownExplanation}>{item.explanation}</Text>
                        </View>
                        <Text style={item.points === item.maxPoints ? styles.scoreBreakdownPointsFull : styles.scoreBreakdownPoints}>
                          +{item.points}/{item.maxPoints}
                        </Text>
                      </View>
                    ))}
                    <Text style={styles.scoreBreakdownNote}>A pontuação usa somente informações disponíveis no catálogo. Critérios ainda não confirmados recebem pontuação parcial.</Text>
                  </View>
                </Acordeao>
              </View>
            )}
            {strength && (
              <View style={styles.decisionBlock}>
                <Text style={styles.decisionLabel}>Principal vantagem</Text>
                <Text style={styles.decisionValue}>{strength}</Text>
              </View>
            )}
            {warning && (
              <View style={[styles.decisionBlock, styles.decisionBlockMuted]}>
                <Text style={styles.decisionLabel}>Ponto de atenção</Text>
                <Text style={styles.decisionValue}>{warning}</Text>
              </View>
            )}
            <View style={styles.frequencyCard}>
              <View style={styles.frequencyHeader}>
                <View>
                  <Text style={styles.frequencyEyebrow}>ASSINATURA SONORA</Text>
                  <Text style={styles.frequencyTitle}>Resposta em frequência</Text>
                </View>
                <Text style={styles.frequencyGlyph}>≈</Text>
              </View>
              <Text style={styles.graficoTexto}>Graves à esquerda, médios no centro e agudos à direita.</Text>
              {product.graphUrl && <Cta label="Abrir gráfico deste fone" onPress={() => Linking.openURL(product.graphUrl!)} />}
              {product.frequencyResponse?.map((measurement) => (
                <Button key={measurement.url} label={measurement.label} onPress={() => Linking.openURL(measurement.url)} />
              ))}
              {!product.graphUrl && !product.frequencyResponse?.length && (
                <Text style={styles.graficoCredito}>Ainda não encontramos uma medição direta e verificada deste modelo.</Text>
              )}
            </View>
            <View style={styles.primaryActions}>
              {product.stores?.[0] && <Cta label="Ver ofertas" onPress={() => Linking.openURL(product.stores![0].url)} />}
              <BotaoFavorito produtoId={product.id} onPrecisaEntrar={() => setStep("entrar")} />
            </View>
          </View>

          <Acordeao titulo="Explorar detalhes">
            <View style={styles.exploreDetails}>
              {product.description && <Text style={styles.detailsText}>{product.description}</Text>}
              <Text style={styles.detailsMeta}>Indicado para {product.activities.map((a) => ACTIVITY_LABELS[a].toLowerCase()).join(", ")}.</Text>

          {product.specs && product.specs.length > 0 && (
            <>
              <Text style={styles.secaoTitulo}>Ficha técnica</Text>
              <Especificacoes specs={product.specs} />
            </>
          )}

          {product.curadoria && (
            <Acordeao titulo="Aprofundamento do curador">
              {product.curadoria && <Text style={styles.detailsText}>{product.curadoria}</Text>}
            </Acordeao>
          )}

          <View style={styles.detailsActions}>
            <Button label="Compartilhar este resultado" onPress={() => void Share.share({ message: `${product.name} — ${formatPrice(product.price)}${recommendation ? ` — ${recommendation.compatibility}% compatível comigo` : ""}` })} />
            {(product.stores?.length ?? 0) > 1 ? <Text style={styles.actionsTitle}>Outras lojas</Text> : null}
            {product.stores?.slice(1).map((store) => (
              <Button key={store.url} label={store.label} onPress={() => Linking.openURL(store.url)} />
            ))}
            {product.reviewUrl && (
              <Button label="Ver review" onPress={() => Linking.openURL(product.reviewUrl!)} />
            )}
            {product.recommendedBy?.map((source) => (
              <View key={source.url}>
                <Button label={`Recomendado por ${source.label}`} onPress={() => Linking.openURL(source.url)} />
                {source.note ? <Text style={styles.recommendationWarning}>{source.note}</Text> : null}
              </View>
            ))}
            {product.stores?.length ? <Text style={styles.recommendationWarning}>Alguns links podem ser afiliados. O preço para você não muda.</Text> : null}
            {product.internationalPurchase || product.stores?.some((store) => /aliexpress/i.test(store.label)) ? (
              <Text style={styles.importWarning}>Compra internacional: impostos e taxas de importação podem ser adicionados ao valor final no Brasil. Confira o total no fechamento do pedido.</Text>
            ) : null}
          </View>
          <Acordeao titulo="Criar alerta de preço">
            <View style={styles.customPrice}>
              <TextInput
                value={alertPrice}
                onChangeText={(value) => { setAlertPrice(value.replace(/\D/g, "")); setAlertSaved(false); }}
                placeholder="Avisar abaixo de R$"
                placeholderTextColor="rgba(255,255,255,0.42)"
                keyboardType="numeric"
                style={styles.customPriceInput}
              />
              <Button label={alertSaved ? "Alerta salvo" : "Salvar alerta"} onPress={() => {
                const value = Number(alertPrice);
                if (value > 0) void AsyncStorage.setItem(`price-alert:${product.id}`, String(value)).then(() => setAlertSaved(true));
              }} />
              <Text style={styles.recommendationWarning}>Salvo neste aparelho. A atualização automática depende do serviço de preços.</Text>
            </View>
          </Acordeao>
          {(cheaper || premium) && (
            <>
              <Text style={styles.secaoTitulo}>Outras opções</Text>
              <View style={styles.options}>
                {cheaper && <ProductCard badge="Alternativa mais barata" product={cheaper.product} onPress={() => open(cheaper.product)} />}
                {premium && <ProductCard badge="O que ganha investindo mais" product={premium} onPress={() => open(premium)} />}
              </View>
            </>
          )}

          {product.priceHistory && product.priceHistory.length > 0 && (
            <>
              <Text style={styles.secaoTitulo}>Histórico de preço</Text>
              <Especificacoes specs={product.priceHistory.slice(-5).reverse().map((point) => ({
                label: new Date(`${point.date}T12:00:00`).toLocaleDateString("pt-BR"),
                value: formatPrice(point.price),
              }))} />
            </>
          )}

          {(product.platforms?.length || product.equalization) && (
            <Acordeao titulo="Compatibilidade e ajustes">
              {product.platforms?.length ? <Text style={styles.detailsText}>Compatível com: {product.platforms.join(", ")}.</Text> : null}
              {product.equalization ? <Text style={styles.detailsText}>Equalização sugerida: {product.equalization}</Text> : null}
            </Acordeao>
          )}

          <Acordeao titulo="Entenda os termos">
            <Text style={styles.detailsText}>ANC reduz ruídos externos usando microfones. TWS é um fone Bluetooth totalmente sem fios. Assinatura sonora descreve quais regiões do som recebem mais destaque. Palco sonoro é a sensação de espaço e posição dos sons.</Text>
          </Acordeao>

          <Acordeao titulo="Avaliar este fone">
            {usuario ? (
              <View style={styles.customPrice}>
                <Text style={styles.detailsText}>Dê notas de 1 a 5. A avaliação passa por moderação antes de ser publicada.</Text>
                <TextInput value={reviewScores.sound} onChangeText={(sound) => setReviewScores((prev) => ({ ...prev, sound: sound.replace(/[^1-5]/g, "").slice(0, 1) }))} placeholder="Som (1 a 5)" placeholderTextColor="rgba(255,255,255,0.42)" keyboardType="numeric" style={styles.customPriceInput} />
                <TextInput value={reviewScores.comfort} onChangeText={(comfort) => setReviewScores((prev) => ({ ...prev, comfort: comfort.replace(/[^1-5]/g, "").slice(0, 1) }))} placeholder="Conforto (1 a 5)" placeholderTextColor="rgba(255,255,255,0.42)" keyboardType="numeric" style={styles.customPriceInput} />
                <TextInput value={reviewScores.microphone} onChangeText={(microphone) => setReviewScores((prev) => ({ ...prev, microphone: microphone.replace(/[^1-5]/g, "").slice(0, 1) }))} placeholder="Microfone (opcional)" placeholderTextColor="rgba(255,255,255,0.42)" keyboardType="numeric" style={styles.customPriceInput} />
                <TextInput value={reviewComment} onChangeText={setReviewComment} placeholder="Conte sua experiência (opcional)" placeholderTextColor="rgba(255,255,255,0.42)" multiline maxLength={1000} style={styles.customPriceInput} />
                <Button label="Enviar avaliação" onPress={() => {
                  const sound = Number(reviewScores.sound);
                  const comfort = Number(reviewScores.comfort);
                  if (!sound || !comfort) { setReviewStatus("Preencha som e conforto com notas de 1 a 5."); return; }
                  if (!supabase) { setReviewStatus("Configure o Supabase para enviar avaliações."); return; }
                  void supabase.from("avaliacoes").upsert({
                    user_id: usuario.id, produto_id: product.id, som: sound, conforto: comfort,
                    microfone: reviewScores.microphone ? Number(reviewScores.microphone) : null,
                    comentario: reviewComment.trim() || null, status: "pendente",
                  }, { onConflict: "user_id,produto_id" }).then(({ error }) => setReviewStatus(error ? "Não foi possível enviar. Ative a migração 02 no Supabase." : "Avaliação enviada para moderação."));
                }} />
                {reviewStatus ? <Text style={styles.recommendationWarning}>{reviewStatus}</Text> : null}
              </View>
            ) : (
              <Button label="Entre para avaliar" onPress={() => setStep("entrar")} />
            )}
          </Acordeao>
            </View>
          </Acordeao>
        </Screen>
      </Shell>
    );
  }

  const open = (product: Product) => {
    setAlertPrice("");
    setAlertSaved(false);
    void AsyncStorage.getItem(`price-alert:${product.id}`).then((value) => {
      if (value) { setAlertPrice(value); setAlertSaved(true); }
    });
    setChoices((prev) => ({ ...prev, product }));
    setStep("detalhes");
  };

  const alternatives =
    results.length === 0 && choices.activity && choices.type && choices.range
      ? nearbyProducts(choices.activity, choices.type)
          .sort((a, b) => {
            const distance = (price: number) => price < choices.range!.min ? choices.range!.min - price : price > choices.range!.max ? price - choices.range!.max : 0;
            return distance(a.price) - distance(b.price);
          })
          .slice(0, 3)
      : [];

  const summary = results.length ? "Três escolhas organizadas para facilitar sua decisão." : undefined;

  const featuredResults = results.length
    ? [
        { recommendation: results[0], badge: "Melhor escolha" },
        { recommendation: [...results].sort((a, b) => a.product.price - b.product.price)[0], badge: "Melhor custo-benefício" },
        { recommendation: [...results].sort((a, b) => b.product.price - a.product.price)[0], badge: "Opção premium" },
      ].filter((item, index, array) => array.findIndex((other) => other.recommendation.product.id === item.recommendation.product.id) === index)
    : [];

  return (
    <Shell chave={step}>
      <Screen gradient={GRADIENTS.lista} title={results.length ? "Seus melhores fones" : undefined} subtitle={results.length ? summary : undefined} onBack={goBack}>
        {results.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyHero}>
              <View style={styles.emptyMark}><Text style={styles.emptyMarkText}>↗</Text></View>
              <Text style={styles.emptyTitle}>Chegamos perto.</Text>
              <Text style={styles.emptyLead}>Não há um encaixe exato nessa faixa de preço. Você pode ajustar o orçamento ou conhecer as três opções mais próximas.</Text>
            </View>
            <Button label="Ajustar meu orçamento" onPress={() => setStep("preco")} />
            {alternatives.length > 0 && (
              <>
                <View style={styles.nearbyHeader}>
                  <Text style={styles.nearbyEyebrow}>QUASE PERFEITOS</Text>
                  <Text style={styles.nearbyTitle}>Opções que exigem o menor ajuste</Text>
                </View>
                <View style={styles.options}>
                  {alternatives.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      badge={choices.range && product.price > choices.range.max ? `${formatPrice(product.price - choices.range.max)} acima` : choices.range && product.price < choices.range.min ? `${formatPrice(choices.range.min - product.price)} abaixo` : "Faixa próxima"}
                      onPress={() => open(product)}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.resultsIntro}>
              <Text style={styles.resultsEyebrow}>SELEÇÃO PARA O SEU PERFIL</Text>
              <Text style={styles.resultsHint}>Comece pela primeira opção — ela teve o melhor equilíbrio entre suas respostas.</Text>
            </View>
            <View style={styles.options}>
              {featuredResults.map(({ recommendation, badge }, index) => (
                <ProductCard
                  key={recommendation.product.id}
                  product={recommendation.product}
                  recommendation={recommendation}
                  badge={badge}
                  featured={index === 0}
                  onPress={() => open(recommendation.product)}
                />
              ))}
            </View>
            {featuredResults.length >= 2 && <Button label="Comparar estas opções" onPress={() => {
              setCompareIds(featuredResults.map((item) => item.recommendation.product.id));
              setStep("comparador");
            }} />}
          </>
        )}
      </Screen>
    </Shell>
  );
}

function Shell({ chave, children }: { chave: string; children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Transicao chave={chave}>{children}</Transicao>
      </SafeAreaProvider>
    </PhoneFrame>
  );
}
