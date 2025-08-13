"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Event, EventCategory, ViewMode, CalendarState, Calendar } from '../types/calendar';

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

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// 파스텔 톤 색상 팔레트 - 20가지
const PASTEL_COLORS = [
  '#FFB3BA', // 연한 핑크
  '#FFDFBA', // 연한 피치
  '#FFFFBA', // 연한 옐로우
  '#BAFFC9', // 연한 민트 그린
  '#BAE1FF', // 연한 스카이 블루
  '#E1BAFF', // 연한 라벤더
  '#FFE1BA', // 연한 오렌지
  '#FFBAD2', // 연한 로즈
  '#D2FFBA', // 연한 라임
  '#BAF2FF', // 연한 아쿠아
  '#FFBAFF', // 연한 매젠타
  '#D4EDDA', // 연한 세이지 그린
  '#F8D7DA', // 연한 코랄
  '#D1ECF1', // 연한 틸
  '#FFF3CD', // 연한 크림
  '#E2E3E5', // 연한 실버
  '#FADBD8', // 연한 블러쉬
  '#EBF5FB', // 연한 파우더 블루
  '#F4F4F4', // 연한 펄 화이트
  '#E8F8F5', // 연한 에메랄드
];

// 기본 캘린더 생성
const createDefaultCalendar = (): Calendar => ({
  id: 'default',
  name: '내 캘린더',
  description: '기본 캘린더',
  color: '#3B82F6',
  isVisible: true,
  isDefault: true,
  createdAt: new Date()
});

const initialState: CalendarState = {
  calendars: [createDefaultCalendar()],
  currentCalendarId: 'default',
  events: [],
  selectedDate: null,
  currentDate: new Date(),
  viewMode: 'month',
  isDarkMode: false,
  searchQuery: '',
  selectedCategory: 'all'
};

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

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const savedEvents = localStorage.getItem('antogether_events');
    const savedCalendars = localStorage.getItem('antogether_calendars');
    const savedCurrentCalendarId = localStorage.getItem('antogether_current_calendar');
    const savedDarkMode = localStorage.getItem('antogether_dark_mode');
    
    if (savedCalendars) {
      const calendars = JSON.parse(savedCalendars).map((calendar: any) => ({
        ...calendar,
        createdAt: new Date(calendar.createdAt)
      }));
      dispatch({ type: 'LOAD_CALENDARS', payload: calendars });
    }
    
    if (savedCurrentCalendarId) {
      dispatch({ type: 'SET_CURRENT_CALENDAR', payload: savedCurrentCalendarId });
    }
    
    if (savedEvents) {
      const events = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        calendarId: event.calendarId || 'default' // 기존 이벤트에 대한 호환성
      }));
      dispatch({ type: 'LOAD_EVENTS', payload: events });
    }
    
    if (savedDarkMode === 'true') {
      dispatch({ type: 'TOGGLE_DARK_MODE' });
    }

    // 커뮤니티 캘린더 추가 이벤트 리스너
    const handleAddSharedCalendar = (event: any) => {
      const calendarData = event.detail;
      const calendar: Calendar = {
        ...calendarData,
        id: calendarData.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        isVisible: true
      };
      dispatch({ type: 'ADD_CALENDAR', payload: calendar });
    };

    window.addEventListener('add-shared-calendar', handleAddSharedCalendar);

    return () => {
      window.removeEventListener('add-shared-calendar', handleAddSharedCalendar);
    };
  }, []);

  // 다크모드 적용
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('antogether_dark_mode', state.isDarkMode.toString());
  }, [state.isDarkMode]);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('antogether_events', JSON.stringify(state.events));
  }, [state.events]);

  useEffect(() => {
    localStorage.setItem('antogether_calendars', JSON.stringify(state.calendars));
  }, [state.calendars]);

  useEffect(() => {
    if (state.currentCalendarId) {
      localStorage.setItem('antogether_current_calendar', state.currentCalendarId);
    }
  }, [state.currentCalendarId]);

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
      calendarId: eventData.calendarId || state.currentCalendarId || 'default',
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
    <CalendarContext.Provider value={{
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
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};