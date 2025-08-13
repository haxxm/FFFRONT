"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onNavigateMonth, onGoToToday }) => {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-medium text-foreground">
              {currentYear}년 {monthNames[currentMonth]}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToToday}
            className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            오늘
          </Button>
          
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('prev')}
              className="h-8 w-8 p-0 rounded-none border-r border-border hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('next')}
              className="h-8 w-8 p-0 rounded-none hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;