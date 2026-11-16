import type { ReactNode } from "react";

interface ScreenProps {
  background: string;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function Screen({ background, title, subtitle, onBack, children }: ScreenProps) {
  return (
    <div className="screen" style={{ backgroundImage: `url(${background})` }}>
      <div className="screen__scrim" />
      <div className="screen__content">
        {onBack && (
          <button type="button" className="link-button" onClick={onBack}>
            ← Voltar
          </button>
        )}
        {title && <h1 className="screen__title">{title}</h1>}
        {subtitle && <p className="screen__subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
