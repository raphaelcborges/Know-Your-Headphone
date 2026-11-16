/**
 * Favoritos de quem está logado, guardados no Supabase.
 *
 * O catálogo continua no app; aqui só trafegam ids. A lista é mantida em
 * memória e escrita de forma otimista — o botão responde na hora e volta atrás
 * se o servidor recusar.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../data/catalog";
import type { Product } from "../data/types";

interface FavoritosContextValue {
  ids: Set<string>;
  produtos: Product[];
  carregando: boolean;
  erro: string | null;
  ehFavorito: (produtoId: string) => boolean;
  alternar: (produtoId: string) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

function traduzir(mensagem: string, codigo?: string): string {
  // 42P01 = tabela não existe: o SQL de instalação ainda não foi rodado.
  if (codigo === "42P01" || mensagem.includes("does not exist")) {
    return "A tabela de favoritos ainda não foi criada no Supabase.";
  }
  if (mensagem.toLowerCase().includes("row-level security")) {
    return "O banco recusou a gravação. Confira as policies da tabela.";
  }
  if (mensagem.toLowerCase().includes("fetch") || mensagem.toLowerCase().includes("network")) {
    return "Sem conexão com o servidor.";
  }
  return mensagem;
}

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Entrou: busca a lista. Saiu: esquece tudo, sem deixar rastro na tela.
  useEffect(() => {
    if (!supabase || !usuario) {
      setIds(new Set());
      setErro(null);
      return;
    }

    let cancelado = false;
    setCarregando(true);

    supabase
      .from("favoritos")
      .select("produto_id")
      .order("criado_em", { ascending: false })
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) setErro(traduzir(error.message, error.code));
        else {
          setIds(new Set(data.map((linha) => linha.produto_id as string)));
          setErro(null);
        }
        setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [usuario]);

  const alternar = useCallback(
    async (produtoId: string) => {
      if (!supabase || !usuario) return;

      const salvando = !ids.has(produtoId);
      const anterior = ids;

      // Otimista: a tela reage antes da rede responder.
      const proximo = new Set(ids);
      if (salvando) proximo.add(produtoId);
      else proximo.delete(produtoId);
      setIds(proximo);
      setErro(null);

      const { error } = salvando
        ? await supabase.from("favoritos").insert({ usuario_id: usuario.id, produto_id: produtoId })
        : await supabase.from("favoritos").delete().eq("produto_id", produtoId);

      if (error) {
        setIds(anterior);
        setErro(traduzir(error.message, error.code));
      }
    },
    [ids, usuario],
  );

  const produtos = useMemo(() => PRODUCTS.filter((p) => ids.has(p.id)), [ids]);
  const ehFavorito = useCallback((produtoId: string) => ids.has(produtoId), [ids]);

  const valor = useMemo(
    () => ({ ids, produtos, carregando, erro, ehFavorito, alternar }),
    [ids, produtos, carregando, erro, ehFavorito, alternar],
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) throw new Error("useFavoritos precisa estar dentro de <FavoritosProvider>.");
  return contexto;
}
