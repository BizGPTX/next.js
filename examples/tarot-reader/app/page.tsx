"use client";

import { useMemo, useState } from "react";
import { ReadingPanel } from "@/components/ReadingPanel";
import { TarotCard } from "@/components/TarotCard";
import type { TarotCard as TarotCardType } from "@/data/tarotCards";
import { getDailyCard } from "@/lib/dailyCard";
import { drawUniqueCards } from "@/lib/drawCards";
import { generateTarotReading } from "@/lib/generateReading";

export default function HomePage() {
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [copyLabel, setCopyLabel] = useState("Copy Reading");

  const dailyCard = useMemo(() => getDailyCard(), []);
  const reading =
    drawnCards.length === 3 ? generateTarotReading(drawnCards) : null;

  const handleDraw = () => {
    setDrawnCards(drawUniqueCards(3));
    setCopyLabel("Copy Reading");
  };

  const handleCopy = async () => {
    if (!reading) {
      return;
    }

    try {
      await navigator.clipboard.writeText(reading.shareText);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Copy unavailable");
    }
  };

  return (
    <main className="page-shell">
      <div className="sparkle sparkle-one" aria-hidden="true" />
      <div className="sparkle sparkle-two" aria-hidden="true" />
      <div className="sparkle sparkle-three" aria-hidden="true" />

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-label">Mystical guidance</p>
          <h1>Tarot Reader</h1>
          <p className="hero-subtitle">Draw 3 cards and receive your reading</p>
          <p className="hero-description">
            Step into a calm, glowing space for a three-card spread that
            reflects your past, illuminates the present, and whispers toward
            your future.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={handleDraw}
            >
              {drawnCards.length === 0 ? "Draw My Cards" : "Draw Again"}
            </button>
            <label className="toggle-row">
              <input
                checked={showMeaning}
                onChange={(event) => setShowMeaning(event.target.checked)}
                type="checkbox"
              />
              <span>Show card meanings</span>
            </label>
          </div>
        </div>

        <aside className="daily-card-panel">
          <p className="section-label">Daily card</p>
          <h2>{dailyCard.name}</h2>
          <p className="daily-meta">
            {dailyCard.arcana === "Major"
              ? "Major Arcana"
              : `${dailyCard.suit} • Minor Arcana`}
          </p>
          <p>{dailyCard.uprightMeaning}</p>
        </aside>
      </section>

      <section className="spread-panel">
        <div className="spread-panel__header">
          <div>
            <p className="section-label">Three-card spread</p>
            <h2>Your cards will appear here</h2>
          </div>
          <p className="spread-hint">
            The first card is your Past, the second your Present, and the third
            your Future.
          </p>
        </div>

        <div className="cards-grid">
          {drawnCards.length > 0 ? (
            drawnCards.map((card, index) => (
              <TarotCard
                card={card}
                index={index}
                key={`${card.name}-${index}`}
                revealed
                showMeaning={showMeaning}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>
                Draw your cards to reveal the spread and unlock your reading.
              </p>
            </div>
          )}
        </div>
      </section>

      {reading ? (
        <ReadingPanel
          copyLabel={copyLabel}
          onCopy={handleCopy}
          reading={reading}
        />
      ) : null}
    </main>
  );
}
