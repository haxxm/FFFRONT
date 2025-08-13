"use client";

import React, { useState } from 'react';
import { 
  User, 
  Calendar as CalendarIcon,
  Share,
  Settings,
  HelpCircle,
  LogOut,
  MessageCircle,
  UserPlus,
  Users
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import CalendarManagementModal from './CalendarManagementModal';
import AIChatModal from './AIChatModal';
import FriendInviteModal from './FriendInviteModal';
import SharedCalendarModal from './SharedCalendarModal';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const [isCalendarManagementOpen, setIsCalendarManagementOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isFriendInviteOpen, setIsFriendInviteOpen] = useState(false);
  const [isSharedCalendarOpen, setIsSharedCalendarOpen] = useState(false);

  const handleLogout = () => {
    // 로그아웃 로직은 상위 컴포넌트에서 처리하도록 이벤트 발생
    const event = new CustomEvent('logout');
    window.dispatchEvent(event);
    onClose();
  };

  const menuItems = [
    {
      icon: User,
      label: '프로필',
      onClick: () => {
        console.log('프로필 클릭');
        onClose();
      }
    },
    {
      icon: MessageCircle,
      label: 'AI CHAT',
      onClick: () => {
        setIsAIChatOpen(true);
        onClose();
      }
    },
    {
      icon: UserPlus,
      label: '친구추가',
      onClick: () => {
        setIsFriendInviteOpen(true);
        onClose();
      }
    },
    {
      icon: Users,
      label: '커뮤니티',
      onClick: () => {
        const event = new CustomEvent('navigate-community');
        window.dispatchEvent(event);
        onClose();
      }
    },
    {
      icon: CalendarIcon,
      label: '캘린더 설정',
      onClick: () => {
        setIsCalendarManagementOpen(true);
        onClose();
      }
    },
    {
      icon: Share,
      label: '캘린더 공유',
      onClick: () => {
        setIsSharedCalendarOpen(true);
        onClose();
      }
    },

    {
      icon: Settings,
      label: '설정',
      onClick: () => {
        console.log('설정 클릭');
        onClose();
      }
    },
    {
      icon: HelpCircle,
      label: '도움말',
      onClick: () => {
        console.log('도움말 클릭');
        onClose();
      }
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-80 bg-black text-white border-gray-800 p-0"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gray-800">
          <VisuallyHidden>
            <SheetTitle>메뉴</SheetTitle>
            <SheetDescription>antogether 캘린더 메뉴 옵션들</SheetDescription>
          </VisuallyHidden>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Main page</div>
              <div className="text-gray-400 text-sm">antogether 캘린더</div>
            </div>
          </div>
        </SheetHeader>

        {/* Menu Items */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800 hover:text-white h-12 px-4"
                  onClick={item.onClick}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <Separator className="my-6 bg-gray-800" />

          {/* Logout */}
          <div className="px-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-gray-800 hover:text-red-400 h-12 px-4"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex justify-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => {
                console.log('캘린더 바로가기 클릭');
                onClose();
              }}
            >
              <CalendarIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => {
                setIsSharedCalendarOpen(true);
                onClose();
              }}
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
      
      {/* Calendar Management Modal */}
      <CalendarManagementModal
        isOpen={isCalendarManagementOpen}
        onClose={() => setIsCalendarManagementOpen(false)}
      />
      
      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
      
      {/* Friend Invite Modal */}
      <FriendInviteModal
        isOpen={isFriendInviteOpen}
        onClose={() => setIsFriendInviteOpen(false)}
      />
      
      {/* Shared Calendar Modal */}
      <SharedCalendarModal
        isOpen={isSharedCalendarOpen}
        onClose={() => setIsSharedCalendarOpen(false)}
      />
    </Sheet>
  );
};

export default MenuModal;