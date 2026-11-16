/**
 * Confere os preços do catálogo contra as lojas e, se você mandar, atualiza o
 * arquivo. Substitui os seis `api_*.py`, que eram o mesmo script copiado.
 *
 *   npm run precos                                 # só compara e mostra a tabela
 *   npm run precos -- --aplicar                    # grava os preços novos
 *   npm run precos -- --de precos.json --aplicar   # sem rede, de um arquivo
 *
 * A leitura pela web usa Playwright porque a Amazon não entrega o preço no HTML
 * puro — é preciso um navegador de verdade renderizando a página:
 *
 *   npm i -D playwright && npx playwright install chromium
 *
 * O modo `--de` existe para quando você conferir os preços à mão: um JSON no
 * formato `{ "id-do-produto": 199.9 }` resolve, sem navegador nenhum.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVO = join(raiz, "src", "data", "products.ts");

const args = process.argv.slice(2);
const aplicar = args.includes("--aplicar");
const usarArquivo = args.includes("--de");

/**
 * O caminho do `--de` é relativo à pasta de onde você chamou o comando, não à
 * `mobile/` — rodando da raiz do projeto, `npm` executa o script lá dentro.
 * `INIT_CWD` é a pasta original; sem npm no meio, vale a atual.
 */
const ondeVoceEsta = process.env.INIT_CWD ?? process.cwd();
const arquivoDeEntrada = usarArquivo
  ? resolve(ondeVoceEsta, args[args.indexOf("--de") + 1] ?? "")
  : null;

const hoje = new Date().toISOString().slice(0, 10);

/** Lê id, preço e primeira loja de cada produto direto do texto do arquivo. */
function lerCatalogo(fonte) {
  const produtos = [];
  for (const bloco of fonte.split(/\r?\n {2}\{\r?\n/).slice(1)) {
    const id = bloco.match(/id: "([^"]+)"/)?.[1];
    const price = Number(bloco.match(/\r?\n {4}price: ([\d.]+),/)?.[1]);
    const url = bloco.match(/url: "([^"]+)"/)?.[1];
    if (id && Number.isFinite(price)) produtos.push({ id, price, url });
  }
  return produtos;
}

/** Converte "R$ 1.234,56" em 1234.56. */
function paraNumero(texto) {
  const limpo = texto.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
  const valor = Number(limpo);
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

async function lerDaWeb(produtos) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "Playwright não está instalado. Rode:\n" +
        "  npm i -D playwright && npx playwright install chromium\n" +
        "Ou confira os preços à mão e use: npm run precos -- --de precos.json",
    );
    process.exit(1);
  }

  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({ locale: "pt-BR" });
  const encontrados = {};

  for (const produto of produtos) {
    if (!produto.url) {
      console.warn(`${produto.id}: sem loja cadastrada, pulando.`);
      continue;
    }
    const pagina = await contexto.newPage();
    try {
      const resposta = await pagina.goto(produto.url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      const status = resposta?.status() ?? 0;

      // 404/410: o anúncio saiu do ar de verdade, o link precisa ser trocado.
      if (status === 404 || status === 410) {
        console.warn(`${produto.id}: LINK MORTO (HTTP ${status}) — troque a loja em products.ts`);
        continue;
      }

      // 403/429 ou desvio para login: a loja barrou o robô, mas o link funciona
      // para uma pessoa. O preço fica com a data antiga e o app avisa que está
      // velho — melhor do que dizer que o anúncio sumiu.
      const pediuLogin = /login|account-verification/.test(pagina.url());
      if (status === 403 || status === 429 || pediuLogin) {
        console.warn(
          `${produto.id}: a loja bloqueou a leitura automática (HTTP ${status}) — ` +
            "confira à mão e use --de",
        );
        continue;
      }

      if (resposta && !resposta.ok()) {
        console.warn(`${produto.id}: resposta inesperada (HTTP ${status}), pulando.`);
        continue;
      }
      const texto = await pagina
        .locator(".a-price .a-offscreen")
        .first()
        .textContent({ timeout: 15000 });
      const valor = texto && paraNumero(texto);
      if (valor) encontrados[produto.id] = valor;
      else console.warn(`${produto.id}: preço não encontrado na página.`);
    } catch (erro) {
      console.warn(`${produto.id}: falhou (${erro.message.split("\n")[0]})`);
    } finally {
      await pagina.close();
    }
  }

  await navegador.close();
  return encontrados;
}

/** Troca preço e data de um produto, mexendo só no bloco daquele id. */
function aplicarPrecos(fonte, precos, quebra) {
  let saida = fonte;
  for (const [id, preco] of Object.entries(precos)) {
    const alvo = new RegExp(`(id: "${id}",[\\s\\S]*?\\r?\\n {4}price: )([\\d.]+)(,)`);
    if (!alvo.test(saida)) {
      console.warn(`${id}: não encontrei o bloco no arquivo, deixei como estava.`);
      continue;
    }
    saida = saida.replace(alvo, `$1${preco}$3`);

    const dataExistente = new RegExp(`(id: "${id}",[\\s\\S]*?priceCheckedAt: ")[^"]*(")`);
    if (dataExistente.test(saida)) {
      saida = saida.replace(dataExistente, `$1${hoje}$2`);
    } else {
      saida = saida.replace(
        new RegExp(`(id: "${id}",[\\s\\S]*?\\r?\\n {4}price: [\\d.]+,)`),
        `$1${quebra}    priceCheckedAt: "${hoje}",`,
      );
    }
  }
  return saida;
}

const fonte = await readFile(ARQUIVO, "utf8");
const quebra = fonte.includes("\r\n") ? "\r\n" : "\n";
const produtos = lerCatalogo(fonte);
console.log(`${produtos.length} produtos no catálogo.\n`);

const precos = usarArquivo
  ? JSON.parse(await readFile(arquivoDeEntrada, "utf8"))
  : await lerDaWeb(produtos);

const alteracoes = {};
for (const produto of produtos) {
  const novo = precos[produto.id];
  if (novo === undefined) continue;
  const diferenca = novo - produto.price;
  if (Math.abs(diferenca) < 0.01) {
    console.log(`  =  ${produto.id}: R$ ${produto.price.toFixed(2)}`);
  } else {
    alteracoes[produto.id] = novo;
    const sinal = diferenca > 0 ? "+" : "";
    console.log(
      `  ~  ${produto.id}: R$ ${produto.price.toFixed(2)} → R$ ${novo.toFixed(2)} ` +
        `(${sinal}${diferenca.toFixed(2)})`,
    );
  }
}

const mudou = Object.keys(alteracoes).length;
console.log("");

if (mudou === 0) {
  console.log("Nenhum preço mudou.");
} else if (aplicar) {
  await writeFile(ARQUIVO, aplicarPrecos(fonte, alteracoes, quebra), "utf8");
  console.log(`${mudou} preço(s) atualizados em src/data/products.ts (data: ${hoje}).`);
} else {
  console.log(`${mudou} preço(s) diferentes. Rode com --aplicar para gravar.`);
}
