/**
 * Exporta o build web do Expo e injeta no index.html o que o Expo não gera
 * sozinho: o link do manifest, as metas de tela cheia do iOS e o registro do
 * service worker. Resultado: dist/ é um PWA instalável.
 *
 *   node scripts/build-pwa.mjs
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");

execFileSync("npx", ["expo", "export", "--platform", "web", "--clear"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

const productImages = join(process.cwd(), "public", "product-images");
if (existsSync(productImages)) {
  cpSync(productImages, join(dist, "product-images"), { recursive: true });
  console.log("Imagens locais do catálogo copiadas para dist/product-images.");
}

await import("./generate-catalog-audit.mjs");

const indexPath = join(dist, "index.html");
let html = readFileSync(indexPath, "utf8");

const head = `
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icon-1024.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Know Your Headphone" />
    <meta name="mobile-web-app-capable" content="yes" />
`;

const script = `
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
            .then(function (registration) {
              registration.update();
              navigator.serviceWorker.addEventListener("controllerchange", function () {
                if (sessionStorage.getItem("kyh-sw-reloaded") === "1") return;
                sessionStorage.setItem("kyh-sw-reloaded", "1");
                window.location.reload();
              });
            })
            .catch(function (error) {
              console.warn("Falha ao registrar o service worker:", error);
            });
        });
      }
    </script>
`;

if (html.includes('rel="manifest"')) {
  console.log("index.html já tinha as tags de PWA — nada a injetar.");
} else {
  html = html.replace("</head>", `${head}  </head>`);
  html = html.replace("</body>", `${script}  </body>`);
  writeFileSync(indexPath, html, "utf8");
  console.log("PWA: manifest, ícones iOS e service worker injetados em dist/index.html");
}
