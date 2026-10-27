import { CardTheme, Difficulty, DifficultyConfig } from '@/types/game';

// Icon names from lucide-react
export const CARD_THEMES: Record<CardTheme, string[]> = {
  animals: [
    'Cat', 'Dog', 'Bird', 'Fish', 'Bug', 'Rabbit',
    'Turtle', 'Squirrel', 'Snail', 'Rat', 'Egg', 'Drumstick'
  ],
  fruits: [
    'Apple', 'Cherry', 'Grape', 'Banana', 'Citrus', 'Carrot',
    'Salad', 'Bean', 'Nut', 'Wheat', 'Leaf', 'TreePine'
  ],
  emoji: [
    'Heart', 'Star', 'Moon', 'Sun', 'Cloud', 'Flame',
    'Snowflake', 'Zap', 'Sparkles', 'Crown', 'Diamond', 'Gift'
  ],
  tech: [
    'Laptop', 'Smartphone', 'Gamepad2', 'Monitor', 'Keyboard', 'Mouse',
    'Wifi', 'Bluetooth', 'Cpu', 'HardDrive', 'Usb', 'Camera'
  ]
};

export const THEME_LABELS: Record<CardTheme, { en: string; ko: string }> = {
  animals: { en: 'Animals', ko: '동물' },
  fruits: { en: 'Fruits & Plants', ko: '과일 & 식물' },
  emoji: { en: 'Emoji', ko: '이모지' },
  tech: { en: 'Tech', ko: '기술' }
};

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 3, cols: 4, pairs: 6, label: 'Easy', labelKo: '쉬움' },
  medium: { rows: 4, cols: 4, pairs: 8, label: 'Medium', labelKo: '보통' },
  hard: { rows: 6, cols: 4, pairs: 12, label: 'Hard', labelKo: '어려움' }
};

// Theme colors for card backgrounds
export const THEME_COLORS: Record<CardTheme, string> = {
  animals: 'bg-amber-700',
  fruits: 'bg-green-700',
  emoji: 'bg-rose-700',
  tech: 'bg-blue-700'
};

export const ICON_LABELS:Record<string,string> = {
 Cat:'고양이',Dog:'강아지',Bird:'새',Fish:'물고기',Bug:'곤충',Rabbit:'토끼',Turtle:'거북이',Squirrel:'다람쥐',Snail:'달팽이',Rat:'쥐',Egg:'달걀',Drumstick:'닭다리',
 Apple:'사과',Cherry:'체리',Grape:'포도',Banana:'바나나',Citrus:'감귤',Carrot:'당근',Salad:'샐러드',Bean:'콩',Nut:'견과',Wheat:'밀',Leaf:'잎',TreePine:'소나무',
 Heart:'하트',Star:'별',Moon:'달',Sun:'해',Cloud:'구름',Flame:'불꽃',Snowflake:'눈송이',Zap:'번개',Sparkles:'반짝임',Crown:'왕관',Diamond:'다이아몬드',Gift:'선물',
 Laptop:'노트북',Smartphone:'스마트폰',Gamepad2:'게임패드',Monitor:'모니터',Keyboard:'키보드',Mouse:'마우스',Wifi:'와이파이',Bluetooth:'블루투스',Cpu:'중앙처리장치',HardDrive:'저장장치',Usb:'USB',Camera:'카메라'
};
