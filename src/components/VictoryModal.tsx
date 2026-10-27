import { Trophy, Clock, RotateCcw, Share2 } from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/gameUtils';
import { DIFFICULTY_CONFIG } from '@/lib/cardThemes';
import { Difficulty } from '@/types/game';

interface VictoryModalProps {
  isOpen:boolean;time:number;moves:number;difficulty:Difficulty;isNewRecord:boolean;
  onPlayAgain:()=>void;onShare:()=>void;onClose:()=>void;shareStatus:string;
}
export function VictoryModal({isOpen,time,moves,difficulty,isNewRecord,onPlayAgain,onShare,onClose,shareStatus}:VictoryModalProps) {
  const config=DIFFICULTY_CONFIG[difficulty];
  return (
    <Dialog open={isOpen} onOpenChange={open=>{if(!open)onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4"><Trophy className="w-16 h-16 text-primary" /></div>
          <DialogTitle className="text-2xl font-bold">{isNewRecord?'새로운 최고 기록':'모든 짝을 찾았습니다'}</DialogTitle>
          <DialogDescription className="text-base">{config.labelKo} 난이도를 완료했습니다.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="text-center p-4 bg-secondary/50 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-mono">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">소요 시간</div>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-lg">
            <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-mono">{moves}</div>
            <div className="text-sm text-muted-foreground">시도 횟수</div>
          </div>
        </div>
        {shareStatus && <p role="status" className="text-center text-sm">{shareStatus}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" onClick={onShare}><Share2 className="w-4 h-4 mr-2" />게임 공유하기</Button>
          <Button className="flex-1" onClick={onPlayAgain}><RotateCcw className="w-4 h-4 mr-2" />다시 하기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
