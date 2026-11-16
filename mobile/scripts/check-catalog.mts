/**
 * Confere o catálogo e lista o que falta preencher.
 *
 *   npm run check:catalog
 *
 * Sai com código 1 se achar erro — dá para plugar no CI depois.
 */
import {
  ACTIVITIES,
  PRICE_RANGES,
  PRODUCTS,
  TYPE_LABELS,
  filterProducts,
  typesForActivity,
} from "../src/data/catalog.ts";

const errors: string[] = [];
const warnings: string[] = [];

const seen = new Set<string>();
for (const p of PRODUCTS) {
  const where = p.id || p.name || "(item sem id)";

  if (!p.id) errors.push(`${where}: falta "id".`);
  else if (seen.has(p.id)) errors.push(`${p.id}: id repetido.`);
  else seen.add(p.id);

  if (!/^[a-z0-9-]+$/.test(p.id ?? "")) errors.push(`${where}: id deve ser kebab-case (a-z, 0-9, "-").`);
  if (!p.name?.trim()) errors.push(`${where}: falta "name".`);
  if (!(p.price > 0)) errors.push(`${where}: "price" precisa ser um número maior que zero.`);
  if ((p.importBasePrice === undefined) !== (p.estimatedImportTaxes === undefined)) {
    errors.push(`${where}: preço-base e impostos estimados devem ser preenchidos juntos.`);
  }
  if (p.importBasePrice !== undefined && p.estimatedImportTaxes !== undefined) {
    const composedPrice = Number((p.importBasePrice + p.estimatedImportTaxes).toFixed(2));
    if (Math.abs(composedPrice - p.price) > 0.01) {
      errors.push(`${where}: preço final (${p.price}) não confere com produto + impostos (${composedPrice}).`);
    }
  }
  if (p.imageUrl && !/^https?:\/\//.test(p.imageUrl)) errors.push(`${where}: "imageUrl" precisa ser uma URL http(s).`);
  if (!p.activities?.length) errors.push(`${where}: precisa de ao menos uma atividade.`);

  for (const store of p.stores ?? []) {
    if (!/^https?:\/\//.test(store.url)) errors.push(`${where}: URL inválida na loja "${store.label}".`);
  }

  if (!p.stores?.length) warnings.push(`${where}: sem loja — o botão "Ver na loja" não aparece.`);
  if (!p.description?.trim()) warnings.push(`${where}: sem descrição.`);

  // Headset é o formato com microfone que só o fluxo de jogos oferece.
  if (p.type === "headset" && !p.activities.includes("jogos")) {
    warnings.push(`${where}: é headset mas não está em "jogos", então nunca aparece.`);
  }
  if (p.type === "headphone" && p.activities.includes("jogos")) {
    warnings.push(`${where}: é headphone e está em "jogos", mas jogos só oferece headset e fone.`);
  }
}

// Combinações que o usuário consegue escolher mas que não devolvem nada.
const gaps: string[] = [];
for (const activity of ACTIVITIES) {
  for (const type of typesForActivity(activity.id)) {
    for (const range of PRICE_RANGES) {
      if (filterProducts(activity.id, range, type).length === 0) {
        gaps.push(`${activity.label} · ${TYPE_LABELS[type]} · ${range.label}`);
      }
    }
  }
}

const total = ACTIVITIES.length * 2 * PRICE_RANGES.length;

console.log(`\n${PRODUCTS.length} modelos no catálogo.\n`);

if (errors.length) {
  console.log("ERROS");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("");
}

if (warnings.length) {
  console.log("AVISOS");
  warnings.forEach((w) => console.log(`  ! ${w}`));
  console.log("");
}

console.log(`COMBINAÇÕES VAZIAS (${gaps.length} de ${total})`);
gaps.forEach((g) => console.log(`  · ${g}`));
console.log("");

if (errors.length) {
  console.error(`${errors.length} erro(s) — corrija em src/data/products.ts`);
  process.exit(1);
}
console.log("Catálogo válido.");
