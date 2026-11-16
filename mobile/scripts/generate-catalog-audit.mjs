import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PRODUCTS } from "../src/data/catalog.ts";

const products = PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  priceCheckedAt: product.priceCheckedAt,
  imageUrl: product.imageUrl,
  stores: product.stores,
  internationalPurchase: product.internationalPurchase,
  type: product.type,
  activities: product.activities,
  connection: product.connection,
  soundSignature: product.soundSignature,
  hasMicrophone: product.hasMicrophone,
  hasANC: product.hasANC,
  batteryHours: product.batteryHours,
  fit: product.fit,
  design: product.design,
  strengths: product.strengths,
  weaknesses: product.weaknesses,
  bestFor: product.bestFor,
  platforms: product.platforms,
  specs: product.specs,
  graphUrl: product.graphUrl,
  frequencyResponse: product.frequencyResponse,
  score: product.score,
}));

const serialized = JSON.stringify(products).replaceAll("<", "\\u003c");
const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Auditoria do catálogo · Know Your Headphone</title>
  <style>
    :root { color-scheme:dark; --bg:#09131d; --panel:#101c28; --panel-raised:#142230; --panel2:#192936; --line:#2b3d4c; --line-strong:#3a5061; --text:#f4f7f9; --muted:#a5b2bc; --accent:#d7f34a; --accent-soft:#24311d; --danger:#ff8585; --warn:#ffd078; --ok:#7ee0aa; --focus:#e7fa82; }
    * { box-sizing:border-box } html { scroll-behavior:smooth } body { min-height:100vh; margin:0; background:radial-gradient(circle at 50% -20%,#172b3b 0,transparent 40%),var(--bg); color:var(--text); font:15px/1.5 Inter,system-ui,-apple-system,Segoe UI,sans-serif }
    button,input,select,textarea { font:inherit } button,a,select { -webkit-tap-highlight-color:transparent; touch-action:manipulation }
    .skip { position:fixed; left:16px; top:12px; z-index:20; transform:translateY(-160%); padding:10px 14px; border-radius:10px; background:var(--accent); color:#0b1208; font-weight:800 } .skip:focus { transform:none }
    .shell { max-width:1360px; margin:auto; padding:40px 24px 88px }
    header { display:flex; align-items:end; justify-content:space-between; gap:32px; margin-bottom:28px }
    .eyebrow { margin:0 0 8px; color:var(--accent); font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase }
    h1 { max-width:720px; margin:0 0 8px; font-size:clamp(30px,4vw,48px); line-height:1.05; letter-spacing:-.045em; text-wrap:balance } .lead { max-width:680px; color:var(--muted); margin:0; font-size:16px }
    .back { min-height:44px; display:inline-flex; align-items:center; color:var(--text); text-decoration:none; border:1px solid var(--line); padding:10px 16px; border-radius:12px; white-space:nowrap; background:color-mix(in srgb,var(--panel) 80%,transparent) }
    .stats { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; margin-bottom:20px }
    .stat { min-height:92px; display:flex; flex-direction:column; justify-content:space-between; background:linear-gradient(145deg,var(--panel-raised),var(--panel)); border:1px solid var(--line); border-radius:16px; padding:16px } .stat b { display:block; font-size:28px; line-height:1; font-variant-numeric:tabular-nums } .stat span { color:var(--muted); font-size:13px }
    .toolbar { position:sticky; top:8px; z-index:5; display:grid; grid-template-columns:minmax(240px,1.7fr) repeat(4,minmax(140px,1fr)); gap:12px; padding:14px; margin-bottom:18px; background:color-mix(in srgb,var(--panel) 94%,transparent); border:1px solid var(--line); border-radius:18px; box-shadow:0 16px 40px #02070c66; backdrop-filter:blur(16px) }
    .field { min-width:0 } .field label,.review-field label { display:block; margin:0 0 6px; color:var(--muted); font-size:12px; font-weight:700 }
    input,select,textarea { width:100%; min-height:44px; color:var(--text); background:var(--bg); border:1px solid var(--line); border-radius:11px; padding:10px 12px; outline:none; transition:border-color .15s ease,box-shadow .15s ease,background .15s ease }
    input:hover,select:hover,textarea:hover { border-color:var(--line-strong) } input:focus-visible,select:focus-visible,textarea:focus-visible,.action:focus-visible,.back:focus-visible { border-color:var(--focus); box-shadow:0 0 0 3px #d7f34a33; outline:none }
    .summary { display:flex; justify-content:space-between; align-items:center; gap:16px; margin:18px 2px; color:var(--muted) }
    .action { min-height:44px; border:1px solid transparent; border-radius:12px; padding:10px 17px; font-weight:800; cursor:pointer; background:var(--accent); color:#0b1208; transition:filter .15s ease,background .15s ease } .action:hover { filter:brightness(1.06) } .action:active { filter:brightness(.92) }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(410px,1fr)); gap:14px }
    .card { min-width:0; display:grid; grid-template-columns:92px minmax(0,1fr); gap:16px; background:linear-gradient(145deg,var(--panel-raised),var(--panel)); border:1px solid var(--line); border-radius:18px; padding:16px; transition:border-color .15s ease,background .15s ease } .card:focus-within { border-color:var(--line-strong) } .card.status-ok { border-color:#315b48 } .card.status-fix { border-color:#675a35 } .card.status-remove { border-color:#633c43 }
    .thumb { width:92px; height:92px; border-radius:14px; object-fit:contain; background:#eef2f4 } .placeholder { display:grid; place-items:center; color:#52616c; font-weight:800; font-size:24px }
    .top { min-width:0; display:flex; justify-content:space-between; gap:14px } .product-copy { min-width:0 } h2 { font-size:17px; line-height:1.3; margin:0 0 5px; overflow-wrap:anywhere } .price { color:var(--accent); font-size:16px; font-weight:850; white-space:nowrap; font-variant-numeric:tabular-nums }
    .product-id { display:block; overflow-wrap:anywhere; font-size:12px } .meta,.tags,.issues { display:flex; flex-wrap:wrap; gap:6px; margin-top:9px } .tag { border-radius:999px; background:var(--panel2); color:#c4ced5; padding:4px 8px; font-size:11px }
    .issue { color:var(--warn); border:1px solid #66532e; background:#2a2419 } .issue.severe { color:var(--danger); border-color:#704047; background:#291a20 }
    .review { grid-column:1/-1; border-top:1px solid var(--line); padding-top:14px; display:grid; grid-template-columns:170px minmax(0,1fr); gap:10px } .review-field { min-width:0 }
    .store { color:var(--text); text-underline-offset:3px } .muted { color:var(--muted) }
    .empty { padding:60px 20px; text-align:center; color:var(--muted) }
    dialog { width:min(760px,calc(100% - 28px)); max-height:calc(100dvh - 32px); color:var(--text); background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:22px; box-shadow:0 24px 80px #000b } dialog::backdrop { background:#02060bcc; backdrop-filter:blur(4px) }
    dialog h2 { font-size:24px; margin:0 0 6px } dialog textarea { min-height:300px; resize:vertical } .dialog-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:14px }
    .secondary { background:transparent; color:var(--text); border:1px solid var(--line) }
    @media(max-width:800px){ body{font-size:16px}.shell{padding:24px 14px 72px}header{align-items:flex-start;flex-direction:column;gap:20px;margin-bottom:24px}.back{width:100%;justify-content:center}.stats{grid-template-columns:repeat(2,1fr)}.stat{min-height:84px}.stat:last-child{grid-column:1/-1}.toolbar{position:static;grid-template-columns:1fr;padding:12px;border-radius:16px}.grid{grid-template-columns:1fr}.card{grid-template-columns:76px minmax(0,1fr);gap:12px;padding:14px}.thumb{width:76px;height:76px}.top{flex-direction:column;gap:4px}.review{grid-template-columns:1fr}.summary{align-items:stretch;flex-direction:column}.summary .action{width:100%}.dialog-actions{flex-direction:column-reverse}.dialog-actions .action{width:100%} }
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
  </style>
</head>
<body>
<a class="skip" href="#catalogGrid">Pular para os modelos</a>
<main class="shell">
  <header><div><p class="eyebrow">Know Your Headphone · Ferramenta interna</p><h1>Auditoria do catálogo</h1><p class="lead">Encontre inconsistências, registre seu parecer e transforme a revisão em um feedback pronto para aplicar.</p></div><a class="back" href="/" aria-label="Voltar para o aplicativo">← Voltar ao app</a></header>
  <section class="stats" id="stats"></section>
  <section class="toolbar" aria-label="Filtros do catálogo">
    <div class="field"><label for="search">Buscar</label><input id="search" type="search" placeholder="Modelo, loja ou ID" autocomplete="off" /></div>
    <div class="field"><label for="type">Tipo</label><select id="type"><option value="">Todos</option><option value="fone">Fones</option><option value="headphone">Headphones</option><option value="headset">Headsets</option></select></div>
    <div class="field"><label for="issue">Pendência</label><select id="issue"><option value="">Todas</option><option value="issues">Com pendências</option><option value="image">Sem imagem</option><option value="store">Sem loja</option><option value="price">Preço antigo</option><option value="data">Dados incompletos</option></select></div>
    <div class="field"><label for="review">Parecer</label><select id="review"><option value="">Todos</option><option value="pending">Não revisados</option><option value="ok">OK</option><option value="fix">Corrigir</option><option value="remove">Remover</option></select></div>
    <div class="field"><label for="sort">Ordenar</label><select id="sort"><option value="issues">Mais pendências</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome</option><option value="oldest">Preço mais antigo</option></select></div>
  </section>
  <div class="summary"><span id="count" role="status" aria-live="polite"></span><button class="action" id="report">Gerar feedback da revisão</button></div>
  <section class="grid" id="catalogGrid" aria-label="Modelos do catálogo"><div id="grid" style="display:contents"></div></section>
</main>
<dialog id="reportDialog"><h2>Feedback pronto para colar</h2><p class="muted">Copie este texto e envie na conversa para aplicarmos as correções.</p><textarea id="reportText" readonly></textarea><div class="dialog-actions"><button class="action secondary" id="closeDialog">Fechar</button><button class="action" id="copyReport">Copiar</button></div></dialog>
<script>
const products=${serialized};
const storageKey="kyh-catalog-audit-v1";
let reviews=JSON.parse(localStorage.getItem(storageKey)||"{}");
const brl=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
const labels={fone:"Fone",headphone:"Headphone",headset:"Headset",cabeado:"Com fio",bluetooth:"Bluetooth",ambos:"Ambos"};
const $=id=>document.getElementById(id);
function age(date){if(!date)return 9999;return Math.floor((Date.now()-new Date(date+"T12:00:00").getTime())/86400000)}
function issues(p){const a=[];if(!p.imageUrl)a.push(["image","Sem imagem",1]);if(!p.stores?.length)a.push(["store","Sem loja",1]);if(age(p.priceCheckedAt)>30)a.push(["price",p.priceCheckedAt?"Preço há "+age(p.priceCheckedAt)+" dias":"Preço sem data",1]);if(!p.connection)a.push(["data","Sem conexão",0]);if(!p.fit)a.push(["data","Sem formato",0]);if(!p.soundSignature)a.push(["data","Sem assinatura sonora",0]);if(p.hasMicrophone===undefined)a.push(["data","Microfone não informado",0]);if(!p.specs?.length)a.push(["data","Sem ficha técnica",0]);if(!p.strengths?.length)a.push(["data","Sem pontos fortes",0]);return a}
function esc(v){return String(v??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function save(id,status,note){reviews[id]={status,note};localStorage.setItem(storageKey,JSON.stringify(reviews));render()}
function filtered(){const q=$("search").value.trim().toLowerCase(),type=$("type").value,issue=$("issue").value,review=$("review").value;let list=products.filter(p=>{const hay=[p.name,p.id,...(p.stores||[]).map(s=>s.label)].join(" ").toLowerCase();const pi=issues(p);const state=reviews[p.id]?.status||"pending";return(!q||hay.includes(q))&&(!type||p.type===type)&&(!issue||(issue==="issues"?pi.length:pi.some(i=>i[0]===issue)))&&(!review||state===review)});const sort=$("sort").value;list.sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="name"?a.name.localeCompare(b.name):sort==="oldest"?age(b.priceCheckedAt)-age(a.priceCheckedAt):issues(b).length-issues(a).length);return list}
function renderStats(){const marked=Object.values(reviews);const withIssues=products.filter(p=>issues(p).length).length;$("stats").innerHTML=[[products.length,"Modelos"],[products.filter(p=>p.type==="headset").length,"Headsets"],[withIssues,"Com pendências"],[marked.filter(r=>r.status==="fix").length,"Para corrigir"],[marked.filter(r=>r.status==="ok").length,"Revisados OK"]].map(x=>'<div class="stat"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join("")}
function render(){renderStats();const list=filtered();$("count").textContent=list.length+" modelo"+(list.length===1?"":"s")+" exibido"+(list.length===1?"":"s");$("grid").innerHTML=list.length?list.map(p=>{const pi=issues(p),r=reviews[p.id]||{},status=r.status||"pending",reviewId="review-"+p.id,noteId="note-"+p.id;return '<article class="card status-'+esc(status)+'">'+(p.imageUrl?'<img class="thumb" loading="lazy" width="92" height="92" src="'+esc(p.imageUrl)+'" alt="Imagem de '+esc(p.name)+'">':'<div class="thumb placeholder" role="img" aria-label="Produto sem imagem">?</div>')+'<div><div class="top"><div class="product-copy"><h2>'+esc(p.name)+'</h2><span class="muted product-id">'+esc(p.id)+'</span></div><span class="price">'+brl.format(p.price)+'</span></div><div class="meta"><span class="tag">'+esc(labels[p.type]||p.type)+'</span>'+(p.connection?'<span class="tag">'+esc(labels[p.connection]||p.connection)+'</span>':'')+(p.internationalPurchase?'<span class="tag">Internacional</span>':'')+(p.stores?.[0]?'<a class="tag store" target="_blank" rel="noopener" href="'+esc(p.stores[0].url)+'">'+esc(p.stores[0].label)+' ↗</a>':'')+'</div><div class="issues" aria-label="Pendências automáticas">'+(pi.length?pi.map(i=>'<span class="tag issue '+(i[2]?'severe':'')+'">'+esc(i[1])+'</span>').join(''):'<span class="tag" style="color:var(--ok)">Sem alertas automáticos</span>')+'</div></div><div class="review"><div class="review-field"><label for="'+reviewId+'">Seu parecer</label><select id="'+reviewId+'" data-review-id="'+esc(p.id)+'"><option value="pending" '+(status==='pending'?'selected':'')+'>Não revisado</option><option value="ok" '+(status==='ok'?'selected':'')+'>✓ Está correto</option><option value="fix" '+(status==='fix'?'selected':'')+'>! Precisa corrigir</option><option value="remove" '+(status==='remove'?'selected':'')+'>× Remover</option></select></div><div class="review-field"><label for="'+noteId+'">Observação opcional</label><input id="'+noteId+'" data-note-id="'+esc(p.id)+'" value="'+esc(r.note||'')+'" placeholder="Ex.: preço correto é R$ 199" /></div></div></article>'}).join(''):'<div class="empty">Nenhum modelo corresponde aos filtros. Ajuste ou limpe os filtros para continuar.</div>'}
let noteTimer;function saveNote(id,note){clearTimeout(noteTimer);noteTimer=setTimeout(()=>{reviews[id]={status:reviews[id]?.status||"pending",note};localStorage.setItem(storageKey,JSON.stringify(reviews));renderStats()},250)}
function makeReport(){const entries=products.map(p=>({p,r:reviews[p.id]})).filter(x=>x.r&&(x.r.status!=="pending"||x.r.note?.trim()));if(!entries.length)return "AUDITORIA DO CATÁLOGO\\nNenhuma correção foi marcada ainda.";return "AUDITORIA DO CATÁLOGO ("+new Date().toLocaleDateString("pt-BR")+")\\n"+entries.map(({p,r})=>'\\n- '+p.name+' ['+(r.status==='ok'?'OK':r.status==='remove'?'REMOVER':'CORRIGIR')+']'+(r.note?.trim()?' — '+r.note.trim():'')).join('')}
["search","type","issue","review","sort"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",render));
$("grid").addEventListener("change",event=>{const id=event.target.dataset.reviewId;if(id)save(id,event.target.value,reviews[id]?.note||"")});
$("grid").addEventListener("input",event=>{const id=event.target.dataset.noteId;if(id)saveNote(id,event.target.value)});
$("grid").addEventListener("error",event=>{if(event.target.matches("img.thumb")){const fallback=document.createElement("div");fallback.className="thumb placeholder";fallback.textContent="?";event.target.replaceWith(fallback)}},true);
$("report").onclick=()=>{$("reportText").value=makeReport();$("reportDialog").showModal()};$("closeDialog").onclick=()=>$("reportDialog").close();$("copyReport").onclick=async()=>{await navigator.clipboard.writeText($("reportText").value);$("copyReport").textContent="Copiado!";setTimeout(()=>$("copyReport").textContent="Copiar",1300)};
render();
</script>
</body></html>`;

writeFileSync(join(process.cwd(), "dist", "catalogo.html"), html, "utf8");
console.log(`Auditoria: ${products.length} modelos exportados para dist/catalogo.html`);
