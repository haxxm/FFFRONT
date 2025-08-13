"use client";

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, QrCode, Copy, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { useCalendar } from '../contexts/CalendarContext';
import { toast } from 'sonner@2.0.3';

interface FriendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
}

const FriendInviteModal: React.FC<FriendInviteModalProps> = ({ isOpen, onClose }) => {
  const { state } = useCalendar();
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  // CalendarContext에서 실제 사용자가 생성한 캘린더들 가져오기
  const calendars = state.calendars.map(calendar => ({
    id: calendar.id,
    name: calendar.name,
    color: calendar.color,
    isVisible: calendar.isVisible
  }));

  const handleCalendarSelect = (calendar: Calendar) => {
    setSelectedCalendar(calendar);
    setShowQRCode(true);
  };

  const handleBack = () => {
    setShowQRCode(false);
    setSelectedCalendar(null);
  };

  const generateQRCodeData = (calendar: Calendar) => {
    // 실제로는 서버에서 생성된 초대 링크를 사용해야 함
    const inviteData = {
      type: 'calendar_invite',
      calendarId: calendar.id,
      calendarName: calendar.name,
      inviteCode: `${calendar.id}_${Date.now()}`,
      expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7일 후 만료
    };
    return JSON.stringify(inviteData);
  };

  const copyInviteLink = () => {
    if (selectedCalendar) {
      const inviteData = generateQRCodeData(selectedCalendar);
      const inviteLink = `https://anttogether.app/invite?data=${encodeURIComponent(inviteData)}`;
      navigator.clipboard.writeText(inviteLink);
      toast.success('초대 링크가 복사되었습니다');
    }
  };

  const shareInvite = () => {
    if (selectedCalendar) {
      const inviteData = generateQRCodeData(selectedCalendar);
      const inviteLink = `https://anttogether.app/invite?data=${encodeURIComponent(inviteData)}`;
      
      if (navigator.share) {
        navigator.share({
          title: `${selectedCalendar.name} 캘린더 초대`,
          text: `${selectedCalendar.name} 캘린더에 초대합니다!`,
          url: inviteLink,
        });
      } else {
        copyInviteLink();
      }
    }
  };

  // 간단한 QR코드 SVG 생성 (실제로는 qrcode 라이브러리 사용 권장)
  const SimpleQRCode = ({ data, size = 200 }: { data: string; size?: number }) => {
    // 실제 QR코드 대신 시각적 플레이스홀더
    const gridSize = 21; // 표준 QR코드 그리드 크기
    const cellSize = size / gridSize;
    
    return (
      <div 
        className="bg-white p-4 rounded-lg shadow-lg"
        style={{ width: size + 32, height: size + 32 }}
      >
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            
            // QR코드 패턴 시뮬레이션 (실제로는 라이브러리 사용)
            const isBlack = (
              // 좌상단 모서리 패턴
              (row < 7 && col < 7 && ((row < 2 || row > 4) || (col < 2 || col > 4))) ||
              // 우상단 모서리 패턴  
              (row < 7 && col > 13 && ((row < 2 || row > 4) || (col > 17 || col < 16))) ||
              // 좌하단 모서리 패턴
              (row > 13 && col < 7 && ((row > 17 || row < 16) || (col < 2 || col > 4))) ||
              // 랜덤 데이터 패턴
              (row > 8 && col > 8 && (row + col + data.length) % 3 === 0)
            );
            
            return (
              <div
                key={index}
                className={isBlack ? 'bg-black' : 'bg-white'}
                style={{ width: cellSize, height: cellSize }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto bg-white text-black" aria-describedby="friend-invite-modal-description">
        <VisuallyHidden>
          <DialogTitle>친구 초대</DialogTitle>
        </VisuallyHidden>
        <DialogDescription id="friend-invite-modal-description" className="sr-only">
          캘린더를 선택하고 친구를 초대할 수 있는 QR코드를 생성합니다.
        </DialogDescription>

        {!showQRCode ? (
          // 캘린더 선택 화면
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">캘린더 선택</h2>

            </div>

            <p className="text-gray-600 mb-6">
              친구를 초대할 캘린더를 선택해주세요
            </p>

            {calendars.length > 0 ? (
              <div className="space-y-3">
                {calendars.map((calendar) => (
                  <Button
                    key={calendar.id}
                    variant="outline"
                    className="w-full justify-between p-4 h-auto hover:bg-gray-50 border-2 hover:border-gray-300"
                    onClick={() => handleCalendarSelect(calendar)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: calendar.color }}
                      />
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-left">{calendar.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-sm">공유하기</span>
                      <Share2 className="w-4 h-4" />
                    </div>
                  </Button>
                ))}
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        캘린더 공유 팁
                      </p>
                      <p className="text-xs text-blue-600">
                        선택한 캘린더의 일정을 친구와 실시간으로 공유할 수 있어요. 
                        친구가 초대를 수락하면 함께 일정을 관리할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">아직 생성된 캘린더가 없습니다</p>
                <p className="text-sm text-gray-400 mb-4">
                  먼저 캘린더를 생성한 후 친구를 초대해보세요
                </p>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  캘린더 생성하러 가기
                </Button>
              </div>
            )}
          </div>
        ) : (
          // QR코드 표시 화면
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600"
              >
                ← 뒤로
              </Button>
              <h2 className="text-xl font-semibold">친구 초대</h2>
              <div className="h-8 w-8"></div>
            </div>

            {selectedCalendar && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: selectedCalendar.color }}
                    />
                    <div className="text-left">
                      <span className="font-semibold text-gray-800 block">
                        {selectedCalendar.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        캘린더 공유 초대
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  QR코드를 스캔하거나 링크를 공유하여<br />
                  친구를 캘린더에 초대하세요
                </p>

                <div className="flex justify-center mb-6">
                  <SimpleQRCode data={generateQRCodeData(selectedCalendar)} />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-12"
                  >
                    <Copy className="w-4 h-4" />
                    초대 링크 복사
                  </Button>
                  
                  <Button
                    onClick={shareInvite}
                    className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 h-12"
                  >
                    <Share2 className="w-4 h-4" />
                    공유하기
                  </Button>
                </div>

                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    🕒 초대 코드는 7일 후 자동으로 만료됩니다
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendInviteModal;