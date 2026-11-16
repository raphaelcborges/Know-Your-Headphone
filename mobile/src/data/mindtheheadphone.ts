/**
 * Classificações das listas de recomendação do Mind the Headphone (Leonardo Drummond).
 *
 *   https://www.mindtheheadphone.com.br/recomendacoes/earphones
 *   https://www.mindtheheadphone.com.br/recomendacoes/headphones
 *
 * Coletado em 2026-11-16. Daqui saem só dados objetivos de classificação —
 * assinatura sonora, formato, conexão — e o link do review em vídeo. Os
 * comentários e os links de loja do site NÃO entram: os textos são dele, e os
 * links de loja são de afiliado dele.
 *
 * `id` é o id do produto em products.ts; `null` = modelo recomendado lá que
 * ainda não está no catálogo (ver scripts/modelos-mth-faltando.txt).
 */
import type { Connection, Fit, SoundSignature } from "./types.ts";

export const MTH_SOURCE = {
  label: "Mind the Headphone",
  earphones: "https://www.mindtheheadphone.com.br/recomendacoes/earphones",
  headphones: "https://www.mindtheheadphone.com.br/recomendacoes/headphones",
  collectedAt: "2026-11-16",
  /** Kuba Áudio é a marca do próprio autor do Mind the Headphone. */
  ownBrandIdPrefixes: ["kuba-"],
  ownBrandNote: "A Kuba Áudio é a marca do autor do Mind the Headphone.",
};

type MthConnection = Exclude<Connection, "tanto-faz"> | "ambos";

export interface MthEntry {
  id: string | null;
  name: string;
  /** Preço que o site mostrava na coleta — referência, não substitui o seu. */
  price: number;
  signature: SoundSignature;
  fit: Fit;
  connection?: MthConnection;
  gamer?: boolean;
  reviewUrl?: string;
  list: "earphones" | "headphones";
}

type Row = [string | null, string, number, SoundSignature, Fit, MthConnection | "gamer" | null, string?];

