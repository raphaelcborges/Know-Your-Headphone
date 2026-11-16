/**
 * Favoritos guardados no próprio aparelho (AsyncStorage; no navegador, localStorage).
 *
 * Sem conta e sem servidor: o catálogo vive no app e aqui só ficam os ids.
 * A lista carrega uma vez ao abrir e é regravada inteira a cada mudança.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PRODUCTS } from "../data/catalog";
import type { Product } from "../data/types";

const CHAVE = "kyh:favoritos";

interface FavoritosContextValue {
  ids: Set<string>;
  produtos: Product[];
  carregando: boolean;
  erro: string | null;
  ehFavorito: (produtoId: string) => boolean;
  alternar: (produtoId: string) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((salvo) => {
        const lista: unknown = salvo ? JSON.parse(salvo) : [];
        if (Array.isArray(lista)) setIds(new Set(lista.filter((id): id is string => typeof id === "string")));
      })
      .catch(() => setErro("Não foi possível ler os fones salvos neste aparelho."))
      .finally(() => setCarregando(false));
  }, []);

  const alternar = useCallback(async (produtoId: string) => {
    let proximo = new Set<string>();
    setIds((atual) => {
      proximo = new Set(atual);
      if (proximo.has(produtoId)) proximo.delete(produtoId);
      else proximo.add(produtoId);
      return proximo;
    });
    try {
      await AsyncStorage.setItem(CHAVE, JSON.stringify([...proximo]));
      setErro(null);
    } catch {
      setErro("Não foi possível salvar neste aparelho.");
    }
  }, []);

  // Mantém a ordem do catálogo e ignora ids de modelos que saíram dele.
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
