import { StyleSheet } from "react-native";

/**
 * Paleta Eulbink, de Inkpendude (lospec.com/palette-list/eulbink).
 * Sete cores, nada além delas — é o que segura a coerência visual do app.
 */
export const palette = {
  white: "#ffffff",
  cyan: "#0ce6f2",
  blue: "#0098db",
  steel: "#1e579c",
  navy: "#203562",
  indigo: "#252446",
  plum: "#201533",
} as const;

export const colors = {
  bg: "#11151d",
  text: palette.white,
  textMuted: "rgba(255,255,255,0.72)",
  textFaint: "rgba(255,255,255,0.50)",
  accent: "#a8d8df",
  /** Linhas e divisores: quase invisíveis, é o que dá o ar minimalista. */
  rule: "rgba(255,255,255,0.09)",
  ruleStrong: "rgba(255,255,255,0.18)",
  pressed: "rgba(255,255,255,0.045)",
};

/** Pelo menos duas paradas — é o que o expo-linear-gradient exige. */
export type Gradient = readonly [string, string, ...string[]];

/**
 * Um degradê por tela. A variação é discreta de propósito: o fundo é pano de
 * fundo, não o assunto.
 */
export const GRADIENTS = {
  inicio: ["#07141f", "#101924", "#11151d"],
  atividade: ["#172b3c", "#111923", "#11151d"],
  preco: ["#1a3042", "#111923", "#11151d"],
  tipo: ["#172b3e", "#111923", "#11151d"],
  lista: ["#11151d", "#11151d"],
} satisfies Record<string, Gradient>;

/**
 * Canto padrão dos elementos tocáveis. Nem quina viva (dura demais) nem pílula
 * (que deixa tudo com cara de template) — só o suficiente para amaciar.
 */
const RAIO = 10;

