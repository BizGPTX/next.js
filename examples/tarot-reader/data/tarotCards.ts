export type ArcanaType = "Major" | "Minor";

export type TarotCard = {
  name: string;
  arcana: ArcanaType;
  suit: "Wands" | "Cups" | "Swords" | "Pentacles" | null;
  uprightMeaning: string;
};

const majorArcana: TarotCard[] = [
  {
    name: "The Fool",
    arcana: "Major",
    suit: null,
    uprightMeaning: "fresh starts, trust, and fearless curiosity",
  },
  {
    name: "The Magician",
    arcana: "Major",
    suit: null,
    uprightMeaning: "manifestation, skill, and focused intention",
  },
  {
    name: "The High Priestess",
    arcana: "Major",
    suit: null,
    uprightMeaning: "intuition, mystery, and inner wisdom",
  },
  {
    name: "The Empress",
    arcana: "Major",
    suit: null,
    uprightMeaning: "nurturing abundance, beauty, and creative growth",
  },
  {
    name: "The Emperor",
    arcana: "Major",
    suit: null,
    uprightMeaning: "structure, leadership, and grounded stability",
  },
  {
    name: "The Hierophant",
    arcana: "Major",
    suit: null,
    uprightMeaning: "tradition, guidance, and spiritual learning",
  },
  {
    name: "The Lovers",
    arcana: "Major",
    suit: null,
    uprightMeaning: "alignment, heartfelt choices, and connection",
  },
  {
    name: "The Chariot",
    arcana: "Major",
    suit: null,
    uprightMeaning: "determination, momentum, and disciplined victory",
  },
  {
    name: "Strength",
    arcana: "Major",
    suit: null,
    uprightMeaning: "compassionate courage, patience, and resilience",
  },
  {
    name: "The Hermit",
    arcana: "Major",
    suit: null,
    uprightMeaning: "reflection, solitude, and soul-deep guidance",
  },
  {
    name: "Wheel of Fortune",
    arcana: "Major",
    suit: null,
    uprightMeaning: "turning points, destiny, and changing cycles",
  },
  {
    name: "Justice",
    arcana: "Major",
    suit: null,
    uprightMeaning: "truth, accountability, and balanced decisions",
  },
  {
    name: "The Hanged Man",
    arcana: "Major",
    suit: null,
    uprightMeaning: "surrender, pause, and a new perspective",
  },
  {
    name: "Death",
    arcana: "Major",
    suit: null,
    uprightMeaning: "transformation, release, and meaningful renewal",
  },
  {
    name: "Temperance",
    arcana: "Major",
    suit: null,
    uprightMeaning: "healing balance, moderation, and harmony",
  },
  {
    name: "The Devil",
    arcana: "Major",
    suit: null,
    uprightMeaning: "shadow work, attachment, and reclaiming power",
  },
  {
    name: "The Tower",
    arcana: "Major",
    suit: null,
    uprightMeaning: "sudden revelation, upheaval, and liberation",
  },
  {
    name: "The Star",
    arcana: "Major",
    suit: null,
    uprightMeaning: "hope, renewal, and gentle spiritual clarity",
  },
  {
    name: "The Moon",
    arcana: "Major",
    suit: null,
    uprightMeaning: "dreams, uncertainty, and intuitive navigation",
  },
  {
    name: "The Sun",
    arcana: "Major",
    suit: null,
    uprightMeaning: "joy, vitality, and radiant success",
  },
  {
    name: "Judgement",
    arcana: "Major",
    suit: null,
    uprightMeaning: "awakening, reckoning, and answering your calling",
  },
  {
    name: "The World",
    arcana: "Major",
    suit: null,
    uprightMeaning: "completion, fulfillment, and wholeness",
  },
];

const suitThemes = {
  Wands: "creative fire, momentum, and inspired action",
  Cups: "emotion, intuition, and heartfelt connection",
  Swords: "clarity, communication, and mental truth",
  Pentacles: "security, resources, and grounded growth",
} as const;

const rankMeanings = {
  Ace: "a new beginning filled with",
  Two: "a meaningful choice guided by",
  Three: "expansion and collaboration through",
  Four: "stability and rest shaped by",
  Five: "challenge that asks for growth through",
  Six: "support, harmony, and movement with",
  Seven: "reflection and strategy surrounding",
  Eight: "dedication, movement, and progress through",
  Nine: "culmination, resilience, and nearing completion in",
  Ten: "completion, consequence, and fullness within",
  Page: "curious learning and a fresh message about",
  Knight: "purposeful pursuit and momentum around",
  Queen: "mature mastery and compassionate command of",
  King: "confident leadership and wise stewardship of",
} as const;

const minorArcanaRanks = Object.keys(rankMeanings) as Array<
  keyof typeof rankMeanings
>;
const minorArcanaSuits = Object.keys(suitThemes) as Array<
  keyof typeof suitThemes
>;

const buildMinorArcana = (): TarotCard[] =>
  minorArcanaSuits.flatMap((suit) =>
    minorArcanaRanks.map((rank) => ({
      name: `${rank} of ${suit}`,
      arcana: "Minor" as const,
      suit,
      uprightMeaning: `${rankMeanings[rank]} ${suitThemes[suit]}`,
    })),
  );

export const tarotDeck: TarotCard[] = [...majorArcana, ...buildMinorArcana()];
