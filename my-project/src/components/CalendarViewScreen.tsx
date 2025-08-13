"use client";

import React, { useState } from 'react';
import { User, Calendar as CalendarIcon, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { IndependentCalendarProvider } from './IndependentCalendarProvider';
import IndependentCalendarCore from './IndependentCalendarCore';
import IndependentBottomPanel from './IndependentBottomPanel';
import MenuModal from './MenuModal';

interface CalendarViewScreenProps {
  calendar: {
    id: string;
    name: string;
    color: string;
    description?: string;
    isVisible: boolean;
    isDefault: boolean;
    createdAt: Date;
  };
}

const CalendarViewScreen: React.FC<CalendarViewScreenProps> = ({ 
  calendar 
}) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IndependentCalendarProvider 
        sourceCalendar={calendar} 
        instanceId={`calendar-view-${calendar.id}-${Date.now()}`}
      >
        {/* Header */}
        <div className="bg-background">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 py-2 text-sm text-foreground">
            <span>3:50</span>
            <div className="flex items-center gap-1">
            </div>
          </div>

          {/* Header with profile and calendar info */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span>{calendar.name}</span>
              </div>
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
        
        {/* Bottom Panel */}
        <IndependentBottomPanel />
        
        {/* Menu Modal */}
        <MenuModal 
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
        />
      </IndependentCalendarProvider>
    </div>
  );
};

export default CalendarViewScreen;