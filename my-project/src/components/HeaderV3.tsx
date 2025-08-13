"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  User, 
  Menu,
  Moon, 
  Sun,
  Grid3X3,
  List,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from './ui/button';

import { useCalendar } from '../contexts/CalendarContext';
import { ViewMode } from '../types/calendar';
import MenuModal from './MenuModal';
import PastScheduleModal from './PastScheduleModal';

const HeaderV3 = () => {
  const { state, dispatch } = useCalendar();
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isPastScheduleModalOpen, setIsPastScheduleModalOpen] = useState(false);



  const currentYear = state.currentDate.getFullYear();
  const currentMonth = state.currentDate.getMonth();
  
  // 현재 선택된 캘린더 정보
  const currentCalendar = state.calendars.find(cal => cal.id === state.currentCalendarId);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Generate year range (current year ± 10 years)
  const generateYearRange = () => {
    const years = [];
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const years = generateYearRange();



  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentMonth, 1);
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
    setShowYearDropdown(false);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentYear, month, 1);
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
    setShowMonthDropdown(false);
  };

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
      case 'day': return CalendarIcon;
    }
  };

  return (
    <div className="bg-background">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm text-foreground">
        <span>3:50</span>
        <div className="flex items-center gap-1">


        </div>
      </div>

      {/* Header with navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 px-4 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentCalendar?.color || '#3B82F6' }}
            />
            <span>
              {currentCalendar?.name || 'Main page'}
            </span>
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

      {/* Title Area */}
      <div className="px-6 py-2 border-b border-border">
        <button 
          onClick={() => setIsPastScheduleModalOpen(true)}
          className="w-full text-lg font-medium text-foreground text-center hover:text-muted-foreground transition-colors"
        >
          과거일정 캘린더
        </button>
      </div>

      {/* Year and Month Display */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Year with dropdown - positioned at top */}
          <div className="relative">
            <button
              onClick={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
              className="text-4xl font-light text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2"
            >
              {currentYear}
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </button>

            {showYearDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowYearDropdown(false)}
                />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        year === currentYear ? 'bg-accent text-accent-foreground font-medium' : 'text-foreground'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Month with dropdown - positioned at bottom */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
              className="text-6xl font-light text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2"
            >
              {currentMonth + 1}
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            </button>

            {showMonthDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMonthDropdown(false)}
                />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-24 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {monthNames.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthSelect(index)}
                      className={`w-full px-3 py-3 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        index === currentMonth ? 'bg-accent text-accent-foreground font-medium' : 'text-foreground'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MenuModal 
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
      />

      <PastScheduleModal 
        isOpen={isPastScheduleModalOpen}
        onClose={() => setIsPastScheduleModalOpen(false)}
      />
    </div>
  );
};

export default HeaderV3;