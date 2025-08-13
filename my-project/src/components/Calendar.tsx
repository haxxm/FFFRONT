"use client";

import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth && 
           selectedDate.getFullYear() === currentYear;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push(
      <button
        key={`prev-${day}`}
        className="h-12 w-full text-muted-foreground hover:bg-muted rounded-lg transition-colors text-sm"
        onClick={() => {
          const prevMonth = new Date(currentYear, currentMonth - 1, day);
          setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
          setSelectedDate(prevMonth);
        }}
      >
        {day}
      </button>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isCurrentDay = isToday(day);
    const isSelectedDay = isSelected(day);
    
    calendarDays.push(
      <button
        key={day}
        className={`h-12 w-full rounded-lg transition-colors text-sm relative ${
          isCurrentDay 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : isSelectedDay
            ? 'bg-accent text-accent-foreground border-2 border-primary'
            : 'hover:bg-muted text-foreground'
        }`}
        onClick={() => handleDateClick(day)}
      >
        {day}
        {isCurrentDay && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full"></div>
        )}
      </button>
    );
  }

  // Next month's leading days
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push(
      <button
        key={`next-${day}`}
        className="h-12 w-full text-muted-foreground hover:bg-muted rounded-lg transition-colors text-sm"
        onClick={() => {
          const nextMonth = new Date(currentYear, currentMonth + 1, day);
          setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
          setSelectedDate(nextMonth);
        }}
      >
        {day}
      </button>
    );
  }

  return {
    calendarComponent: (
      <div className="flex-1 px-4 py-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day, index) => (
            <div 
              key={day} 
              className={`h-8 flex items-center justify-center text-xs font-medium ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>
    ),
    selectedDate,
    currentDate,
    navigateMonth,
    goToToday
  };
};

export default Calendar;