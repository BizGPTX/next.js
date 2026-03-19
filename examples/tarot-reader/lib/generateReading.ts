import type { TarotCard } from "@/data/tarotCards";

export type SpreadLabel = "Past" | "Present" | "Future";

export type ReadingSection = {
  label: SpreadLabel;
  card: TarotCard;
  insight: string;
};

export type TarotReading = {
  sections: ReadingSection[];
  overall: string;
  shareText: string;
};

const sectionIntros: Record<SpreadLabel, string> = {
  Past: "Your past card suggests",
  Present: "Right now, your energy centers on",
  Future: "Looking ahead, the path opens toward",
};

const suitGuidance: Record<NonNullable<TarotCard["suit"]>, string> = {
  Wands: "creative courage and bold movement",
  Cups: "emotional honesty and heartfelt intuition",
  Swords: "clear thinking and brave conversations",
  Pentacles: "steady effort and grounded care",
};

function describeCardEnergy(card: TarotCard): string {
  if (card.arcana === "Major") {
    return `a soul lesson around ${card.uprightMeaning}`;
  }

  return `${card.uprightMeaning}, amplified by ${suitGuidance[card.suit!]}`;
}

function buildSectionInsight(label: SpreadLabel, card: TarotCard): string {
  const cadence =
    label === "Past"
      ? "You may be carrying wisdom from that chapter, even if you no longer need its full weight."
      : label === "Present"
        ? "This is the energy asking for your trust, attention, and gentle responsiveness today."
        : "If you meet this moment with openness, the future can unfold with more grace than fear.";

  return `${sectionIntros[label]} ${describeCardEnergy(card)}. ${cadence}`;
}

function buildOverallInterpretation([past, present, future]: [
  TarotCard,
  TarotCard,
  TarotCard,
]): string {
  const pastFocus =
    past.arcana === "Major" ? past.name : past.suit?.toLowerCase();
  const presentFocus =
    present.arcana === "Major" ? present.name : present.suit?.toLowerCase();
  const futureFocus =
    future.arcana === "Major" ? future.name : future.suit?.toLowerCase();

  return `Taken together, this spread feels like a gentle conversation between where you have been, what you are learning now, and what is quietly ripening next. The past speaks through ${pastFocus}, reminding you that earlier experiences have prepared you with real wisdom. The present leans into ${presentFocus}, asking you to stay sincere with yourself instead of rushing for certainty. The future shimmers with ${futureFocus}, suggesting that your next chapter grows stronger when you blend intuition with grounded action. Trust that you do not need to force the story forward—your path is already responding to your honesty, courage, and care.`;
}

export function generateTarotReading(
  cards: TarotCard[],
  aiReading?: Partial<TarotReading>,
): TarotReading {
  if (aiReading?.sections && aiReading.overall && aiReading.shareText) {
    return aiReading as TarotReading;
  }

  const labels: SpreadLabel[] = ["Past", "Present", "Future"];
  const spread = cards as [TarotCard, TarotCard, TarotCard];
  const sections = spread.map((card, index) => {
    const label = labels[index];

    return {
      label,
      card,
      insight: buildSectionInsight(label, card),
    };
  });

  const overall = buildOverallInterpretation(spread);
  const shareText = [
    "Tarot Reader — Past / Present / Future spread",
    ...sections.map(
      (section) =>
        `${section.label}: ${section.card.name} — ${section.insight}`,
    ),
    `Overall: ${overall}`,
  ].join("\n");

  return {
    sections,
    overall,
    shareText,
  };
}
