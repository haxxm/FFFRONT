"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Event, EventCategory, ViewMode, CalendarState, Calendar } from '../types/calendar';
import { IndependentCalendarFlag } from './ContextSwitch';

type CalendarAction = 
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: EventCategory | 'all' }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'LOAD_EVENTS'; payload: Event[] }
  | { type: 'ADD_CALENDAR'; payload: Calendar }
  | { type: 'UPDATE_CALENDAR'; payload: Calendar }
  | { type: 'DELETE_CALENDAR'; payload: string }
  | { type: 'TOGGLE_CALENDAR_VISIBILITY'; payload: string }
  | { type: 'SET_CURRENT_CALENDAR'; payload: string }
  | { type: 'LOAD_CALENDARS'; payload: Calendar[] };

interface CalendarContextType {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  addCalendar: (calendar: Omit<Calendar, 'id' | 'createdAt'>) => void;
  updateCalendar: (calendar: Calendar) => void;
  deleteCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;
  setCurrentCalendar: (id: string) => void;
  getVisibleEvents: () => Event[];
  getNextAvailableColor: () => string;
}

const IndependentCalendarContext = createContext<CalendarContextType | undefined>(undefined);

// 파스텔 톤 색상 팔레트
const PASTEL_COLORS = [
  '#FFE4EB', // 연한 분홍
  '#DFF6FF', // 연한 하늘
  '#F3E8FF', // 연한 라벤더
  '#DFFFE0', // 연한 민트
  '#FFF9D9', // 연한 크림
  '#FFE7D6', // 연한 복숭아
  '#FFF4E6', // 연한 아이보리
  '#E3F0FF', // 연한 파랑
  '#FFEAD7', // 연한 살구
  '#E2FBF4', // 연한 청록
  '#F5EFFF', // 연한 보라
  '#FFFFE0', // 연한 노랑
  '#E6FFF6', // 연한 초록
  '#FFEEF3', // 연한 로즈
  '#FFDCE0', // 연한 핑크
  '#E4FFF1', // 연한 에메랄드
  '#F2F2F2', // 연한 그레이
  '#FFF1DD', // 연한 베이지
  '#E7F6FF', // 연한 블루
  '#FFFBEA', // 연한 골드
];

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'LOAD_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_CALENDAR':
      return { ...state, calendars: [...state.calendars, action.payload] };
    case 'UPDATE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.map(calendar => 
          calendar.id === action.payload.id ? action.payload : calendar
        )
      };
    case 'DELETE_CALENDAR':
      return {
        ...state,
        calendars: state.calendars.filter(calendar => calendar.id !== action.payload),
        // 삭제된 캘린더의 이벤트도 삭제
        events: state.events.filter(event => event.calendarId !== action.payload),
        // 현재 캘린더가 삭제된 경우 기본 캘린더로 변경
        currentCalendarId: state.currentCalendarId === action.payload 
          ? state.calendars.find(c => c.isDefault)?.id || state.calendars[0]?.id || null
          : state.currentCalendarId
      };
    case 'TOGGLE_CALENDAR_VISIBILITY':
      return {
        ...state,
        calendars: state.calendars.map(calendar => 
          calendar.id === action.payload 
            ? { ...calendar, isVisible: !calendar.isVisible }
            : calendar
        )
      };
    case 'SET_CURRENT_CALENDAR':
      return { ...state, currentCalendarId: action.payload };
    case 'LOAD_CALENDARS':
      return { ...state, calendars: action.payload };
    default:
      return state;
  }
};

interface IndependentCalendarProviderProps {
  children: React.ReactNode;
  sourceCalendar: Calendar;
  instanceId: string;
}

export const IndependentCalendarProvider: React.FC<IndependentCalendarProviderProps> = ({ 
  children, 
  sourceCalendar,
  instanceId
}) => {
  // 각 독립 캘린더는 새로운 기본 캘린더로 시작
  const createIndependentCalendar = (): Calendar => ({
    id: sourceCalendar.id,
    name: sourceCalendar.name,
    description: sourceCalendar.description || '독립적인 캘린더 작업 공간',
    color: sourceCalendar.color,
    isVisible: true,
    isDefault: true,
    createdAt: new Date()
  });

  // 시작 날짜 설정 - sourceCalendar에 startYear, startMonth가 있다면 사용
  const getInitialDate = () => {
    const startYear = (sourceCalendar as any).startYear;
    const startMonth = (sourceCalendar as any).startMonth;
    
    if (startYear && typeof startMonth === 'number') {
      return new Date(startYear, startMonth, 1);
    }
    
    return new Date();
  };

  const initialState: CalendarState = {
    calendars: [createIndependentCalendar()],
    currentCalendarId: sourceCalendar.id,
    events: [], // 빈 이벤트로 시작
    selectedDate: null,
    currentDate: getInitialDate(),
    viewMode: 'month',
    isDarkMode: document.documentElement.classList.contains('dark'),
    searchQuery: '',
    selectedCategory: 'all'
  };

  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const getNextAvailableColor = (): string => {
    // 현재 사용 중인 색상들 추출
    const usedColors = state.events.map(event => event.color);
    
    // 사용되지 않은 파스텔 색상 찾기
    const availableColors = PASTEL_COLORS.filter(color => !usedColors.includes(color));
    
    // 사용 가능한 색상이 있으면 랜덤으로 선택, 없으면 랜덤 파스텔 색상 반환
    if (availableColors.length > 0) {
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
      return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    }
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const event: Event = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      calendarId: eventData.calendarId || state.currentCalendarId || sourceCalendar.id,
      color: eventData.color || getNextAvailableColor() // 색상이 없으면 자동 할당
    };
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
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

  const goToToday = () => {
    const today = new Date();
    dispatch({ type: 'SET_CURRENT_DATE', payload: today });
    dispatch({ type: 'SET_SELECTED_DATE', payload: today });
  };

  const addCalendar = (calendarData: Omit<Calendar, 'id' | 'createdAt'>) => {
    const calendar: Calendar = {
      ...calendarData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_CALENDAR', payload: calendar });
  };

  const updateCalendar = (calendar: Calendar) => {
    dispatch({ type: 'UPDATE_CALENDAR', payload: calendar });
  };

  const deleteCalendar = (id: string) => {
    dispatch({ type: 'DELETE_CALENDAR', payload: id });
  };

  const toggleCalendarVisibility = (id: string) => {
    dispatch({ type: 'TOGGLE_CALENDAR_VISIBILITY', payload: id });
  };

  const setCurrentCalendar = (id: string) => {
    dispatch({ type: 'SET_CURRENT_CALENDAR', payload: id });
  };

  const getVisibleEvents = () => {
    const visibleCalendarIds = state.calendars
      .filter(calendar => calendar.isVisible)
      .map(calendar => calendar.id);
    
    return state.events.filter(event => 
      visibleCalendarIds.includes(event.calendarId)
    );
  };

  return (
    <IndependentCalendarContext.Provider value={{
      state,
      dispatch,
      addEvent,
      updateEvent,
      deleteEvent,
      navigateMonth,
      goToToday,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      toggleCalendarVisibility,
      setCurrentCalendar,
      getVisibleEvents,
      getNextAvailableColor
    }}>
      <IndependentCalendarFlag>
        {children}
      </IndependentCalendarFlag>
    </IndependentCalendarContext.Provider>
  );
};

export const useIndependentCalendar = () => {
  const context = useContext(IndependentCalendarContext);
  if (context === undefined) {
    throw new Error('useIndependentCalendar must be used within an IndependentCalendarProvider');
  }
  return context;
};