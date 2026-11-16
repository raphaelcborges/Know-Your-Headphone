# Know Your Headphone

App que ajuda a escolher o fone ideal com um quiz sobre **uso**, **orçamento**, **formato**, **ambiente**, **prioridade**, **assinatura sonora** e **conexão**. No fim, mostra três escolhas, porcentagem de compatibilidade e explica por que cada modelo combina com as respostas.

O quiz aceita um teto de preço personalizado. Os resultados podem ser comparados lado a lado e compartilhados. A ficha de cada produto suporta histórico de preço, alerta local, plataformas compatíveis, equalização, vantagens, desvantagens e glossário. Dados não verificados aparecem como “não informado”; o motor não inventa características ou avaliações.

Originalmente escrito em Python + [Flet](https://flet.dev). A versão atual é **React Native com Expo**, em [`mobile/`](mobile) — uma única base de código que roda como app nativo Android/iOS **e** como PWA instalável no navegador.

## Rodando

```bash
npm install
```

Dev server (escaneie o QR code com o app Expo Go no celular, ou tecle `w` para abrir no navegador):

```bash
npm start
```

Direto no navegador:

```bash
npm run web
```

No navegador de desktop o app aparece dentro de uma **moldura de celular** de 390×844 centralizada, para o preview bater com o aparelho ([PhoneFrame.tsx](mobile/src/components/PhoneFrame.tsx)). Em janelas abaixo de 768px de largura — celular real ou PWA instalado — a moldura some e o app ocupa a tela inteira.

> Os comandos funcionam tanto na raiz quanto dentro de `mobile/`: o `package.json` da raiz só repassa tudo para lá.

## Publicando

### Como PWA (mais rápido, sem loja)

```bash
npm run build:web
```

Gera `mobile/dist/` — site estático com `manifest.json`, ícones e service worker. Publique em Vercel, Netlify ou GitHub Pages. No celular, o usuário abre o link e escolhe "Adicionar à tela de início": vira ícone e abre em tela cheia, sem barra do navegador, e funciona offline depois da primeira visita.

### Como app nativo

Builds saem pelo [EAS](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli build --platform android --profile preview
```

Para publicar nas lojas é preciso conta de desenvolvedor (Google Play: US$ 25 uma vez; Apple: US$ 99/ano). Para só testar no seu aparelho, o Expo Go com `npm start` já basta.

## Estrutura

| Caminho | O quê |
| --- | --- |
| [mobile/App.tsx](mobile/App.tsx) | Máquina de estados das telas (início → atividade → preço → tipo → resultados → detalhes) |
| [mobile/src/components/Screen.tsx](mobile/src/components/Screen.tsx) | Casca das telas: degradê, safe area, scroll, botão de voltar |
| [mobile/src/components/Cta.tsx](mobile/src/components/Cta.tsx) | Ação principal: bloco ciano cheio — um por tela |
| [mobile/src/components/Option.tsx](mobile/src/components/Option.tsx) | Linha de escolha: rótulo, dica e régua — sem caixa e sem ícone |
| [mobile/src/components/Button.tsx](mobile/src/components/Button.tsx) | Botão secundário, discreto |
| [mobile/src/components/PhoneFrame.tsx](mobile/src/components/PhoneFrame.tsx) | Moldura de celular no navegador desktop; invisível no aparelho |
| [mobile/src/components/CartaoOpcao.tsx](mobile/src/components/CartaoOpcao.tsx) | Escolha em cartão, para as perguntas em grade |
| [mobile/src/components/Acordeao.tsx](mobile/src/components/Acordeao.tsx) | Seção recolhível (usada na curadoria) |
| [mobile/src/components/Especificacoes.tsx](mobile/src/components/Especificacoes.tsx) | Ficha técnica em lista de rótulo e valor |
| [mobile/src/components/Transicao.tsx](mobile/src/components/Transicao.tsx) | Esmaecida e deslize a cada troca de tela |
| [mobile/src/theme.ts](mobile/src/theme.ts) | Paleta Eulbink, degradês por tela e `StyleSheet` compartilhados |
| [mobile/src/data/products.ts](mobile/src/data/products.ts) | **O catálogo — é aqui que você adiciona fones** |
| [mobile/src/data/catalog.ts](mobile/src/data/catalog.ts) | Atividades, faixas de preço e lógica de filtro |
| [mobile/scripts/check-catalog.mts](mobile/scripts/check-catalog.mts) | Valida o catálogo e lista as combinações ainda vazias |
| [mobile/scripts/update-prices.mjs](mobile/scripts/update-prices.mjs) | Compara os preços salvos com os das lojas e atualiza o catálogo |
| [mobile/scripts/buscar-produtos.mjs](mobile/scripts/buscar-produtos.mjs) | Recebe uma lista de modelos e devolve ASIN, preço, título e imagem |
| [mobile/src/data/types.ts](mobile/src/data/types.ts) | Tipos de domínio (`Product`, `Activity`, `PriceRange`…) |
| [mobile/scripts/build-pwa.mjs](mobile/scripts/build-pwa.mjs) | Exporta o web e injeta manifest, metas do iOS e service worker |
| [package.json](package.json) | Só repassa os comandos para `mobile/`, para funcionarem de qualquer pasta |
| [mobile/public/](mobile/public) | `manifest.json`, `sw.js` e ícones copiados para o build |
| [mobile/assets/](mobile/assets) | Logo com fundo transparente e ícones do app |

## O que mudou em relação ao Flet

- **Um catálogo só.** O projeto Flet tinha um JSON por combinação de atividade × tipo (`fone_gamer.json`, `headphone_musica.json`, …), com produtos duplicados entre arquivos e três arquivos que o código pedia mas que nunca existiram (`fone_filme.json`, `fone_estudo.json`, `headphone_estudo.json`) — escolher "Filme" ou "Estudo" quebrava o app. Agora cada produto aparece uma vez em `catalog.ts` e carrega as atividades para as quais serve.
- **Preço como número.** Antes o filtro fazia parsing de strings como `"R$189,00"` a cada clique; agora o preço é `number` e a formatação em reais é derivada na exibição.
- **Navegação de verdade.** O "Voltar" da tela de detalhes no Flet recarregava um arquivo fixo e inexistente; agora cada tela volta para a anterior preservando as escolhas, e o botão físico de voltar do Android segue o mesmo caminho.
- **Estado vazio.** Combinações sem resultado mostram uma mensagem e um atalho para trocar a faixa de preço, em vez de uma tela sem saída.
- **Fundo em degradê no lugar das imagens.** As artes do Flet (`bg1`–`bg5`) tinham as perguntas *desenhadas na imagem* — "PARA QUAIS ATIVIDADES VOCÊ USARIA O FONE?" aparecia atrás do título real do app. Agora cada tela usa um degradê da mesma família azul (`GRADIENTS` em `theme.ts`), sem texto embutido e sem imagem para baixar.
- **Paleta fechada.** Todas as cores saem da [Eulbink](https://lospec.com/palette-list/eulbink), de Inkpendude — sete valores declarados em `palette` no `theme.ts`, e nada fora disso. Ciano `#0ce6f2` é a única cor de destaque; o resto é estrutura.
- **Interface sem enfeite.** Sem sombra colorida, sem degradê em botão, sem canto arredondado e sem emoji: a ação principal é um bloco ciano sólido, as escolhas são linhas separadas por régua de 1px, e o que orienta é a tipografia (versalete espaçado nos rótulos secundários). Cada opção ganhou uma linha de apoio — "Passos, tiros e voz no chat", "Over-ear, abafa o ambiente" — que é o que a pessoa realmente precisa saber para escolher.
- **Foto do produto sangrando na página.** As imagens das lojas vêm com fundo branco chapado; recortar não dá. Em vez de deixar um retângulo branco boiando no escuro, a foto virou uma faixa branca de ponta a ponta da tela, com respiro interno — parecido com página de revista. Nas listas, o mesmo raciocínio numa miniatura quadrada de 54px.
- **Logo com fundo transparente.** Foi extraída de `bg1.png` (branco sobre azul virou canal alfa) para [mobile/assets/logo.png](mobile/assets/logo.png), e serve tanto à tela inicial quanto aos ícones do app e do PWA.
- **Layout de celular de verdade:** respeita safe area (notch e barra de gestos), rola quando o conteúdo não cabe e se adapta a qualquer tamanho de tela — no lugar da janela fixa de 360×690.

## Favoritos e alertas

Não existe conta nem servidor. Os fones salvos e os alertas de preço ficam no próprio aparelho, via AsyncStorage (no navegador, `localStorage`) — ver [FavoritosContext.tsx](mobile/src/favoritos/FavoritosContext.tsx). O app inteiro é estático: funciona offline depois da primeira visita e não tem chave nem `.env` para configurar.

A contrapartida é que os salvos não sincronizam entre aparelhos e somem se a pessoa limpar os dados do navegador.

## Mind the Headphone

[mobile/src/data/mindtheheadphone.ts](mobile/src/data/mindtheheadphone.ts) guarda as classificações das listas de recomendação do [Mind the Headphone](https://www.mindtheheadphone.com.br/recomendacoes) — assinatura sonora, formato (intra, earbud, over-ear), conexão e link do review em vídeo. Os comentários e os links de loja (afiliados) do site **não** são usados.

Esses dados só preenchem o que falta: o que estiver em `products.ts` sempre ganha. Modelos recomendados lá que ainda não estão no catálogo ficam listados em [mobile/scripts/modelos-mth-faltando.txt](mobile/scripts/modelos-mth-faltando.txt), no formato que o `npm run buscar` espera.

## Curadoria e ficha técnica

Cada produto pode ter:

- **`specs`** — a ficha técnica, mostrada aberta na tela de detalhes como lista de rótulo e valor.
- **`curadoria`** — sua leitura sobre o fone, **recolhida por padrão** atrás de "Aprofundamento do curador". Quem só quer o preço não esbarra nela; quem quer entender, toca e abre. Sem texto, a seção nem aparece.

A ficha técnica dos oito modelos foi preenchida com o que os próprios anúncios informam. Já os textos de curadoria são o seu produto, não o meu: escrevi três de exemplo, curtos e restritos ao que dá para afirmar pelas especificações. **Reescreva com sua voz** — é isso que diferencia uma lista de links de uma curadoria.

## Crescendo o catálogo

Para não cadastrar produto a produto na mão:

```bash
node scripts/buscar-produtos.mjs modelos.txt achados.json
```

`modelos.txt` tem um modelo por linha ("Sennheiser HD600"). O script busca cada um na Amazon e devolve ASIN, preço, título e imagem em JSON — **para você conferir**, não para entrar direto no catálogo. Ele não escreve em `products.ts` de propósito: escolher entre variações de cor, versão e vendedor é decisão humana.

O que ele já sabe evitar, porque cada um destes aconteceu de verdade:

- **Acessórios** que citam o modelo no título: "Almofada Espuma compatível com Hitune Max5c", "cabo de substituição compatível com HD560s", "Carregador AirPods Pro" a R$ 158.
- **Títulos que não citam o modelo** — marcados `BAIXA — confira` em vez de entrarem calados.
- **Acentos quebrados na origem**: alguns anúncios chegam com o texto já corrompido da loja; ele avisa para o título ser reescrito.

O que ele **não** resolve: variantes cujo nome contém o modelo original. Procurando "AKG K361" ele traz o **K361BT**, que é outro produto. Por isso a conferência humana.

## Adicionando fones ao catálogo

Todo o catálogo vive em [mobile/src/data/products.ts](mobile/src/data/products.ts). O topo do arquivo tem um modelo pronto para copiar; cada item leva ~10 linhas:

```ts
{
  id: "marca-modelo",                      // único, kebab-case, nunca muda
  name: "Nome como aparece na loja",
  price: 199.9,                            // número, sem "R$"
  imageUrl: "https://.../foto.jpg",
  description: "Uma frase sobre o som ou o uso.",
  stores: [{ label: "Amazon", url: "https://www.amazon.com.br/dp/XXXXXXXXXX" }],
  reviewUrl: "https://youtu.be/...",       // opcional
  type: "fone",                            // "fone" | "headset" | "headphone"
  activities: ["musica", "estudo"],
},
```

Um produto pode servir a vários usos e ter várias lojas — a primeira aparece como botão em destaque. Depois de editar:

```bash
npm run check:catalog
```

O verificador acusa id repetido, campo faltando, URL inválida e combinações impossíveis (headset fora de "jogos", por exemplo). No fim, lista **quais combinações de uso × tipo × preço ainda não têm nenhum modelo** — é o seu roteiro do que preencher. Hoje são 30 de 40.

Enquanto uma combinação está vazia, o app não deixa o usuário na mão: mostra os modelos do mesmo uso e tipo em outras faixas de preço.

## Preços

Preço envelhece. Cada produto guarda `priceCheckedAt` com a data em que o valor foi conferido, e a tela de detalhes mostra isso: "Preço conferido há 5 dias" enquanto está recente, "Preço de fevereiro de 2025 — confira na loja" quando passa de 30 dias. Assim o app nunca apresenta valor velho como se fosse o de hoje.

Para conferir tudo de uma vez:

```bash
npm run precos
```

Ele mostra uma tabela com preço salvo × preço atual e não grava nada. Para gravar:

```bash
npm run precos -- --aplicar
```

A leitura pela web precisa de um navegador de verdade — a Amazon não devolve o preço no HTML puro, só depois de renderizar a página. Por isso:

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

O script distingue os casos: **HTTP 404** é anúncio removido (troque a loja em `products.ts`), **HTTP 403** é a loja barrando o robô — o link continua bom para uma pessoa.

> **Ponha a Amazon como primeira loja sempre que existir.** É a única que se deixa ler automaticamente. O Mercado Livre bloqueia: responde 403 a requisição direta, desvia navegador automatizado para tela de login, e a API oficial exige token OAuth. Um produto cuja primeira loja seja o Mercado Livre nunca terá o preço atualizado sozinho — deixe o link dele como segunda loja, que ele continua aparecendo no app.

Se nenhuma loja legível existir, monte um JSON `{ "id-do-produto": 199.9 }` e passe direto, sem navegador:

```bash
npm run precos -- --de precos.json --aplicar
```

## Dados

As atividades "filme" e "estudo" ainda reaproveitam os modelos de uso geral. Os preços originais vieram da raspagem de **19/02/2025** feita pelos `api_*.py`.

O código Flet original (`main.py`, `telas.py`, `api_*.py`, os `.json`) saiu da pasta; está no primeiro commit do Git e no repositório antigo.
