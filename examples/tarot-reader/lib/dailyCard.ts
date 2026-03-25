import { tarotDeck, type TarotCard } from "@/data/tarotCards";

export function getDailyCard(date = new Date()): TarotCard {
  const seed = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return tarotDeck[hash % tarotDeck.length];
}
