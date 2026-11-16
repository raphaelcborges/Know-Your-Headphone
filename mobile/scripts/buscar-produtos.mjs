/**
 * Recebe uma lista de modelos e devolve entradas de catálogo, buscando ASIN,
 * preço, título e imagem na Amazon.
 *
 *   node scripts/buscar-produtos.mjs modelos.txt achados.json
 *
 * `modelos.txt` tem um modelo por linha ("Sennheiser HD600"). A saída é JSON
 * para você conferir e colar em src/data/products.ts — de propósito: escolher o
 * anúncio certo entre variações de cor, versão e vendedor é decisão humana.
 */
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

/**
 * Acessório cita o modelo no título e passaria como se fosse o fone —
 * "Almofada Espuma compatível com Hitune Max5c" e "cabo de substituição
 * compatível com HD560s" foram casos reais. A comparação é feita em minúsculas
 * para não depender de modificador de regex.
 */
const PALAVRAS_DE_ACESSORIO = [
  "cabo",
  "capa",
  "case",
  "estojo",
  "espuma",
  "almofad",
  "earpad",
  "ear pad",
  "adaptador",
  "protetor",
  "suporte",
  "bolsa",
  "peças",
  "substitui",
  "reposi",
  // "Carregador AirPods Pro — Estação de carregamento" apareceu como se fosse
  // o fone, a R$ 158 no lugar de R$ 2.500.
  "carregador",
  "carregamento",
  "dock",
  "ponteira",
  "silicone",
];

const ehAcessorio = (titulo) => {
  const t = titulo.toLowerCase();
  return PALAVRAS_DE_ACESSORIO.some((palavra) => t.includes(palavra));
};

/** Junta letras e números para "DT770" casar com "DT 770". */
const achatar = (texto) => texto.toLowerCase().replace(/[^a-z0-9]/g, "");

const arquivo = process.argv[2];
if (!arquivo) {
  console.error("Uso: node scripts/buscar-produtos.mjs modelos.txt");
  process.exit(1);
}

const modelos = (await readFile(arquivo, "utf8"))
  .split(/\r?\n/)
  .map((linha) => linha.trim())
  .filter((linha) => linha && !linha.startsWith("#"));

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ locale: "pt-BR" });
const achados = [];

for (const modelo of modelos) {
  const pagina = await contexto.newPage();
  try {
    const busca = `https://www.amazon.com.br/s?k=${encodeURIComponent(`${modelo} fone`)}`;
    await pagina.goto(busca, { waitUntil: "domcontentloaded", timeout: 45000 });

    const resultados = await pagina.$$eval('[data-component-type="s-search-result"]', (els) =>
      els.slice(0, 6).map((e) => ({
        asin: e.getAttribute("data-asin"),
        titulo: e.querySelector("h2")?.innerText ?? null,
        precoTexto: e.querySelector(".a-price .a-offscreen")?.textContent ?? null,
        imagem: e.querySelector("img.s-image")?.getAttribute("src") ?? null,
      })),
    );

    const candidatos = resultados.filter(
      (r) => r.precoTexto && r.titulo && !ehAcessorio(r.titulo),
    );

    const chaves = modelo.split(/\s+/).map(achatar);
    const bom = candidatos.find((r) => chaves.every((k) => achatar(r.titulo).includes(k)));
    const escolhido = bom ?? candidatos[0];

    if (!escolhido) {
      console.error(`${modelo}: nenhum produto (só acessórios ou sem preço).`);
      achados.push({ modelo, encontrado: false });
      continue;
    }

    const preco = Number(
      escolhido.precoTexto.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", "."),
    );

    // Alguns anúncios chegam com o texto já quebrado na origem — o próprio
    // navegador mostra "din�micos". Não dá para consertar de fora: só
    // avisar, para o título ser reescrito à mão antes de entrar no catálogo.
    const tituloQuebrado = escolhido.titulo.includes("�");
    if (tituloQuebrado) {
      console.error(`${modelo}: título veio com acentos quebrados da loja — reescreva à mão.`);
    }

    achados.push({
      modelo,
      encontrado: true,
      confianca: bom ? "alta" : "BAIXA — título não cita o modelo, confira",
      tituloQuebrado: tituloQuebrado || undefined,
      name: escolhido.titulo.trim(),
      price: preco,
      imageUrl: escolhido.imagem,
      stores: [{ label: "Amazon", url: `https://www.amazon.com.br/dp/${escolhido.asin}` }],
    });
    console.error(
      `${modelo}: ${escolhido.asin} — R$ ${preco.toFixed(2)}${bom ? "" : "  (CONFIRA)"}`,
    );
  } catch (erro) {
    console.error(`${modelo}: falhou (${erro.message.split("\n")[0]})`);
    achados.push({ modelo, encontrado: false });
  } finally {
    await pagina.close();
  }
}

await navegador.close();

const json = JSON.stringify(achados, null, 2);
const saida = process.argv[3];
if (saida) {
  // Gravar aqui evita o redirecionamento do terminal, que no Windows salva em
  // cp1252 e estraga os acentos dos títulos ("dinâmicos" virou "din?micos").
  await writeFile(saida, json, "utf8");
  console.error(`Gravado em ${saida}`);
} else {
  console.log(json);
}
