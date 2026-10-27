import { Timer, RotateCcw, Volume2, VolumeX, Moon, Sun, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/gameUtils';
import { DIFFICULTY_CONFIG, THEME_LABELS } from '@/lib/cardThemes';
import { Difficulty, CardTheme, BestRecord } from '@/types/game';

interface GameHeaderProps {
  time: number;
  moves: number;
  matches: number;
  totalPairs: number;
  difficulty: Difficulty;
  theme: CardTheme;
  isMuted: boolean;
  isDarkMode: boolean;
  bestRecord?: BestRecord;
  onToggleMute: () => void;
  onToggleDarkMode: () => void;
  onRestart: () => void;
}

export function GameHeader({
  time,
  moves,
  matches,
  totalPairs,
  difficulty,
  theme,
  isMuted,
  isDarkMode,
  bestRecord,
  onToggleMute,
  onToggleDarkMode,
  onRestart
}: GameHeaderProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];
  const themeLabel = THEME_LABELS[theme];

  return (
    <header className="w-full max-w-3xl mx-auto mb-4 sm:mb-6">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          카드 짝 맞추기
        </h1>
        <p className="text-sm text-muted-foreground">
          {difficultyConfig.labelKo} · {themeLabel.ko}
        </p>
      </div>

      {/* 게임 정보 */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-3">
        {/* 타이머 */}
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
          <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="font-mono text-lg sm:text-xl font-semibold">
            {formatTime(time)}
          </span>
        </div>

        {/* 시도 횟수 */}
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="font-mono text-lg sm:text-xl font-semibold">
            {moves}
          </span>
          <span className="text-sm text-muted-foreground">회</span>
        </div>

        {/* 진행률 */}
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
          <span className="font-mono text-lg sm:text-xl font-semibold">
            {matches}/{totalPairs}
          </span>
          <span className="text-sm text-muted-foreground">쌍</span>
        </div>
      </div>

      {/* 최고 기록 */}
      {bestRecord && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>
            최고 기록: {formatTime(bestRecord.time)} ({bestRecord.moves}회)
          </span>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMute}
          aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          title={isMuted ? '소리 켜기' : '소리 끄기'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? '밝은 화면' : '어두운 화면'}
          title={isDarkMode ? '라이트 모드' : '다크 모드'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onRestart}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          다시 시작
        </Button>
      </div>
    </header>
  );
}
