"use client";

import { useContext, createContext } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { useIndependentCalendar } from './IndependentCalendarProvider';

// 독립 캘린더 사용 여부를 확인하는 컨텍스트
const IndependentCalendarFlagContext = createContext<boolean>(false);

// 올바른 캘린더 컨텍스트를 사용하는 hook
export const useContextualCalendar = () => {
  const isIndependent = useContext(IndependentCalendarFlagContext);
  
  if (isIndependent) {
    try {
      return useIndependentCalendar();
    } catch {
      // IndependentCalendarProvider가 없는 경우 기본 캘린더 사용
      return useCalendar();
    }
  }
  
  return useCalendar();
};

// 독립 캘린더 플래그 제공자
export const IndependentCalendarFlag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <IndependentCalendarFlagContext.Provider value={true}>
      {children}
    </IndependentCalendarFlagContext.Provider>
  );
};