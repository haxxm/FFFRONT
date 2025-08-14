import React, { useState } from 'react';
import { Share2, Copy, Link, Eye, Clock, Users, Check, QrCode, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface SharedCalendar {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  category: string;
  color: string;
}

interface CalendarSharingModalProps {
  calendar: SharedCalendar;
  isOpen: boolean;
  onClose: () => void;
}

const CalendarSharingModal: React.FC<CalendarSharingModalProps> = ({
  calendar,
  isOpen,
  onClose
}) => {
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowEdit: false,
    expiresIn: '7days',
    requireApproval: true
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareLink] = useState(`https://antogether.app/shared/${calendar.id}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopiedLink(true);
      toast.success('링크가 복사되었습니다!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`[AnTogether] ${calendar.name} 캘린더 초대`);
    const body = encodeURIComponent(
      `안녕하세요!\n\n"${calendar.name}" 공유 캘린더에 초대합니다.\n\n링크: ${shareLink}\n\n함께 일정을 관리해보세요!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const generateQRCode = () => {
    // QR 코드 생성 로직 (실제 구현 시 qrcode 라이브러리 사용)
    toast.info('QR 코드 기능은 곧 제공될 예정입니다.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: calendar.color + '20', color: calendar.color }}
            >
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-medium">캘린더 공유</h2>
              <p className="text-sm text-gray-400">{calendar.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* 캘린더 정보 */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">{calendar.name}</h3>
            <p className="text-gray-300 text-sm mb-3">{calendar.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{calendar.members}/{calendar.maxMembers}명</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                {calendar.category}
              </Badge>
            </div>
          </div>

          {/* 공유 링크 */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              공유 링크
            </h4>
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1 bg-gray-800 border-gray-600 text-gray-300"
              />
              <Button
                onClick={handleCopyLink}
                className={`${
                  copiedLink 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* 공유 설정 */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">공유 설정</h4>
            
            {/* 공개 설정 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">공개 캘린더</p>
                <p className="text-xs text-gray-400">누구나 링크로 접근 가능</p>
              </div>
              <Switch
                checked={shareSettings.isPublic}
                onCheckedChange={(checked: boolean) => 
                  setShareSettings(prev => ({ ...prev, isPublic: checked }))
                }
              />
            </div>

            {/* 편집 권한 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">편집 권한 허용</p>
                <p className="text-xs text-gray-400">다른 사용자가 일정을 추가/수정</p>
              </div>
              <Switch
                checked={shareSettings.allowEdit}
                onCheckedChange={(checked: boolean) => 
                  setShareSettings(prev => ({ ...prev, allowEdit: checked }))
                }
              />
            </div>

            {/* 승인 필요 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">가입 승인 필요</p>
                <p className="text-xs text-gray-400">새 멤버 가입 시 승인 요청</p>
              </div>
              <Switch
                checked={shareSettings.requireApproval}
                onCheckedChange={(checked: boolean) => 
                  setShareSettings(prev => ({ ...prev, requireApproval: checked }))
                }
              />
            </div>

            {/* 만료 설정 */}
            <div>
              <p className="text-white text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                링크 만료
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['7days', '30days', 'never'].map((option) => (
                  <Button
                    key={option}
                    variant={shareSettings.expiresIn === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShareSettings(prev => ({ ...prev, expiresIn: option }))}
                    className={`${
                      shareSettings.expiresIn === option
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {option === '7days' && '7일'}
                    {option === '30days' && '30일'}
                    {option === 'never' && '무제한'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* 공유 방법 */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">공유 방법</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareViaEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 flex flex-col items-center justify-center gap-1"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs">이메일</span>
              </Button>
              <Button
                onClick={generateQRCode}
                className="bg-green-600 hover:bg-green-700 text-white h-12 flex flex-col items-center justify-center gap-1"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs">QR 코드</span>
              </Button>
            </div>
          </div>

          {/* 권한 안내 */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">현재 권한</span>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <p>• {shareSettings.isPublic ? '공개' : '비공개'} 캘린더</p>
              <p>• {shareSettings.allowEdit ? '편집 가능' : '읽기 전용'}</p>
              <p>• {shareSettings.requireApproval ? '승인 필요' : '자유 가입'}</p>
              <p>• 만료: {
                shareSettings.expiresIn === 'never' 
                  ? '무제한' 
                  : shareSettings.expiresIn === '7days' 
                    ? '7일 후' 
                    : '30일 후'
              }</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                toast.success('공유 설정이 저장되었습니다!');
                onClose();
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalendarSharingModal;