import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { PRODUCTS } from "../src/data/catalog.ts";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "public", "product-images");
const productsFile = path.join(root, "src", "data", "products.ts");
const publicBase = "https://know-your-headphone.vercel.app/product-images";

await mkdir(outputDir, { recursive: true });

function extension(contentType, url) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("avif")) return "avif";
  if (contentType?.includes("gif")) return "gif";
  if (/\.png(?:$|\?)/i.test(url)) return "png";
  if (/\.webp(?:$|\?)/i.test(url)) return "webp";
  return "jpg";
}

async function download(product) {
  if (!product.imageUrl || product.imageUrl.startsWith(publicBase)) return null;
  try {
    const response = await fetch(product.imageUrl, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; KYH catalog image mirror/1.0)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) throw new Error(`tipo ${contentType ?? "desconhecido"}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length < 1_000) throw new Error(`arquivo muito pequeno (${bytes.length} bytes)`);
    const ext = extension(contentType, product.imageUrl);
    const fileName = `${product.id}.${ext}`;
    await writeFile(path.join(outputDir, fileName), bytes);
    return { oldUrl: product.imageUrl, newUrl: `${publicBase}/${fileName}`, id: product.id, bytes: bytes.length };
  } catch (error) {
    return { id: product.id, error: error instanceof Error ? error.message : String(error) };
  }
}

const queue = PRODUCTS.filter((product) => product.imageUrl && !product.imageUrl.startsWith(publicBase));
const results = [];
for (let index = 0; index < queue.length; index += 8) {
  results.push(...await Promise.all(queue.slice(index, index + 8).map(download)));
}

const successful = results.filter((item) => Boolean(item && "newUrl" in item));
const failed = results.filter((item) => Boolean(item && "error" in item));

let source = await readFile(productsFile, "utf8");
for (const item of successful) source = source.replaceAll(item.oldUrl, item.newUrl);
await writeFile(productsFile, source, "utf8");

console.log(`${successful.length} imagens espelhadas em public/product-images.`);
console.log(`${PRODUCTS.filter((product) => !product.imageUrl).length} produtos ainda não possuem endereço de imagem cadastrado.`);
if (failed.length) {
  console.log(`${failed.length} imagens não puderam ser baixadas:`);
  for (const item of failed) console.log(`  - ${item.id}: ${item.error}`);
}
