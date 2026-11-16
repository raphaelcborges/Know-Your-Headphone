import "react-native-url-polyfill/auto";
import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chave = process.env.EXPO_PUBLIC_SUPABASE_KEY;

/** Sem chaves configuradas o app roda normal, só sem contas. */
export const supabaseConfigurado = Boolean(url && chave);

if (!supabaseConfigurado) {
  console.warn(
    "Supabase não configurado: copie mobile/.env.example para mobile/.env e preencha. " +
      "As telas de conta ficam indisponíveis até lá.",
  );
}

export const supabase = supabaseConfigurado
  ? createClient(url!, chave!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // No app não existe URL de retorno para ler; na web existe.
        detectSessionInUrl: Platform.OS === "web",
      },
    })
  : null;

// No celular, renovar o token só faz sentido com o app à frente. Sem isto o
// Supabase fica tentando renovar em segundo plano e queima bateria.
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (estado) => {
    if (estado === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
