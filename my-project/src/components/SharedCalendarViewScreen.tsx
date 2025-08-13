"use client";

import React, { useState } from 'react';
import { User, Calendar as CalendarIcon, Menu, Users, Hash, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { IndependentCalendarProvider } from './IndependentCalendarProvider';
import IndependentCalendarCore from './IndependentCalendarCore';
import IndependentBottomPanel from './IndependentBottomPanel';
import MenuModal from './MenuModal';
import { Badge } from './ui/badge';

interface SharedCalendarViewScreenProps {
  calendar: {
    id: string;
    name: string;
    color: string;
    description?: string;
    isVisible: boolean;
    isDefault: boolean;
    createdAt: Date;
    code: string;
    members: number;
  };
}

const SharedCalendarViewScreen: React.FC<SharedCalendarViewScreenProps> = ({ 
  calendar 
}) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const handleBackToCalendar = () => {
    // 메인 캘린더 화면으로 돌아가는 이벤트 발생 (App.tsx에서 처리)
    const backEvent = new CustomEvent('navigate-back-to-calendar');
    window.dispatchEvent(backEvent);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IndependentCalendarProvider 
        sourceCalendar={calendar} 
        instanceId={`shared-calendar-view-${calendar.id}-${Date.now()}`}
      >
        {/* Header */}
        <div className="bg-background">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 py-2 text-sm text-foreground">
            <span>3:50</span>
            <div className="flex items-center gap-1">
            </div>
          </div>

          {/* Header with profile and shared calendar info */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleBackToCalendar}
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Button>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                <Hash className="w-3 h-3" />
                <span>{calendar.name}</span>
              </div>
              <Badge className="bg-blue-600 text-white text-xs">
                <Users className="w-3 h-3 mr-1" />
                {calendar.members}명 참여
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsMenuModalOpen(true)}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </Button>
            </div>
          </div>

          {/* Shared Calendar Title */}
          <div className="px-6 py-2 border-b border-border">
            <div className="text-lg font-medium text-foreground text-center">
              공유 캘린더
            </div>
            <div className="text-sm text-muted-foreground text-center mt-1">
              코드: {calendar.code}
            </div>
          </div>

          {/* Date Navigation */}
          <div className="px-6 py-6 border-b border-border">
            <div className="flex flex-col items-center justify-center gap-2">
              {/* Year */}
              <div className="text-4xl font-light text-foreground">
                {new Date().getFullYear()}
              </div>
              
              {/* Month */}
              <div className="text-6xl font-light text-foreground">
                {new Date().getMonth() + 1}
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden">
          <IndependentCalendarCore />
        </div>
        
        {/* Bottom Panel - 공유 캘린더용으로 수정된 버전 */}
        <div className="bg-background border-t border-border">
          {/* 공유 캘린더 상태 표시 */}
          <div className="px-4 py-2 bg-muted/30">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{calendar.members}명이 함께 보고 있어요</span>
            </div>
          </div>
          
          {/* 기존 하단 패널 */}
          <IndependentBottomPanel />
        </div>
        
        {/* Menu Modal */}
        <MenuModal 
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
        />
      </IndependentCalendarProvider>
    </div>
  );
};

export default SharedCalendarViewScreen;