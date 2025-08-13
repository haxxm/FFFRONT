"use client";

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Moon, 
  Sun,
  Grid3X3,
  List,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import { useCalendar } from '../contexts/CalendarContext';
import { ViewMode } from '../types/calendar';
import YearMonthSelector from './YearMonthSelector';

const HeaderV2 = () => {
  const { state, dispatch, navigateMonth, goToToday } = useCalendar();

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const currentMonth = state.currentDate.getMonth();
  const currentYear = state.currentDate.getFullYear();

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'month': return Grid3X3;
      case 'week': return List;
      case 'day': return Calendar;
    }
  };

  const getViewModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case 'month': return '월간';
      case 'week': return '주간';
      case 'day': return '일간';
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <YearMonthSelector />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 w-8 p-0"
          >
            {state.isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          {/* View Mode Selector */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {(['month', 'week', 'day'] as ViewMode[]).map((mode) => {
              const Icon = getViewModeIcon(mode);
              return (
                <Button
                  key={mode}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewModeChange(mode)}
                  className={`h-8 px-2 rounded-none border-r border-border last:border-r-0 ${
                    state.viewMode === mode ? 'bg-accent' : 'hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            오늘
          </Button>
          
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0 rounded-none border-r border-border hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
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

export default HeaderV2;