"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCalendar } from '../contexts/CalendarContext';

const YearMonthSelector = () => {
  const { state, dispatch } = useCalendar();
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const currentYear = state.currentDate.getFullYear();
  const currentMonth = state.currentDate.getMonth();

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

  return (
    <div className="flex items-center gap-4">
      {/* Year Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowYearDropdown(!showYearDropdown);
            setShowMonthDropdown(false);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <span className="text-2xl font-bold">{currentYear}</span>
          {showYearDropdown ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showYearDropdown && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  year === currentYear ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Month Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowMonthDropdown(!showMonthDropdown);
            setShowYearDropdown(false);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <span className="text-2xl font-bold">{currentMonth + 1}</span>
          {showMonthDropdown ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showMonthDropdown && (
          <div className="absolute top-full left-0 mt-1 w-24 bg-background border border-border rounded-lg shadow-lg z-50">
            {monthNames.map((month, index) => (
              <button
                key={index}
                onClick={() => handleMonthSelect(index)}
                className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  index === currentMonth ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showYearDropdown || showMonthDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowYearDropdown(false);
            setShowMonthDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default YearMonthSelector;