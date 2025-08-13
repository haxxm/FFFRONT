"use client";

import React, { createContext, useContext } from 'react';
import { useIndependentCalendar } from './IndependentCalendarProvider';

// CalendarV2가 사용할 수 있도록 useCalendar를 override하는 context
const CalendarOverrideContext = createContext<any>(null);

interface IndependentCalendarWrapperProps {
  children: React.ReactNode;
}

export const IndependentCalendarWrapper: React.FC<IndependentCalendarWrapperProps> = ({ children }) => {
  const independentCalendarContext = useIndependentCalendar();
  
  return (
    <CalendarOverrideContext.Provider value={independentCalendarContext}>
      {children}
    </CalendarOverrideContext.Provider>
  );
};

// useCalendar hook을 독립 캘린더 컨텍스트로 오버라이드
export const useCalendar = () => {
  const overrideContext = useContext(CalendarOverrideContext);
  if (overrideContext) {
    return overrideContext;
  }
  
  // 기본적으로는 원래 CalendarContext를 사용
  const { useCalendar: originalUseCalendar } = require('../contexts/CalendarContext');
  return originalUseCalendar();
};