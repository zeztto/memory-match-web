import { useState, useEffect } from 'react';
import {copyShareText,shareGame} from '@/lib/share';
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [status,setStatus] = useState('');
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const shareData = {
    title: '카드 퍼즐 - 기억력 게임',
    text: '🃏 재미있는 카드 짝 맞추기 게임! 당신의 기억력에 도전해보세요!',
    url: window.location.href
  };

  const handleNativeShare = async () => setStatus(await shareGame(shareData));

  const handleCopyLink = async () => {
    setCopied(false);
    const result = await copyShareText(shareData.url);
    setCopied(result.ok);
    setStatus(result.message);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
    window.open(url, '_blank', 'width=550,height=420,noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    window.open(url, '_blank', 'width=550,height=420,noopener,noreferrer');
  };

  const handleKakaoShare = async () => {
    setCopied(false);
    const result = await copyShareText(`${shareData.text}\n${shareData.url}`);
    setCopied(result.ok);
    setStatus(result.message);
  };

  // 네이티브 공유 지원 여부
  const supportsNativeShare = typeof navigator.share === 'function';

  return (
    <div className="text-center space-y-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportsNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            공유...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? '복사됨!' : '링크 복사'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="w-4 h-4 mr-2" />
          트위터
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="w-4 h-4 mr-2" />
          페이스북
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleKakaoShare}>
          <MessageCircle className="w-4 h-4 mr-2" />
          공유 문구 복사
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {status && <p role="status" className="text-sm">{status}</p>}
    </div>
  );
}
