import { tarotDeck, type TarotCard } from "@/data/tarotCards";

// Fisher-Yates keeps the draw fair while also guaranteeing unique selections.
export function drawUniqueCards(count: number): TarotCard[] {
  const deck = [...tarotDeck];

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }

  return deck.slice(0, count);
}