const EARPHONES: Row[] = [
  ["kz-edc-pro", "KZ EDC Pro", 41.33, "natural", "intra-auricular", "cabeado", "https://youtu.be/UoO4cDuKESk"],
  [null, "GK Kunten", 57.64, "natural", "intra-auricular", "cabeado", "https://youtu.be/wlwcgCXeQ_U"],
  ["ry4s", "RY4S", 57.86, "natural", "earbud", "cabeado", "https://youtu.be/EpU1_q5KMFE"],
  ["lenovo-gm2-pro", "Lenovo GM2 Pro", 60.83, "natural", "intra-auricular", "bluetooth", "https://youtu.be/QoWY7vkh_3g"],
  ["trn-mt4-pro", "TRN MT4 Pro", 107.45, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/PSxpR5jGeG8"],
  ["redmi-buds-6-active", "Redmi Buds 6 Active", 110.34, "natural", "earbud", "bluetooth", "https://youtu.be/AJSEmxiIp4g"],
  [null, "GK Streak", 115, "natural", "intra-auricular", "cabeado", "https://youtu.be/AAbWGhl9MgQ"],
  [null, "KZ Duonic", 120, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/vVQil12Xf-s"],
  ["qcy-t13-anc", "QCY T13 ANC", 123.98, "energetico", "intra-auricular", "bluetooth", "https://youtu.be/fWOAdu48rtw"],
  ["qkz-x-hbb", "QKZ x HBB", 123.98, "basshead", "intra-auricular", "cabeado", "https://youtu.be/Vo3-XIjqhZs"],
  ["kawano-horaiko", "Kawano Horaiko", 150, "natural", "earbud", "cabeado", "https://youtu.be/WBGbNFZNPvE"],
  [null, "Moondrop Chu III", 170, "natural", "intra-auricular", "cabeado"],
  ["anker-p20i", "Anker Soundcore P20i", 181.83, "energetico", "intra-auricular", "bluetooth", "https://youtu.be/eslfbd_DepM"],
  ["kz-prx", "KZ PRX", 181.83, "v-shaped", "intra-auricular", "cabeado", "https://youtu.be/iZfagOfaPHI"],
  ["trn-conch", "TRN Conch", 190.1, "neutro-frio", "intra-auricular", "cabeado"],
  ["moondrop-space-travel-2", "Moondrop Space Travel 2", 198.36, "natural", "intra-auricular", "bluetooth", "https://youtu.be/tJYlWB8y45A"],
  ["kawano-hanabi", "Kawano Hanabi", 250, "natural", "earbud", "cabeado", "https://youtu.be/WBGbNFZNPvE"],
  ["qcy-ht10", "QCY HT10", 259.11, "natural", "earbud", "bluetooth", "https://youtu.be/1EGGBnM_7FM"],
  ["kz-zar", "KZ ZAR", 264.48, "basshead", "intra-auricular", "cabeado", "https://youtu.be/ai-ecH6i5s8"],
  ["kefine-klean", "Kefine Klean", 272.75, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/6QGhlRmeM8U"],
  [null, "Kuba Auri", 279, "natural", "intra-auricular", "cabeado", "https://youtu.be/a0ytonhAeMM"],
  ["kz-zs10-pro-x", "KZ ZS10 Pro X", 289.28, "energetico", "intra-auricular", "cabeado", "https://youtu.be/F8SRRMTV1vY"],
  ["qcy-melobuds-pro", "QCY MeloBuds Pro", 297.54, "natural", "intra-auricular", "bluetooth", "https://youtu.be/G72tDT2FqTc"],
  [null, "QCY Melobuds N65", 298, "natural", "intra-auricular", "bluetooth", "https://youtu.be/Y6iUfH3gNlc"],
  [null, "oraimo SpaceBuds 2", 320, "basshead", "intra-auricular", "bluetooth", "https://youtu.be/0WECpd8H1V8"],
  ["moondrop-pill", "Moondrop Pill", 322.34, "natural", "earbud", "bluetooth", "https://youtu.be/LH8zwBcuS2U"],
  ["kuba-mali-2", "Kuba Mali 2", 379, "natural", "intra-auricular", "bluetooth", "https://youtu.be/fAgUFxRt76M"],
  ["anker-liberty-4nc", "Anker Soundcore Liberty 4NC", 415, "energetico", "intra-auricular", "bluetooth", "https://youtu.be/Yvfwc-KJD-s"],
  ["realme-buds-air-7", "Realme Buds Air 7", 431, "natural", "intra-auricular", "bluetooth", "https://youtu.be/kgemof5Czd0"],
  ["tanchjim-4u", "Tanchjim 4U", 478.86, "neutro-frio", "intra-auricular", "cabeado", "https://youtu.be/4hjDwBsDs6s"],
  ["truthear-zero-red", "Truthear Zero:RED", 500.75, "natural", "intra-auricular", "cabeado", "https://youtu.be/8JBKJPWboWo"],
  ["truthear-pure", "Truthear Pure", 577.36, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/1R0DKM_2QKk"],
  ["huawei-freebuds-5", "Huawei Freebuds 5", 649, "natural", "earbud", "bluetooth", "https://youtu.be/I9oflmOAJRU"],
  ["truthear-hexa", "Truthear Hexa", 653.97, "neutro-frio", "intra-auricular", "cabeado", "https://youtu.be/pbfB8JWkxCY"],
  ["dunu-alpha-3", "Dunu Alpha 3", 741.41, "natural", "earbud", "cabeado", "https://youtu.be/ENL1PZ0U62I"],
  [null, "Huawei FreeClip 2", 790, "natural", "earbud", "bluetooth", "https://youtu.be/C-m2-CaIhgs"],
  ["samsung-buds3-fe", "Samsung Galaxy Buds3 FE", 799, "natural", "intra-auricular", "bluetooth", "https://youtu.be/iC3NbFVpvgM"],
  [null, "Huawei FreeBuds Pro 5", 850, "natural", "intra-auricular", "bluetooth"],
  [null, "CrinEar Nightfall", 880, "natural", "intra-auricular", "cabeado", "https://youtu.be/vionrkrVu5I"],
  ["aful-explorer", "Aful Explorer", 916.62, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/DYIIgmIN1YQ"],
  ["kinera-celest-phoenixcall", "Kinera Celest Phoenixcall", 1004.18, "v-shaped", "intra-auricular", "cabeado", "https://youtu.be/CtzaLFl3uO4"],
  ["letshuoer-s12", "Letshuoer S12", 1015.12, "energetico", "intra-auricular", "cabeado", "https://youtu.be/NvT2sZ9ivkQ"],
  ["tri-i3-mk3", "Tri i3 MK3", 1299.66, "musical", "intra-auricular", "cabeado", "https://youtu.be/ux1crHI5xlU"],
  [null, "Apple AirPods 5", 1330, "musical", "intra-auricular", "bluetooth", "https://youtu.be/TjQ0RER52Qc"],
  ["simphonio-sunrise-dragon-2", "Simphonio Sunrise Dragon 2", 1507.6, "natural", "earbud", "cabeado", "https://youtu.be/ENL1PZ0U62I"],
  ["crinear-daybreak", "CrinEar Daybreak", 1726.48, "natural", "intra-auricular", "cabeado", "https://youtu.be/tU4lzBHKmc0"],
  ["juzear-butterfly-61t", "Juzear Butterfly 61T", 2262.74, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/RKFWUUavKP8"],
  ["apple-airpods-pro-2", "Apple AirPods Pro 2", 2500, "natural", "intra-auricular", "bluetooth", "https://youtu.be/MZwJHM1mgRE"],
  ["moondrop-blessing-3", "Moondrop Blessing 3", 3017.87, "neutro-frio", "intra-auricular", "cabeado", "https://youtu.be/DI9Wq3p8TmE"],
  ["aful-performer-8", "Aful Performer 8", 3105.42, "musical", "intra-auricular", "cabeado", "https://youtu.be/SwTiLgMsg4Y"],
  ["dunu-davinci", "Dunu DaVinci", 3138.26, "neutro-quente", "intra-auricular", "cabeado", "https://youtu.be/MPmGbfs4sYI"],
  ["xenns-mangird-tea-pro", "Xenns Mangird Tea Pro", 3400.91, "natural", "intra-auricular", "cabeado"],
  [null, "CrinEar Reference", 3575, "natural", "intra-auricular", "cabeado", "https://youtu.be/F-srRDJPuAQ"],
  ["hisenior-cano-cristales", "HiSenior Caño Cristales", 4232.66, "basshead", "intra-auricular", "cabeado", "https://youtu.be/yTLIGo5Mfpc"],
  [null, "HiSenior Mega7", 4590, "natural", "intra-auricular", "cabeado", "https://youtu.be/HMDiKZUTErQ"],
  ["dunu-sa6-mkii", "Dunu SA6 MKII", 4626.64, "musical", "intra-auricular", "cabeado", "https://youtu.be/Z1PncT5WTG8"],
  ["moondrop-meteor", "Moondrop Meteor", 4681.36, "natural", "intra-auricular", "cabeado", "https://youtu.be/UfO3ccRD93s"],
  ["audiodream-ad8", "AudioDream AD8", 5900, "neutro-frio", "intra-auricular", "cabeado", "https://youtu.be/zaR6ONrupG4"],
  ["aful-cantor", "Aful Cantor", 6870.16, "neutro-frio", "intra-auricular", "cabeado", "https://youtube.com/shorts/m0roJHnilPM"],
  ["thieaudio-monarch-mkiv", "Thieaudio Monarch MKIV", 12440.66, "natural", "intra-auricular", "cabeado", "https://youtu.be/wZlbsiet5Oc"],
  ["64audio-u4s", "64Audio U4S", 12987.86, "energetico", "intra-auricular", "cabeado", "https://youtu.be/etPOvdNB46M"],
  ["64audio-volur", "64Audio Volür", 27226, "energetico", "intra-auricular", "cabeado", "https://youtu.be/Sd3ZzgAmkSA"],
];

const HEADPHONES: Row[] = [
  ["havit-hv-h2002d", "Havit H2002D", 149, "natural", "over-ear", "gamer", "https://youtu.be/HuNNC9B6S0Y"],
  ["oneodio-pro-10", "OneOdio Pro-10", 189, "natural", "over-ear", "cabeado", "https://youtu.be/Sjv257nTm4M"],
  ["ugreen-max5c", "UGreen HiTune Max5C", 199, "natural", "over-ear", "bluetooth", "https://youtu.be/nMB6Zg4do7E"],
  ["arcano-shp80", "Arcano SHP80", 234.99, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/08sU1AYHX8s"],
  ["arcano-shp300", "Arcano SHP300", 279.99, "energetico", "over-ear", "cabeado", "https://youtu.be/2uIE9rXdfYI"],
  ["haylou-s30-pro", "Haylou S30 Pro", 295, "energetico", "over-ear", "bluetooth", "https://youtu.be/richJiDWQcU"],
  [null, "FiiO EH11", 310, "neutro-quente", "over-ear", "bluetooth", "https://youtu.be/tfmzzeHBak8"],
  ["philips-shp9500", "Philips SHP9500", 388.46, "natural", "over-ear", "cabeado", "https://youtu.be/duTiBYfhLZQ"],
  ["anker-soundcore-q30", "Anker Soundcore Q30", 419, "energetico", "over-ear", "bluetooth", "https://youtu.be/KPn8sV8bf4c"],
  ["hifiman-he400se", "Hifiman HE400SE", 478.86, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/hQHY2pngXHA"],
  ["armer-sh550", "Armer SH550", 649, "basshead", "over-ear", "cabeado", "https://youtu.be/o75I2gmVmK8"],
  ["akg-k361", "AKG K361", 737, "natural", "over-ear", "cabeado"],
  ["kuba-disco-2", "Kuba Disco 2", 799, "energetico", "over-ear", "cabeado", "https://youtu.be/6UoGqQxGems"],
  ["akg-k361bt", "AKG K361BT", 988, "natural", "over-ear", "bluetooth"],
  ["sennheiser-hd560s", "Sennheiser HD560S", 1240, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/Z_k1rjVe5ZI"],
  ["kuba-disco-bluetooth", "Kuba Disco Bluetooth", 1399, "energetico", "over-ear", "bluetooth", "https://youtu.be/SQTdZFNNubc"],
  ["corsair-virtuoso-pro", "Corsair Virtuoso Pro", 1499, "natural", "over-ear", "gamer", "https://youtu.be/o7-C2WUk48M"],
  ["hifiman-edition-xs", "Hifiman Edition XS", 1770.26, "energetico", "over-ear", "cabeado", "https://youtu.be/iQIpl2-Gxy0"],
  ["corsair-virtuoso-rgb-wireless", "Corsair Virtuoso RGB Wireless", 1800, "energetico", "over-ear", "gamer", "https://youtu.be/o7-C2WUk48M"],
  ["beyerdynamic-dt770-pro", "Beyerdynamic DT770 Pro", 1899, "v-shaped", "over-ear", "cabeado"],
  ["fiio-ft1", "FiiO FT1", 2087.63, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/p4fhPRsjcNo"],
  [null, "Meze 99 Classics V2", 2500, "natural", "over-ear", "cabeado", "https://youtu.be/dwWYW797PIo"],
  ["sennheiser-hd600", "Sennheiser HD600", 3233.93, "natural", "over-ear", "cabeado", "https://youtu.be/2CQ0jqn87HA"],
  ["bose-qc-ultra", "Bose QC Ultra Gen 2", 3499, "basshead", "over-ear", "bluetooth"],
  ["moondrop-para-2", "Moondrop Para II", 5200, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/GUDPQKSNhg0"],
  ["apple-airpods-max", "Apple AirPods Max", 6398, "musical", "over-ear", "bluetooth", "https://youtu.be/BFyawzZ8DOw"],
  ["focal-bathys", "Focal Bathys", 8000, "natural", "over-ear", "bluetooth", "https://youtu.be/chXVbakXR_4"],
  ["moondrop-cosmo", "Moondrop Cosmo", 10799.06, "neutro-quente", "over-ear", "cabeado", "https://youtu.be/EvwIqY6XgAc"],
  ["meze-empyrean-ii", "Meze Empyrean II", 32687.06, "v-shaped", "over-ear", "cabeado", "https://youtu.be/LnXoN_Aeeuk"],
  ["stax-sr-009s", "Stax SR-009S", 39999, "neutro-frio", "over-ear", "cabeado", "https://youtu.be/728RMJtU2VQ"],
  ["focal-utopia-2022", "Focal Utopia 2022", 40000, "natural", "over-ear", "cabeado", "https://youtu.be/lanT5yLmWgc"],
  ["stax-sr-x9000", "Stax SR-X9000", 49000, "neutro-frio", "over-ear", "cabeado", "https://youtu.be/7du9oDkHdSA"],
];

const toEntry = (list: MthEntry["list"]) => ([id, name, price, signature, fit, conn, reviewUrl]: Row): MthEntry => ({
  id,
  name,
  price,
  signature,
  fit,
  connection: conn === "gamer" || conn === null ? undefined : conn,
  gamer: conn === "gamer" || undefined,
  reviewUrl,
  list,
});

export const MTH_ENTRIES: MthEntry[] = [
  ...EARPHONES.map(toEntry("earphones")),
  ...HEADPHONES.map(toEntry("headphones")),
];

export const MTH_BY_ID = new Map(
  MTH_ENTRIES.filter((e): e is MthEntry & { id: string } => e.id !== null).map((e) => [e.id, e]),
);
