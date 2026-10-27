import { CardData, CardTheme, Difficulty } from '@/types/game';
import { CARD_THEMES, DIFFICULTY_CONFIG } from './cardThemes';

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate cards for a new game
export function generateCards(difficulty: Difficulty, theme: CardTheme): CardData[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const themeIcons = CARD_THEMES[theme];
  
  // Get the required number of unique icons
  const selectedIcons = shuffleArray(themeIcons).slice(0, config.pairs);
  
  // Create pairs
  const cards: CardData[] = [];
  let id = 0;
  
  selectedIcons.forEach((iconName, pairId) => {
    // Create two cards for each pair
    cards.push({
      id: id++,
      pairId,
      iconName,
      isFlipped: false,
      isMatched: false
    });
    cards.push({
      id: id++,
      pairId,
      iconName,
      isFlipped: false,
      isMatched: false
    });
  });
  
  return shuffleArray(cards);
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Check if two cards match
export function checkCardsMatch(cards: CardData[], cardIds: number[]): boolean {
  if (cardIds.length !== 2) return false;
  
  const [card1, card2] = cardIds.map(id => cards.find(c => c.id === id));
  
  if (!card1 || !card2) return false;
  
  return card1.pairId === card2.pairId;
}

// Get grid class based on difficulty
export function getGridClass(difficulty: Difficulty): string {
  const config = DIFFICULTY_CONFIG[difficulty];
  return `grid-cols-${config.cols}`;
}
