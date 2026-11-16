import { useMemo, useState } from "react";
import { Screen } from "./components/Screen";
import {
  ACTIVITIES,
  PRICE_RANGES,
  TYPE_LABELS,
  filterProducts,
  formatPrice,
  typesForActivity,
} from "./data/catalog";
import type { Activity, HeadphoneType, PriceRange, Product } from "./data/types";
import "./App.css";

type Step = "inicio" | "atividade" | "preco" | "tipo" | "resultados" | "detalhes";

interface Choices {
  activity?: Activity;
  range?: PriceRange;
  type?: HeadphoneType;
  product?: Product;
}

const BG = {
  inicio: "/assets/bg1.png",
  atividade: "/assets/bg2.png",
  preco: "/assets/bg4.png",
  tipo: "/assets/bg5.png",
  lista: "/assets/bg3.png",
};

export default function App() {
  const [step, setStep] = useState<Step>("inicio");
  const [choices, setChoices] = useState<Choices>({});

  const results = useMemo(() => {
    const { activity, range, type } = choices;
    if (!activity || !range || !type) return [];
    return filterProducts(activity, range, type);
  }, [choices]);

  const restart = () => {
    setChoices({});
    setStep("inicio");
  };

  if (step === "inicio") {
    return (
      <Screen
        background={BG.inicio}
        title="Know Your Headphone"
        subtitle="Responda três perguntas e descubra o fone ideal para você."
      >
        <button type="button" className="button button--primary" onClick={() => setStep("atividade")}>
          Começar
        </button>
      </Screen>
    );
  }

  if (step === "atividade") {
    return (
      <Screen
        background={BG.atividade}
        title="Para que você vai usar?"
        onBack={restart}
      >
        <div className="options">
          {ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              type="button"
              className="button"
              onClick={() => {
                setChoices({ activity: activity.id });
                setStep("preco");
              }}
            >
              <span aria-hidden="true">{activity.emoji}</span> {activity.label}
            </button>
          ))}
        </div>
      </Screen>
    );
  }

  if (step === "preco") {
    return (
      <Screen
        background={BG.preco}
        title="Quanto quer gastar?"
        onBack={() => setStep("atividade")}
      >
        <div className="options">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              className="button"
              onClick={() => {
                setChoices((prev) => ({ ...prev, range, type: undefined }));
                setStep("tipo");
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </Screen>
    );
  }

  if (step === "tipo" && choices.activity) {
    return (
      <Screen
        background={BG.tipo}
        title="Qual formato você prefere?"
        onBack={() => setStep("preco")}
      >
        <div className="options">
          {typesForActivity(choices.activity).map((type) => (
            <button
              key={type}
              type="button"
              className="button"
              onClick={() => {
                setChoices((prev) => ({ ...prev, type }));
                setStep("resultados");
              }}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </Screen>
    );
  }

  if (step === "detalhes" && choices.product) {
    const product = choices.product;
    return (
      <Screen background={BG.lista} onBack={() => setStep("resultados")}>
        <article className="details">
          <img className="details__image" src={product.imageUrl} alt={product.name} />
          <h1 className="details__name">{product.name}</h1>
          <p className="details__price">{formatPrice(product.price)}</p>
          <p className="details__description">
            {product.description ?? "Descrição não disponível."}
          </p>
          <p className="details__meta">
            {TYPE_LABELS[product.type]} · indicado para{" "}
            {product.activities.join(", ")}
          </p>
          {product.productUrl && (
            <a
              className="button button--primary"
              href={product.productUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Ver na loja
            </a>
          )}
        </article>
      </Screen>
    );
  }

  // step === "resultados" (e fallback para estados incompletos)
  const summary =
    choices.activity && choices.range && choices.type
      ? `${choices.activity} · ${choices.range.label} · ${TYPE_LABELS[choices.type]}`
      : undefined;

  return (
    <Screen
      background={BG.lista}
      title="Recomendações"
      subtitle={summary}
      onBack={() => setStep("tipo")}
    >
      {results.length === 0 ? (
        <div className="empty">
          <p>Nenhum modelo encontrado com essas escolhas.</p>
          <button type="button" className="button" onClick={() => setStep("preco")}>
            Tentar outra faixa de preço
          </button>
        </div>
      ) : (
        <ul className="results">
          {results.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                className="card"
                onClick={() => {
                  setChoices((prev) => ({ ...prev, product }));
                  setStep("detalhes");
                }}
              >
                <img className="card__image" src={product.imageUrl} alt="" />
                <span className="card__body">
                  <span className="card__name">{product.name}</span>
                  <span className="card__price">{formatPrice(product.price)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
