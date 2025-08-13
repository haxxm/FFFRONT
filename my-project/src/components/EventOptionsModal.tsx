"use client";

import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Moon, 
  Bell, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  FileText, 
  Paperclip 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';

interface EventOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
}

const EventOptionsModal: React.FC<EventOptionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onOptionSelect 
}) => {
  const menuItems = [
    {
      id: 'repeat',
      icon: RotateCcw,
      label: '반복',
      description: '일정 반복 설정'
    },
    {
      id: 'lunar-repeat',
      icon: Moon,
      label: '음력 반복',
      description: '음력 기준 반복 설정'
    },
    {
      id: 'reminder',
      icon: Bell,
      label: '알림',
      description: '알림 시간 설정'
    },
    {
      id: 'dday',
      icon: CalendarIcon,
      label: '디데이',
      description: 'D-Day 설정'
    },
    {
      id: 'location',
      icon: MapPin,
      label: '위치',
      description: '장소 추가'
    },
    {
      id: 'attendees',
      icon: Users,
      label: '참석자',
      description: '참석자 초대'
    },
    {
      id: 'notes',
      icon: FileText,
      label: '노트',
      description: '상세 메모 추가'
    },
    {
      id: 'attachments',
      icon: Paperclip,
      label: '파일 첨부',
      description: '파일 첨부'
    }
  ];

  const handleOptionClick = (optionId: string) => {
    onOptionSelect(optionId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 bg-black border-gray-800" aria-describedby="event-options-modal-description">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>고급 설정 옵션</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription id="event-options-modal-description">일정의 고급 설정 옵션을 선택하세요.</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="w-6 h-6" /> {/* Spacer */}
          <div className="w-8 h-1 bg-gray-600 rounded-full" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-6 h-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleOptionClick(item.id)}
                  className="w-full flex items-center gap-4 p-3 text-left text-white hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventOptionsModal;