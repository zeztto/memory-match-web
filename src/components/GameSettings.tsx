import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DIFFICULTY_CONFIG, THEME_LABELS } from '@/lib/cardThemes';
import { Difficulty, CardTheme } from '@/types/game';

interface GameSettingsProps {
  difficulty: Difficulty;
  theme: CardTheme;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onThemeChange: (theme: CardTheme) => void;
}

export function GameSettings({
  difficulty,
  theme,
  onDifficultyChange,
  onThemeChange
}: GameSettingsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-4 sm:mb-6">
      {/* 난이도 선택 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          난이도:
        </label>
        <Select
          value={difficulty}
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
        >
          <SelectTrigger aria-label="난이도 선택" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
              <SelectItem key={diff} value={diff}>
                {DIFFICULTY_CONFIG[diff].labelKo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 테마 선택 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          테마:
        </label>
        <Select
          value={theme}
          onValueChange={(value) => onThemeChange(value as CardTheme)}
        >
          <SelectTrigger aria-label="카드 테마 선택" className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(THEME_LABELS) as CardTheme[]).map((t) => (
              <SelectItem key={t} value={t}>
                {THEME_LABELS[t].ko}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
