import { useReducer, useCallback, useEffect } from 'react';
import { GameState, GameAction, Difficulty, CardTheme } from '@/types/game';
import { generateCards, checkCardsMatch } from '@/lib/gameUtils';
import { DIFFICULTY_CONFIG } from '@/lib/cardThemes';

const initialState: GameState = {
  gameId: 0,
  pendingMismatch: false,
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
  totalPairs: 0,
  isGameOver: false,
  isGameStarted: false,
  difficulty: 'medium',
  theme: 'emoji'
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const config = DIFFICULTY_CONFIG[action.difficulty];
      const cards = generateCards(action.difficulty, action.theme);
      return {
        ...initialState,
        gameId: state.gameId + 1,
        cards,
        difficulty: action.difficulty,
        theme: action.theme,
        totalPairs: config.pairs,
        isGameStarted: false
      };
    }

    case 'START_GAME': {
      return {
        ...state,
        isGameStarted: true
      };
    }

    case 'FLIP_CARD': {
      // Don't flip if already 2 cards flipped or card is already flipped/matched
      if (state.flippedCards.length >= 2) return state;
      
      const card = state.cards.find(c => c.id === action.cardId);
      if (!card || card.isFlipped || card.isMatched) return state;

      const newCards = state.cards.map(c =>
        c.id === action.cardId ? { ...c, isFlipped: true } : c
      );

      const newFlippedCards = [...state.flippedCards, action.cardId];

      return {
        ...state,
        cards: newCards,
        flippedCards: newFlippedCards,
        isGameStarted: true
      };
    }

    case 'CHECK_MATCH': {
      if (action.gameId !== state.gameId || state.pendingMismatch || state.flippedCards.length !== 2) return state;

      const isMatch = checkCardsMatch(state.cards, state.flippedCards);

      if (isMatch) {
        const newCards = state.cards.map(c =>
          state.flippedCards.includes(c.id) ? { ...c, isMatched: true } : c
        );
        const newMatches = state.matches + 1;
        const isGameOver = newMatches === state.totalPairs;

        return {
          ...state,
          cards: newCards,
          flippedCards: [],
          matches: newMatches,
          moves: state.moves + 1,
          isGameOver
        };
      }

      return {
        ...state,
        moves: state.moves + 1,
        pendingMismatch: true
      };
    }

    case 'RESET_FLIPPED': {
      if (action.gameId !== state.gameId) return state;
      const newCards = state.cards.map(c =>
        state.flippedCards.includes(c.id) && !c.isMatched
          ? { ...c, isFlipped: false }
          : c
      );

      return {
        ...state,
        cards: newCards,
        flippedCards: [],
        pendingMismatch: false
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        isGameOver: true
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Start a new game
  const startNewGame = useCallback((difficulty: Difficulty, theme: CardTheme) => {
    dispatch({ type: 'NEW_GAME', difficulty, theme });
  }, []);

  // Flip a card
  const flipCard = useCallback((cardId: number) => {
    dispatch({ type: 'FLIP_CARD', cardId });
  }, []);

  // Check if flipped cards match (called after 2 cards are flipped)
  const checkMatch = useCallback((): boolean => {
    if (state.flippedCards.length !== 2) return false;
    
    const isMatch = checkCardsMatch(state.cards, state.flippedCards);
    dispatch({ type: 'CHECK_MATCH', gameId: state.gameId });
    
    return isMatch;
  }, [state.cards, state.flippedCards, state.gameId]);

  // Reset flipped cards (after failed match)
  const resetFlipped = useCallback(() => {
    dispatch({ type: 'RESET_FLIPPED', gameId: state.gameId });
  }, [state.gameId]);

  // Initialize game on mount
  useEffect(() => {
    startNewGame(initialState.difficulty, initialState.theme);
  }, [startNewGame]);

  return {
    state,
    startNewGame,
    flipCard,
    checkMatch,
    resetFlipped
  };
}
