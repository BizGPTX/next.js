import type { TarotCard as TarotCardType } from "@/data/tarotCards";

type TarotCardProps = {
  card: TarotCardType;
  index: number;
  showMeaning: boolean;
  revealed: boolean;
};

export function TarotCard({
  card,
  index,
  showMeaning,
  revealed,
}: TarotCardProps) {
  return (
    <article
      className={`tarot-card ${revealed ? "revealed" : ""}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="tarot-card__glow" aria-hidden="true" />
      <div className="tarot-card__eyebrow">{index + 1}</div>
      <h3>{card.name}</h3>
      <p className="tarot-card__meta">
        {card.arcana === "Major"
          ? "Major Arcana"
          : `${card.suit} • Minor Arcana`}
      </p>
      {showMeaning ? (
        <p className="tarot-card__meaning">{card.uprightMeaning}</p>
      ) : null}
    </article>
  );
}
