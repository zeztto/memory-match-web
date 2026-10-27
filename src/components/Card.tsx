import { memo } from 'react';
import {Cat, Dog, Bird, Fish, Bug, Rabbit, Turtle, Squirrel, Snail, Rat, Egg, Drumstick, Apple, Cherry, Grape, Banana, Citrus, Carrot, Salad, Bean, Nut, Wheat, Leaf, TreePine, Heart, Star, Moon, Sun, Cloud, Flame, Snowflake, Zap, Sparkles, Crown, Diamond, Gift, Laptop, Smartphone, Gamepad2, Monitor, Keyboard, Mouse, Wifi, Bluetooth, Cpu, HardDrive, Usb, Camera, type LucideIcon} from 'lucide-react';
import { CardData, CardTheme } from '@/types/game';
import { cn } from '@/lib/utils';
import { THEME_COLORS, ICON_LABELS } from '@/lib/cardThemes';

interface CardProps {
  card: CardData;
  theme: CardTheme;
  onClick: (id: number) => void;
  disabled: boolean;
}

const icons:Record<string,LucideIcon> = {Cat, Dog, Bird, Fish, Bug, Rabbit, Turtle, Squirrel, Snail, Rat, Egg, Drumstick, Apple, Cherry, Grape, Banana, Citrus, Carrot, Salad, Bean, Nut, Wheat, Leaf, TreePine, Heart, Star, Moon, Sun, Cloud, Flame, Snowflake, Zap, Sparkles, Crown, Diamond, Gift, Laptop, Smartphone, Gamepad2, Monitor, Keyboard, Mouse, Wifi, Bluetooth, Cpu, HardDrive, Usb, Camera};
function getIconComponent(name:string):LucideIcon|null {return icons[name] || null;}

export const Card = memo(function Card({ card, theme, onClick, disabled }: CardProps) {
  const { id, iconName, isFlipped, isMatched } = card;
  const Icon = getIconComponent(iconName);
  const colors = THEME_COLORS[theme];

  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <button
      type="button"
      data-card-id={id}
      aria-label={`${id + 1}번 카드, ${isMatched ? `짝 맞춤, ${ICON_LABELS[iconName]}` : isFlipped ? `앞면, ${ICON_LABELS[iconName]}` : '뒷면'}`}
      aria-pressed={isFlipped || isMatched}
      disabled={disabled}
      className={cn(
        'card-container block w-full aspect-square cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        disabled && 'disabled pointer-events-none',
        isMatched && 'card-matched'
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'card-inner w-full h-full',
          (isFlipped || isMatched) && 'flipped'
        )}
      >
        {/* Card Back (visible when not flipped) */}
        <div 
          className={cn(
            'card-face card-back',
            colors
          )}
        >
          <div className="text-white/30 text-4xl font-bold">?</div>
        </div>

        {/* Card Front (visible when flipped) */}
        <div 
          className={cn(
            'card-face card-front bg-card border-2',
            isMatched ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border'
          )}
        >
          {Icon && (
            <Icon 
              className={cn(
                'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
                isMatched ? 'text-green-600 dark:text-green-400' : 'text-foreground'
              )} 
            />
          )}
        </div>
      </div>
    </button>
  );
});