export const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },

  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ---- tela inicial ----
  homeTopline: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.rule },
  homeMonogram: { color: colors.text, fontSize: 13, fontWeight: "900", letterSpacing: -0.3 },
  homeToplineText: { color: colors.textFaint, fontSize: 8, fontWeight: "700", letterSpacing: 1.4 },
  hero: { flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "center", gap: 13, paddingTop: 8 },
  heroEyebrow: { color: colors.accent, fontSize: 9, fontWeight: "800", letterSpacing: 1.7, marginTop: 2 },
  heroTitle: { alignSelf: "stretch", color: colors.text, fontSize: 38, lineHeight: 42, fontWeight: "800", letterSpacing: -1.35, textAlign: "center" },
  heroVisual: { width: 220, height: 210, alignItems: "center", justifyContent: "center", marginBottom: 5, overflow: "visible" },
  heroGlow: { position: "absolute", width: 174, height: 174, borderRadius: 87, backgroundColor: "rgba(12,230,242,0.055)", borderWidth: 1, borderColor: "rgba(168,216,223,0.12)" },
  logo: { width: 146, height: 184 },
  logoCompact: { width: 148, height: 185, alignSelf: "center" },
  tagline: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 350,
  },
  heroKinds: { color: colors.textFaint, fontSize: 9, letterSpacing: 1.15, marginTop: 3 },
  heroFooter: { gap: 10, paddingTop: 24 },
  heroSteps: {
    color: colors.textFaint,
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 0.6,
  },

  // ---- ação principal: retângulo ciano, sem brilho nem degradê ----
  cta: {
    alignSelf: "stretch",
    minHeight: 54,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#d5e8eb",
  },
  ctaPressed: { backgroundColor: palette.blue },
  ctaText: {
    color: "#11151d",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // ---- ação secundária: só contorno ----
  button: {
    alignSelf: "stretch",
    minHeight: 52,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  buttonPressed: { backgroundColor: colors.pressed },
  buttonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // ---- lista de escolhas: linhas separadas por régua, sem caixas ----
  options: { marginTop: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
  optionMarker: { width: 2, height: 20, backgroundColor: "transparent" },
  optionMarkerActive: { backgroundColor: colors.accent },
  optionLabel: { color: colors.text, fontSize: 17, fontWeight: "500" },
  optionHint: { color: colors.textFaint, fontSize: 13, marginTop: 3 },
  optionMeta: { color: colors.textFaint, fontSize: 13, letterSpacing: 0.5 },

  stepBadge: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 1.1,
    marginBottom: 6,
  },

  screenTopRow: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  backButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 7 },
  backArrow: { color: colors.text, fontSize: 28, lineHeight: 28, fontWeight: "300" },
  backText: { color: colors.textMuted, fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 30, fontWeight: "700", lineHeight: 36, letterSpacing: -0.6 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 6, lineHeight: 20 },
  header: { marginTop: 20, marginBottom: 18 },
  quizContent: { paddingHorizontal: 22 },
  quizHeader: { marginTop: 27, marginBottom: 24 },
  quizInstruction: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 9, maxWidth: 310 },

  // ---- resultados ----
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.045)",
  },
  cardFeatured: { minHeight: 184, padding: 14, borderColor: "rgba(168,216,223,0.68)", backgroundColor: "rgba(168,216,223,0.09)", shadowColor: colors.accent, shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  featuredCard: { marginBottom: 16, borderRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: "rgba(168,216,223,0.46)", backgroundColor: "#17232f", shadowColor: colors.accent, shadowOpacity: 0.18, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } },
  featuredVisual: { height: 235, alignItems: "center", justifyContent: "center", backgroundColor: "#eef3f4", padding: 22 },
  featuredImage: { width: "88%", height: "88%" },
  featuredScoreFloat: { position: "absolute", top: 16, right: 16, width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", backgroundColor: "#111923", borderWidth: 2, borderColor: colors.accent },
  featuredScoreNumber: { color: colors.accent, fontSize: 18, lineHeight: 21, fontWeight: "900" },
  featuredScoreLabel: { color: colors.accent, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  featuredContent: { padding: 19, gap: 8 },
  featuredName: { color: colors.text, fontSize: 24, lineHeight: 29, fontWeight: "800", letterSpacing: -0.5 },
  featuredFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 5 },
  featuredPrice: { color: colors.text, fontSize: 17, fontWeight: "800" },
  featuredOpen: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  // A foto da loja já vem com fundo branco: em vez de disfarçar, viramos ela
  // num bloco branco deliberado, encostado nas bordas.
  cardThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f2f4f4",
    padding: 5,
    justifyContent: "center",
  },
  cardThumbFeatured: { width: 116, height: 140, borderRadius: 16 },
  cardImage: { width: "100%", height: "100%" },
  cardFallback: { color: "#53616b", fontSize: 18, fontWeight: "700", textAlign: "center" },
  cardBody: { flex: 1, gap: 6 },
  cardName: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: "500" },
  cardNameFeatured: { fontSize: 18, lineHeight: 23, fontWeight: "700" },
  cardMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardPrice: { color: colors.text, fontSize: 14, fontWeight: "600" },
  cardScore: { color: colors.textFaint, fontSize: 11 },
  cardBadge: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  resultsIntro: { gap: 5, marginTop: 2, marginBottom: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.rule },
  resultsEyebrow: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1.25 },
  resultsHint: { color: colors.textMuted, fontSize: 12, lineHeight: 18, maxWidth: 350 },
  cardChevron: { color: colors.textFaint, fontSize: 25, fontWeight: "300", paddingHorizontal: 2 },
  cardReason: { color: colors.textFaint, fontSize: 11, lineHeight: 15 },
  cardCompare: { color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", paddingVertical: 5 },
  featuredMatch: { alignSelf: "flex-start", flexDirection: "row", alignItems: "baseline", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.accent, backgroundColor: "rgba(168,216,223,0.08)" },
  featuredMatchNumber: { color: colors.accent, fontSize: 18, fontWeight: "800" },
  featuredMatchLabel: { color: colors.accent, fontSize: 8, fontWeight: "800", letterSpacing: 0.8 },
  customPrice: { marginTop: 24, gap: 12, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.rule },
  customPriceInput: { color: colors.text, fontSize: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.ruleStrong },
  budgetPanel: { gap: 16, padding: 22, marginBottom: 15, borderRadius: 24, borderWidth: 1, borderColor: "rgba(168,216,223,0.20)", backgroundColor: "rgba(255,255,255,0.055)" },
  budgetLabel: { color: colors.textFaint, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textAlign: "center" },
  budgetValue: { color: colors.accent, fontSize: 40, lineHeight: 46, fontWeight: "800", letterSpacing: -1, textAlign: "center" },
  budgetTrackTouch: { height: 32, justifyContent: "center", marginTop: 5 },
  budgetTrack: { height: 5, borderRadius: 3, backgroundColor: colors.ruleStrong },
  budgetTrackFill: { height: 5, borderRadius: 3, backgroundColor: colors.accent },
  budgetThumb: { position: "absolute", top: -8, width: 21, height: 21, marginLeft: -10, borderRadius: 11, backgroundColor: colors.text, borderWidth: 4, borderColor: colors.accent },
  budgetScale: { flexDirection: "row", justifyContent: "space-between", marginTop: -10 },
  budgetScaleText: { color: colors.textFaint, fontSize: 10 },
  budgetShortcuts: { flexDirection: "row", gap: 7 },
  budgetChip: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: colors.rule, alignItems: "center", backgroundColor: "rgba(255,255,255,0.025)" },
  budgetChipActive: { borderColor: colors.accent, backgroundColor: "rgba(168,216,223,0.1)" },
  budgetChipText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  budgetChipTextActive: { color: colors.accent },
  budgetCount: { color: colors.textMuted, fontSize: 12, textAlign: "center", paddingTop: 3 },
  taxToggleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, marginBottom: 17 },
  taxToggle: { width: 43, height: 25, padding: 3, borderRadius: 14, backgroundColor: colors.ruleStrong, justifyContent: "center" },
  taxToggleActive: { backgroundColor: colors.accent },
  taxToggleThumb: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.textMuted },
  taxToggleThumbActive: { alignSelf: "flex-end", backgroundColor: "#11151d" },
  taxToggleCopy: { flex: 1, gap: 3 },
  taxToggleTitle: { color: colors.text, fontSize: 13, fontWeight: "600" },
  taxToggleHint: { color: colors.textFaint, fontSize: 11, lineHeight: 15 },
  compareGrid: { gap: 14, marginTop: 12 },
  compareRow: { flexDirection: "row", gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.rule },
  compareLabel: { width: 86, color: colors.textFaint, fontSize: 11, textTransform: "uppercase" },
  compareValue: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 17 },
  recommendationBox: {
    gap: 7,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
    backgroundColor: "rgba(12,230,242,0.06)",
  },
  recommendationScore: { color: colors.accent, fontSize: 16, fontWeight: "700" },
  recommendationReason: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  recommendationWarning: { color: colors.textFaint, fontSize: 12, lineHeight: 18 },
  importWarning: { color: "#e7c98b", fontSize: 12, lineHeight: 18, padding: 12, borderRadius: 10, backgroundColor: "rgba(231,201,139,0.08)", borderWidth: 1, borderColor: "rgba(231,201,139,0.2)" },

  // ---- detalhes ----
  details: { gap: 14, paddingTop: 4 },
  /**
   * A foto da loja vem com fundo branco embutido. Em vez de sangrar até a borda
   * (que brigava com o canto arredondado dos botões), ela vira um cartão com o
   * mesmo raio do resto e uma borda tênue que segura o branco no escuro.
   */
  detailsImageBand: {
    height: 250,
    borderRadius: 24,
    backgroundColor: palette.white,
    paddingVertical: 20,
    paddingHorizontal: 28,
    marginBottom: 4,
  },
  detailsImage: { width: "100%", height: "100%" },
  detailsImageFallback: { color: colors.accent, fontSize: 38, fontWeight: "300", letterSpacing: 2 },
  detailsName: { color: colors.text, fontSize: 25, fontWeight: "700", lineHeight: 31, letterSpacing: -0.35 },
  detailsPrice: { color: colors.accent, fontSize: 26, fontWeight: "700" },
  productEyebrow: { color: colors.accent, fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", marginTop: 2 },
  productPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  compatibilityPill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(168,216,223,0.1)", borderWidth: 1, borderColor: "rgba(168,216,223,0.2)" },
  compatibilityPillText: { color: colors.accent, fontSize: 11, fontWeight: "600" },
  bestForRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  bestForChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.05)" },
  bestForText: { color: colors.textMuted, fontSize: 11 },
  matchExplanation: { padding: 15, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.035)", borderWidth: 1, borderColor: colors.rule, gap: 5 },
  matchExplanationLabel: { color: colors.accent, fontSize: 10, fontWeight: "600", letterSpacing: 0.9, textTransform: "uppercase" },
  matchExplanationSummary: { color: colors.text, fontSize: 14, lineHeight: 20, marginBottom: 2 },
  matchReasons: { gap: 13, paddingTop: 5 },
  matchReasonRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  matchReasonCheck: { width: 20, height: 20, borderRadius: 10, overflow: "hidden", color: "#11151d", backgroundColor: colors.accent, textAlign: "center", lineHeight: 20, fontSize: 11, fontWeight: "800" },
  matchReasonCopy: { flex: 1, gap: 2 },
  matchReasonTitle: { color: colors.text, fontSize: 13, fontWeight: "700" },
  matchReasonText: { color: colors.textMuted, fontSize: 11, lineHeight: 16 },
  scoreBreakdown: { gap: 0, paddingTop: 2 },
  scoreBreakdownRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.rule },
  scoreBreakdownCopy: { flex: 1, gap: 3 },
  scoreBreakdownLabel: { color: colors.text, fontSize: 13, fontWeight: "600" },
  scoreBreakdownExplanation: { color: colors.textFaint, fontSize: 11, lineHeight: 16 },
  scoreBreakdownPoints: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  scoreBreakdownPointsFull: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  scoreBreakdownNote: { color: colors.textFaint, fontSize: 10, lineHeight: 15, paddingTop: 11 },
  decisionBlock: { padding: 15, borderRadius: 15, backgroundColor: "rgba(168,216,223,0.08)", borderLeftWidth: 2, borderLeftColor: colors.accent, gap: 5 },
  decisionBlockMuted: { backgroundColor: "rgba(255,255,255,0.035)", borderLeftColor: colors.ruleStrong },
  decisionLabel: { color: colors.textFaint, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" },
  decisionValue: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: "500" },
  primaryActions: { gap: 10, paddingTop: 3 },
  exploreDetails: { gap: 15, paddingTop: 4 },
  detailsText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  priceNote: { color: colors.textFaint, fontSize: 12, letterSpacing: 0.4, marginTop: -8 },
  importPriceBreakdown: { color: "#e7c98b", fontSize: 11, lineHeight: 16, marginTop: 5, maxWidth: 230 },
  stateTaxList: { gap: 12, paddingTop: 3 },
  stateTaxGroup: { gap: 5, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: colors.rule },
  stateTaxHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 10 },
  stateTaxRate: { color: colors.text, fontSize: 13, fontWeight: "600" },
  stateTaxValue: { color: colors.accent, fontSize: 11, fontWeight: "600", textAlign: "right" },
  stateTaxStates: { color: colors.textFaint, fontSize: 11, lineHeight: 17 },
  detailsMeta: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    marginTop: 2,
  },
  detailsActions: { gap: 10, paddingTop: 10 },
  actionsTitle: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  // ---- estado vazio ----
  empty: { gap: 16, paddingTop: 8 },
  emptyHero: { alignItems: "flex-start", gap: 11, paddingVertical: 14 },
  emptyMark: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(168,216,223,0.11)", borderWidth: 1, borderColor: "rgba(168,216,223,0.22)", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyMarkText: { color: colors.accent, fontSize: 25, fontWeight: "300" },
  emptyTitle: { color: colors.text, fontSize: 25, lineHeight: 31, fontWeight: "500", maxWidth: 300 },
  emptyLead: { color: colors.textMuted, fontSize: 14, lineHeight: 21, maxWidth: 320 },
  nearbyHeader: { marginTop: 18, marginBottom: 2 },
  nearbyEyebrow: { color: colors.accent, fontSize: 10, letterSpacing: 1.1, marginBottom: 7 },
  nearbyTitle: { color: colors.text, fontSize: 18, lineHeight: 24, fontWeight: "500" },
  emptyText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  emptyHint: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 16,
  },

  // ---- formulários ----


  // ---- barra de progresso das perguntas ----
  progressoBloco: { marginTop: 7, marginBottom: 2 },
  progresso: { height: 5, borderRadius: 3, backgroundColor: colors.rule, overflow: "hidden" },
  progressoPasso: { flex: 1, height: 4, backgroundColor: colors.rule },
  progressoPassoFeito: { height: "100%", borderRadius: 3, backgroundColor: colors.accent },
  progressoTexto: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },

  // ---- numeração das opções ----
  optionNumero: {
    color: palette.steel,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    width: 22,
  },

  // ---- conta, na tela inicial ----

  // ---- grade de escolhas (duas colunas), no lugar da lista ----
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 11, marginTop: 2 },
  gradeCartao: {
    width: "47.5%",
    flexGrow: 1,
    minHeight: 142,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.055)",
    justifyContent: "space-between",
  },
  gradeCartaoDestaque: { width: "100%", minHeight: 166, backgroundColor: "rgba(168,216,223,0.09)", borderColor: "rgba(168,216,223,0.30)" },
  gradeCartaoAtivo: { borderColor: colors.accent, backgroundColor: "rgba(168,216,223,0.1)", opacity: 0.78 },
  gradeNumero: { display: "none" },
  gradeTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  gradeNumeroVisivel: { color: colors.textFaint, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  gradeMarca: { width: 46, height: 46, borderRadius: 15, borderWidth: 1, borderColor: "rgba(168,216,223,0.22)", backgroundColor: "rgba(168,216,223,0.085)", alignItems: "center", justifyContent: "center" },
  gradeMarcaCentro: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  gradeIcone: { color: colors.accent, fontSize: 22, fontWeight: "500" },
  gradeSeta: { color: colors.textFaint, fontSize: 18, fontWeight: "300" },
  gradeTitulo: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "700" },
  gradeDica: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  gradeAcao: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: colors.rule },
  gradeAcaoTexto: { color: colors.textFaint, fontSize: 9, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  guestNote: { color: colors.textFaint, fontSize: 12, textAlign: "center", lineHeight: 17, marginTop: -2 },
  analysisPage: { flex: 1, justifyContent: "center", gap: 32, paddingVertical: 40 },
  analysisOrb: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: "rgba(168,216,223,0.34)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(168,216,223,0.07)", shadowColor: colors.accent, shadowOpacity: 0.18, shadowRadius: 24 },
  analysisOrbInner: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent },
  analysisEyebrow: { color: colors.accent, fontSize: 10, letterSpacing: 1.2, marginBottom: 10 },
  analysisTitle: { color: colors.text, fontSize: 29, lineHeight: 35, fontWeight: "500" },
  analysisLead: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  analysisList: { gap: 17, paddingTop: 4 },
  analysisItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  analysisCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.ruleStrong, alignItems: "center", justifyContent: "center" },
  analysisCheckDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  analysisCheckText: { fontSize: 12 },
  analysisCheckTextDone: { color: "#11151d", fontWeight: "800" },
  analysisItemText: { color: colors.textFaint, fontSize: 14, lineHeight: 20 },
  analysisItemTextDone: { color: colors.text },
  summaryIntro: { paddingTop: 28, paddingBottom: 22 },
  summaryTitle: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: "500" },
  summarySubtitle: { color: colors.textMuted, fontSize: 15, marginTop: 5 },
  summaryCard: { borderWidth: 1, borderColor: "rgba(168,216,223,0.16)", borderRadius: 22, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)" },
  summaryRow: { minHeight: 68, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.rule },
  summaryRowText: { flex: 1, gap: 3 },
  summaryLabel: { color: colors.textFaint, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" },
  summaryValue: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: "500" },
  summaryEdit: { color: colors.accent, fontSize: 11, fontWeight: "600" },
  summaryActions: { gap: 10, paddingTop: 22, paddingBottom: 30 },

  // ---- ficha técnica ----
  ficha: { marginTop: 4 },
  fichaLinha: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
  fichaRotulo: { color: colors.textFaint, fontSize: 13, width: 108 },
  fichaValor: { color: colors.text, fontSize: 13, flex: 1, lineHeight: 19 },

  // ---- seção recolhível ----
  acordeaoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
  },
  acordeaoTitulo: { color: colors.text, fontSize: 15, fontWeight: "600", flex: 1 },
  acordeaoSinal: { color: colors.accent, fontSize: 20, fontWeight: "300", width: 20, textAlign: "right" },
  acordeaoCorpo: { paddingBottom: 16 },

  // ---- curva de resposta ----
  grafico: { gap: 10, marginTop: 14 },
  graficoTexto: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  graficoCredito: { color: colors.textFaint, fontSize: 11, letterSpacing: 0.4 },
  frequencyCard: { gap: 14, padding: 18, borderRadius: 22, borderWidth: 1, borderColor: "rgba(168,216,223,0.28)", backgroundColor: "rgba(168,216,223,0.07)", marginTop: 4 },
  frequencyHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  frequencyEyebrow: { color: colors.accent, fontSize: 9, fontWeight: "700", letterSpacing: 1.2, marginBottom: 4 },
  frequencyTitle: { color: colors.text, fontSize: 18, lineHeight: 23, fontWeight: "700" },
  frequencyGlyph: { color: colors.accent, fontSize: 36, fontWeight: "300" },

  // ---- título de seção ----
  secaoTitulo: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 6,
  },

  // ---- favoritos ----
  favoritoBotao: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: RAIO,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  favoritoBotaoAtivo: { borderColor: colors.accent },
  /** Quadradinho que enche de ciano quando o fone está salvo. */
  favoritoMarca: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.ruleStrong,
  },
  favoritoMarcaAtiva: { backgroundColor: colors.accent, borderColor: colors.accent },
  favoritoTexto: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  favoritoAviso: { color: palette.cyan, fontSize: 12, marginTop: 8 },

  // ---- moldura de celular, só no navegador desktop ----
  frameBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#08111b",
  },
  frame: {
    borderRadius: 36,
    borderWidth: 6,
    borderColor: "#1b2d43",
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 18 },
    overflow: "hidden",
  },
  frameClip: { flex: 1, overflow: "hidden", backgroundColor: colors.bg },
});
