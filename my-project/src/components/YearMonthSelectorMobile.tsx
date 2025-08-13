"use client";

import React, { useState } from 'react';
import { ChevronDown, User, Menu } from 'lucide-react';
import { useCalendar } from '../contexts/CalendarContext';

const YearMonthSelectorMobile = () => {
  const { state, dispatch } = useCalendar();
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const currentYear = state.currentDate.getFullYear();
  const currentMonth = state.currentDate.getMonth();

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(state.currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm text-foreground">
        <span>3:50</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-3 bg-foreground/50 rounded-full"></div>
            <div className="w-1 h-3 bg-foreground/50 rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-foreground rounded-sm">
            <div className="w-4 h-full bg-foreground rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header with navigation */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <button className="px-4 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            Main page
          </button>
        </div>
        
        <Menu className="w-6 h-6 text-foreground" />
      </div>

      {/* Year and Month Display */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90 text-foreground" />
          </button>

          <div className="text-center">
            {/* Year with dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="text-6xl font-light text-foreground mb-2 hover:text-muted-foreground transition-colors"
              >
                {currentYear}
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

            {/* Month display */}
            <div className="text-8xl font-light text-foreground">
              {currentMonth + 1}
            </div>
          </div>

          <button
            onClick={() => navigateMonth('next')}
            className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-full transition-colors"
          >
            <ChevronDown className="w-5 h-5 -rotate-90 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearMonthSelectorMobile;