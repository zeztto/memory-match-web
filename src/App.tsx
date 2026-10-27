import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { GameBoard } from '@/components/GameBoard';
import { GameHeader } from '@/components/GameHeader';
import { GameSettings } from '@/components/GameSettings';
import { VictoryModal } from '@/components/VictoryModal';
import { ShareButton } from '@/components/ShareButton';
import { useGameState } from '@/hooks/useGameState';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Difficulty, CardTheme } from '@/types/game';
import {shareGame} from '@/lib/share';

function GameContent() {
  const { setTheme, isDarkMode } = useTheme();
  const { state, startNewGame, flipCard, checkMatch, resetFlipped } = useGameState();
  const { time, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();
  const { playSound, isMuted, toggleMute } = useSound();
  const { getBestRecord, saveBestRecord, storageAvailable } = useLocalStorage();

  const [shareStatus, setShareStatus] = useState('');
  const [showVictory, setShowVictory] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Get current best record
  const bestRecord = getBestRecord(state.difficulty);

  // Start timer when game starts
  useEffect(() => {
    if (state.isGameStarted && !state.isGameOver) {
      startTimer();
    }
  }, [state.isGameStarted, state.isGameOver, startTimer]);

  const completedGame = useRef<number | null>(null);
  useEffect(() => {
    if (!state.isGameOver) return;
    stopTimer();
    const timer = setTimeout(() => setShowVictory(true), 500);
    return () => clearTimeout(timer);
  }, [state.isGameOver, state.gameId, stopTimer]);

  useEffect(() => {
    if (!state.isGameOver || completedGame.current === state.gameId) return;
    completedGame.current = state.gameId;
    setIsNewRecord(saveBestRecord(state.difficulty, time, state.moves));
  }, [state.isGameOver, state.gameId, state.difficulty, time, state.moves, saveBestRecord]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    resetTimer();
    setShowVictory(false);
    startNewGame(difficulty, state.theme);
  }, [resetTimer, startNewGame, state.theme]);

  // Handle theme change
  const handleThemeChange = useCallback((theme: CardTheme) => {
    resetTimer();
    setShowVictory(false);
    startNewGame(state.difficulty, theme);
  }, [resetTimer, startNewGame, state.difficulty]);

  // Handle restart
  const handleRestart = useCallback(() => {
    resetTimer();
    setShowVictory(false);
    startNewGame(state.difficulty, state.theme);
  }, [resetTimer, startNewGame, state.difficulty, state.theme]);

  // Handle dark mode toggle
  const handleToggleDarkMode = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  // Handle share
  const handleShare = useCallback(async () => {
    const shareData = {
      title: '카드 퍼즐 - 기억력 게임',
      text: `🃏 카드 퍼즐 게임을 플레이했어요! 재미있는 카드 짝 맞추기 게임에 도전해보세요!`,
      url: window.location.href
    };

    setShareStatus(await shareGame(shareData));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <GameHeader
          time={time}
          moves={state.moves}
          matches={state.matches}
          totalPairs={state.totalPairs}
          difficulty={state.difficulty}
          theme={state.theme}
          isMuted={isMuted}
          isDarkMode={isDarkMode}
          bestRecord={bestRecord}
          onToggleMute={toggleMute}
          onToggleDarkMode={handleToggleDarkMode}
          onRestart={handleRestart}
        />

        {!storageAvailable && <p role="status" className="text-center text-sm mb-4">기록을 브라우저에 저장하지 못했습니다. 현재 세션에서만 유지됩니다.</p>}

        <GameSettings
          difficulty={state.difficulty}
          theme={state.theme}
          onDifficultyChange={handleDifficultyChange}
          onThemeChange={handleThemeChange}
        />

        <GameBoard
          cards={state.cards}
          theme={state.theme}
          difficulty={state.difficulty}
          flippedCards={state.flippedCards}
          onCardClick={flipCard}
          onMatchCheck={checkMatch}
          onResetFlipped={resetFlipped}
          playSound={playSound}
          isGameOver={state.isGameOver}
        />

        {/* Share Button - Fixed at bottom on mobile */}
        <div className="flex justify-center mt-6">
          <ShareButton />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>같은 그림을 찾아 모든 카드의 짝을 맞춰 보세요.</p>
      </footer>

      {!showVictory && shareStatus && <p role="status" className="text-center p-2">{shareStatus}</p>}

      {/* Victory Modal */}
      <VictoryModal
        isOpen={showVictory}
        time={time}
        moves={state.moves}
        difficulty={state.difficulty}
        isNewRecord={isNewRecord}
        onPlayAgain={handleRestart}
        onShare={handleShare}
        shareStatus={shareStatus}
        onClose={() => setShowVictory(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <GameContent />
    </ThemeProvider>
  );
}

export default App;
