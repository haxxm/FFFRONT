"use client";

import React from 'react';
import { Plus, List, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface BottomPanelProps {
  selectedDate: Date | null;
}

const BottomPanel: React.FC<BottomPanelProps> = ({ selectedDate }) => {
  const formatSelectedDate = (date: Date | null) => {
    if (!date) return null;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
    
    return {
      dateString: `${year}년 ${month}월 ${day}일`,
      dayOfWeek
    };
  };

  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <div className="border-t border-border bg-background">
      {/* Selected Date Display */}
      {selectedDate && formattedDate && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{formattedDate.dayOfWeek}</p>
            <p className="text-sm font-medium text-foreground">{formattedDate.dateString}</p>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="h-12 flex flex-col items-center justify-center gap-1 border-border hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">일정 추가</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-12 flex flex-col items-center justify-center gap-1 border-border hover:bg-accent"
          >
            <List className="h-4 w-4" />
            <span className="text-xs">일정 보기</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-12 flex flex-col items-center justify-center gap-1 border-border hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs">설정</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;