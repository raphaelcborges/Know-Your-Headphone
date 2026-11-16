import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/Button";
import { Campo } from "../components/Campo";
import { Cta } from "../components/Cta";
import { Screen } from "../components/Screen";
import { GRADIENTS, styles } from "../theme";

type Modo = "entrar" | "registrar";

interface AuthScreenProps {
  modo: Modo;
  onTrocarModo: (modo: Modo) => void;
  onPronto: () => void;
  onVoltar: () => void;
  onGuest: () => void;
}

interface Erros {
  nome?: string;
  email?: string;
  senha?: string;
  confirmacao?: string;
  geral?: string;
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function AuthScreen({ modo, onTrocarModo, onPronto, onVoltar, onGuest }: AuthScreenProps) {
  const { entrar, registrar, disponivel } = useAuth();
  const registrando = modo === "registrar";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [confirmeEmail, setConfirmeEmail] = useState(false);

  function validar(): Erros {
    const achados: Erros = {};
    if (registrando && nome.trim().length < 2) achados.nome = "Escreva seu nome.";
    if (!EMAIL_VALIDO.test(email.trim())) achados.email = "E-mail inválido.";
    if (senha.length < 6) achados.senha = "A senha precisa de pelo menos 6 caracteres.";
    if (registrando && confirmacao !== senha) achados.confirmacao = "As senhas não são iguais.";
    return achados;
  }

  async function enviar() {
    const achados = validar();
    setErros(achados);
    if (Object.keys(achados).length > 0) return;

    setEnviando(true);
    try {
      if (registrando) {
        const { precisaConfirmarEmail } = await registrar(nome, email, senha);
        // Com confirmação ligada no projeto, não há sessão ainda: a pessoa
        // precisa abrir o e-mail antes de entrar.
        if (precisaConfirmarEmail) {
          setConfirmeEmail(true);
          return;
        }
      } else {
        await entrar(email, senha);
      }
      onPronto();
    } catch (erro) {
      setErros({ geral: erro instanceof Error ? erro.message : "Não deu certo. Tente de novo." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Screen
      gradient={GRADIENTS.lista}
      step={registrando ? "Criar conta" : "Conta opcional"}
      title={registrando ? "Guarde suas escolhas" : "Acesse seus fones salvos"}
      subtitle={
        registrando
          ? "A conta serve para guardar os fones que você separar."
          : "O login serve apenas para sincronizar favoritos e avaliações."
      }
      onBack={onVoltar}
    >
      {!disponivel && (
        <Text style={styles.formAviso}>
          As contas não estão configuradas neste build. Preencha mobile/.env com as chaves do
          Supabase para ativar entrar e registrar.
        </Text>
      )}

      {registrando && (
        <Campo
          rotulo="Nome"
          value={nome}
          onChangeText={setNome}
          erro={erros.nome}
          autoCapitalize="words"
          autoComplete="name"
          placeholder="Como podemos te chamar"
        />
      )}

      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        erro={erros.email}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        placeholder="voce@exemplo.com"
      />

      <Campo
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        erro={erros.senha}
        secureTextEntry
        autoCapitalize="none"
        autoComplete={registrando ? "new-password" : "current-password"}
        placeholder="Mínimo de 6 caracteres"
      />

      {registrando && (
        <Campo
          rotulo="Repita a senha"
          value={confirmacao}
          onChangeText={setConfirmacao}
          erro={erros.confirmacao}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="A mesma senha"
        />
      )}

      {confirmeEmail && (
        <Text style={styles.formAviso}>
          Conta criada. Abra o e-mail que enviamos para {email.trim().toLowerCase()} e confirme o
          endereço — depois é só entrar.
        </Text>
      )}

      {erros.geral && <Text style={styles.campoErro}>{erros.geral}</Text>}

      <View style={styles.formAcoes}>
        <Cta
          label={enviando ? "Aguarde" : registrando ? "Criar conta" : "Entrar"}
          onPress={enviando ? () => {} : enviar}
        />
        <View style={styles.authDivider}>
          <View style={styles.authDividerLine} />
          <Text style={styles.authDividerText}>conta opcional</Text>
          <View style={styles.authDividerLine} />
        </View>
        <Text style={styles.guestNote}>Quer apenas testar? O quiz e as recomendações funcionam sem login.</Text>
        <Button label="Continuar sem conta" onPress={onGuest} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setErros({});
          onTrocarModo(registrando ? "entrar" : "registrar");
        }}
      >
        <Text style={styles.formTroca}>
          {registrando ? "Já tem conta? " : "Ainda não tem conta? "}
          <Text style={styles.formTrocaForte}>{registrando ? "Entrar" : "Criar uma"}</Text>
        </Text>
      </Pressable>
    </Screen>
  );
}
