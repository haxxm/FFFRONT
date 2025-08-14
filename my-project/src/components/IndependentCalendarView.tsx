"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';

import { IndependentCalendarProvider } from './IndependentCalendarProvider';
import type { Calendar } from '../types/calendar';
import { Toaster } from './ui/sonner';
import IndependentCalendarCore from './IndependentCalendarCore';


interface IndependentCalendarViewProps {
  calendar: Calendar;
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

const IndependentCalendarView: React.FC<IndependentCalendarViewProps> = ({ 
  calendar, 
  isOpen, 
  onClose,
  sessionId
}) => {
  // 화면 중앙에서 시작하되, 여러 창이 겹치지 않도록 오프셋 추가
  const getInitialPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const calendarWidth = 384; // w-96 = 24rem = 384px
    const calendarHeight = 600;
    
    // sessionId에서 숫자 추출하여 오프셋으로 사용
    const sessionNumber = sessionId ? parseInt(sessionId.split('-')[1] || '0') : 0;
    const offset = (sessionNumber % 5) * 30; // 최대 5개까지 다른 위치에 배치
    
    return {
      x: Math.max(50, Math.min((windowWidth - calendarWidth) / 2 + offset, windowWidth - calendarWidth - 50)),
      y: Math.max(120, Math.min((windowHeight - calendarHeight) / 2 + offset, windowHeight - calendarHeight - 50))
    };
  };

  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // sessionId 변경 시 초기 위치 재계산
  useEffect(() => {
    setPosition(getInitialPosition());
  }, [sessionId]);

  // 화면 크기 변경 시 위치 조정
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const calendarWidth = 384;
      const calendarHeight = 600;
      
      setPosition(prev => ({
        x: Math.min(Math.max(50, prev.x), windowWidth - calendarWidth - 50),
        y: Math.min(Math.max(120, prev.y), windowHeight - calendarHeight - 50)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const calendarWidth = 384; // w-96
      const calendarHeight = 600;
      
      // 화면 경계를 벗어나지 않도록 제한
      const newX = Math.min(
        Math.max(0, e.clientX - dragOffset.x),
        windowWidth - calendarWidth
      );
      const newY = Math.min(
        Math.max(120, e.clientY - dragOffset.y), // 상단 여백 120px 확보
        windowHeight - calendarHeight
      );
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <IndependentCalendarProvider 
        sourceCalendar={calendar} 
      >
        {/* Calendar Info Banner - Draggable Header */}
        <div 
          className="px-4 py-3 border-b border-border bg-gradient-to-r from-background to-background/50 backdrop-blur-sm cursor-grab active:cursor-grabbing"
          style={{ 
            backgroundImage: `linear-gradient(90deg, ${calendar.color}15 0%, transparent 100%)`,
            borderLeft: `4px solid ${calendar.color}`
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: calendar.color }}
            >
              <CalendarIcon className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-foreground truncate">{calendar.name}</h2>
              <p className="text-xs text-muted-foreground">
                독립 캘린더 • {calendar.description || '개인 일정 관리'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                독립 실행
              </div>
              {sessionId && (
                <div className="text-xs text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                  세션 복원됨
                </div>
              )}
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        
        {/* Compact Header */}
        <div className="px-3 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-xs px-2 py-1 bg-background hover:bg-accent rounded transition-colors">
                오늘
              </button>
            </div>
          </div>
        </div>
        
        {/* Independent Calendar Core - 독립적인 캘린더 */}
        <div className="flex-1 overflow-hidden">
          <IndependentCalendarCore />
        </div>
        
        {/* Compact Bottom Panel */}
        <div className="px-3 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              독립 캘린더
            </div>
            <div className="flex items-center gap-1">
              <button className="text-xs px-2 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors">
                + 일정
              </button>
            </div>
          </div>
        </div>
        
        {/* Toast notifications - scoped to this calendar */}
        <Toaster />
      </IndependentCalendarProvider>
    </div>
  );
};

export default IndependentCalendarView;