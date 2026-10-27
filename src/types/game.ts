export type Difficulty = 'easy' | 'medium' | 'hard';

export type CardTheme = 'animals' | 'fruits' | 'emoji' | 'tech';

export interface CardData {
  id: number;
  pairId: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  gameId: number;
  pendingMismatch: boolean;
  cards: CardData[];
  flippedCards: number[];
  moves: number;
  matches: number;
  totalPairs: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  difficulty: Difficulty;
  theme: CardTheme;
}

export interface BestRecord {
  time: number;
  moves: number;
  date: string;
}

export type BestRecords = {
  [key in Difficulty]?: BestRecord;
};

export interface DifficultyConfig {
  rows: number;
  cols: number;
  pairs: number;
  label: string;
  labelKo: string;
}

export type GameAction =
  | { type: 'FLIP_CARD'; cardId: number }
  | { type: 'CHECK_MATCH'; gameId: number }
  | { type: 'RESET_FLIPPED'; gameId: number }
  | { type: 'NEW_GAME'; difficulty: Difficulty; theme: CardTheme }
  | { type: 'GAME_OVER' }
  | { type: 'START_GAME' };
