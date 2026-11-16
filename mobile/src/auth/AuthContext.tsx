/**
 * Autenticação de verdade, via Supabase Auth.
 *
 * A interface pública — `usuario`, `entrar`, `registrar`, `sair` — é a mesma da
 * versão local anterior, de propósito: as telas não sabem quem autentica.
 *
 * Sem chaves no `.env`, o app continua funcionando; só as telas de conta ficam
 * indisponíveis (ver `supabaseConfigurado`).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseConfigurado } from "../lib/supabase";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  disponivel: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  /** Devolve `precisaConfirmarEmail` quando o projeto exige confirmação. */
  registrar: (
    nome: string,
    email: string,
    senha: string,
  ) => Promise<{ precisaConfirmarEmail: boolean }>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** O nome vai no `user_metadata` no cadastro; sem ele, usamos o e-mail. */
function paraUsuario(user: User): Usuario {
  const nome = (user.user_metadata?.nome as string | undefined)?.trim();
  return {
    id: user.id,
    nome: nome || user.email?.split("@")[0] || "você",
    email: user.email ?? "",
  };
}

/** Mensagens do Supabase vêm em inglês; as comuns viram português aqui. */
function traduzir(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha não conferem.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("user already registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("password should be at least")) {
    return "A senha é curta demais para as regras do servidor.";
  }
  // "Email address "x@y.com" is invalid" — o servidor recusa domínios que não
  // recebem e-mail de verdade, como example.com.
  if (m.includes("email") && m.includes("invalid")) {
    return "O servidor recusou esse e-mail. Use um endereço que receba mensagens.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Muitas tentativas seguidas. Espere um pouco.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Sem conexão com o servidor.";
  }
  return mensagem;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(supabaseConfigurado);

  useEffect(() => {
    if (!supabase) return;

    const aplicar = (sessao: Session | null) =>
      setUsuario(sessao?.user ? paraUsuario(sessao.user) : null);

    supabase.auth
      .getSession()
      .then(({ data }) => aplicar(data.session))
      .finally(() => setCarregando(false));

    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => aplicar(sessao));
    return () => data.subscription.unsubscribe();
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    if (!supabase) throw new Error("Contas indisponíveis: falta configurar o Supabase.");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    if (error) throw new Error(traduzir(error.message));
  }, []);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    if (!supabase) throw new Error("Contas indisponíveis: falta configurar o Supabase.");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: { data: { nome: nome.trim() } },
    });
    if (error) throw new Error(traduzir(error.message));
    // Com confirmação de e-mail ligada, o cadastro não abre sessão na hora.
    return { precisaConfirmarEmail: !data.session };
  }, []);

  const sair = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(traduzir(error.message));
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, disponivel: supabaseConfigurado, entrar, registrar, sair }),
    [usuario, carregando, entrar, registrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return contexto;
}
