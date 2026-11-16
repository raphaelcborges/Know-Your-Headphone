import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../theme";
import type { Gradient } from "../theme";

interface ScreenProps {
  gradient: Gradient;
  /** "Passo 1 de 7" — some nas telas que não fazem parte do questionário. */
  step?: string;
  /** Qual das sete perguntas está na tela (1 a 7). */
  progresso?: number;
  title?: string;
  subtitle?: string;
  quiz?: boolean;
  onBack?: () => void;
  children: ReactNode;
}

export function Screen({
  gradient,
  step,
  progresso,
  title,
  subtitle,
  quiz,
  onBack,
  children,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.fill}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          quiz && styles.quizContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {(onBack || progresso !== undefined) && (
          <View style={styles.screenTopRow}>
            {onBack ? (
              <Pressable accessibilityRole="button" onPress={onBack} hitSlop={16} style={styles.backButton}>
                <Text style={styles.backArrow}>‹</Text>
                <Text style={styles.backText}>Voltar</Text>
              </Pressable>
            ) : <View />}
            {progresso !== undefined && <Text style={styles.progressoTexto}>PASSO {progresso} DE 7</Text>}
          </View>
        )}
        {progresso !== undefined && (
          <View style={styles.progressoBloco} accessibilityLabel={`Passo ${progresso} de 7`}>
            <View style={styles.progresso}>
              <View style={[styles.progressoPassoFeito, { width: `${(progresso / 7) * 100}%` }]} />
            </View>
          </View>
        )}
        {(step || title || subtitle) && (
          <View style={[styles.header, quiz && styles.quizHeader]}>
            {step && progresso === undefined && <Text style={styles.stepBadge}>{step}</Text>}
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {quiz && !subtitle && <Text style={styles.quizInstruction}>Escolha a opção que mais combina com você.</Text>}
          </View>
        )}
        {children}
      </ScrollView>
    </LinearGradient>
  );
}
