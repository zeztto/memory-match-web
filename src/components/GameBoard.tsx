import { useEffect } from 'react';
import { Card } from './Card';
import { CardData, CardTheme, Difficulty } from '@/types/game';
import { cn } from '@/lib/utils';
import { DIFFICULTY_CONFIG } from '@/lib/cardThemes';

interface GameBoardProps {
  cards: CardData[];
  theme: CardTheme;
  difficulty: Difficulty;
  flippedCards: number[];
  onCardClick: (id: number) => void;
  onMatchCheck: () => boolean;
  onResetFlipped: () => void;
  playSound: (type: 'flip' | 'match' | 'fail' | 'victory') => void;
  isGameOver: boolean;
}

export function GameBoard({
  cards,
  theme,
  difficulty,
  flippedCards,
  onCardClick,
  onMatchCheck,
  onResetFlipped,
  playSound,
  isGameOver
}: GameBoardProps) {
  const config = DIFFICULTY_CONFIG[difficulty];

  // Handle card click
  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2) return;
    
    playSound('flip');
    onCardClick(id);
  };

  // Cancel every pending callback when this turn or game is replaced.
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    let resetTimeout: ReturnType<typeof setTimeout> | undefined;
    const checkTimeout = setTimeout(() => {
      const isMatch = onMatchCheck();
      if (isMatch) {
        playSound('match');
        if (cards.filter(c => c.isMatched).length + 2 === cards.length) playSound('victory');
      } else {
        playSound('fail');
        resetTimeout = setTimeout(onResetFlipped, 800);
      }
    }, 500);
    return () => {
      clearTimeout(checkTimeout);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [flippedCards, cards, onMatchCheck, onResetFlipped, playSound]);

  // Grid columns based on difficulty (모든 난이도 4열로 통일 - 모바일 최적화)
  const gridCols = {
    easy: 'grid-cols-4',
    medium: 'grid-cols-4',
    hard: 'grid-cols-4'
  };

  return (
    <div 
      className={cn(
        'grid gap-2 sm:gap-3 md:gap-4 w-full max-w-3xl mx-auto p-2',
        gridCols[difficulty]
      )}
      style={{
        gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`
      }}
    >
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          theme={theme}
          onClick={handleCardClick}
          disabled={
            isGameOver || 
            flippedCards.length >= 2 || 
            card.isMatched ||
            flippedCards.includes(card.id)
          }
        />
      ))}
    </div>
  );
}
