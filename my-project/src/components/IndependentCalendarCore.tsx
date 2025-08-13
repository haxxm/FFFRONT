"use client";

import React, { useState } from 'react';
import { useIndependentCalendar } from './IndependentCalendarProvider';
import { Event } from '../types/calendar';
import EventModal from './EventModal';
import DayEventsModal from './DayEventsModal';

const IndependentCalendarCore = () => {
  const { state, dispatch, getVisibleEvents } = useIndependentCalendar();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);

  const today = new Date();
  const currentMonth = state.currentDate.getMonth();
  const currentYear = state.currentDate.getFullYear();

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    if (!state.selectedDate) return false;
    return state.selectedDate.getDate() === day && 
           state.selectedDate.getMonth() === currentMonth && 
           state.selectedDate.getFullYear() === currentYear;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
    dispatch({ type: 'SET_SELECTED_DATE', payload: clickedDate });
  };

  const handleDateDoubleClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
    const eventsForDate = getEventsForDate(day);
    
    setSelectedEventDate(clickedDate);
    
    if (eventsForDate.length > 0) {
      // 일정이 있는 날짜 -> 일정 목록 모달 열기
      setIsDayEventsModalOpen(true);
    } else {
      // 일정이 없는 날짜 -> 일정 추가 모달 열기
      setIsEventModalOpen(true);
    }
  };

  const getEventsForDate = (day: number) => {
    const visibleEvents = getVisibleEvents();
    return visibleEvents.filter(event => {
      const checkDate = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
      const eventStartDate = new Date(event.date);
      
      if (event.isMultiDay && event.endDate) {
        const eventEndDate = new Date(event.endDate);
        // 기간 일정: 시작일과 종료일 사이에 포함되는지 확인
        return checkDate >= eventStartDate && checkDate <= eventEndDate;
      } else {
        // 단일 일정: 정확한 날짜 매칭
        return eventStartDate.getDate() === day &&
               eventStartDate.getMonth() === currentMonth &&
               eventStartDate.getFullYear() === currentYear;
      }
    });
  };

  const getEventCardColor = (color: string) => {
    // 파스텔 톤 색상을 위한 새로운 맵핑
    const colorMap: { [key: string]: string } = {
      // 기존 색상들 (호환성을 위해 유지)
      '#ff6b6b': 'bg-red-100 text-red-800',
      '#4ecdc4': 'bg-teal-100 text-teal-800',
      '#45b7d1': 'bg-blue-100 text-blue-800',
      '#96ceb4': 'bg-green-100 text-green-800',
      '#ffeaa7': 'bg-yellow-100 text-yellow-800',
      '#fd79a8': 'bg-pink-100 text-pink-800',
      '#a29bfe': 'bg-purple-100 text-purple-800',
      '#e17055': 'bg-orange-100 text-orange-800',
      
      // 새로운 파스텔 톤 색상들
      '#FFE4EB': 'text-red-800',      // 연한 분홍
      '#DFF6FF': 'text-blue-800',     // 연한 하늘
      '#F3E8FF': 'text-purple-800',   // 연한 라벤더
      '#DFFFE0': 'text-green-800',    // 연한 민트
      '#FFF9D9': 'text-yellow-800',   // 연한 크림
      '#FFE7D6': 'text-orange-800',   // 연한 복숭아
      '#FFF4E6': 'text-orange-700',   // 연한 아이보리
      '#E3F0FF': 'text-blue-800',     // 연한 파랑
      '#FFEAD7': 'text-orange-800',   // 연한 살구
      '#E2FBF4': 'text-teal-800',     // 연한 청록
      '#F5EFFF': 'text-purple-800',   // 연한 보라
      '#FFFFE0': 'text-yellow-800',   // 연한 노랑
      '#E6FFF6': 'text-emerald-800',  // 연한 초록
      '#FFEEF3': 'text-rose-800',     // 연한 로즈
      '#FFDCE0': 'text-pink-800',     // 연한 핑크
      '#E4FFF1': 'text-emerald-800',  // 연한 에메랄드
      '#F2F2F2': 'text-gray-800',     // 연한 그레이
      '#FFF1DD': 'text-amber-800',    // 연한 베이지
      '#E7F6FF': 'text-blue-800',     // 연한 블루
      '#FFFBEA': 'text-amber-800',    // 연한 골드
    };
    
    // 파스텔 색상인 경우 직접 배경색으로 사용하고 적절한 텍스트 색상 적용
    if (color.startsWith('#') && color.length === 7) {
      return colorMap[color] || 'text-gray-800';
    }
    
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  const getMultiDayEventPosition = (event: Event, day: number, currentMonth: number, currentYear: number) => {
    if (!event.isMultiDay || !event.endDate) return 'single';
    
    const checkDate = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
    const eventStartDate = new Date(event.date);
    const eventEndDate = new Date(event.endDate);
    
    // 날짜를 정규화 (시간 정보 제거)
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === eventStartDate.getTime()) return 'start';
    if (checkDate.getTime() === eventEndDate.getTime()) return 'end';
    if (checkDate > eventStartDate && checkDate < eventEndDate) return 'middle';
    
    return 'single';
  };

  const renderEventCards = (events: Event[], day: number) => {
    if (events.length === 0) return null;
    
    // 최대 2개의 일정만 표시 (공간 효율성을 위해)
    const displayEvents = events.slice(0, 2);
    
    return (
      <div className="mt-1 space-y-0.5 relative">
        {displayEvents.map((event, index) => {
          const textColor = getEventCardColor(event.color);
          const position = getMultiDayEventPosition(event, day, currentMonth, currentYear);
          
          // 기간 일정의 위치에 따른 스타일링
          let borderRadiusClass = '';
          let extraStyles = {};
          let showTitle = false;
          
          if (event.isMultiDay && event.endDate) {
            switch (position) {
              case 'start':
                borderRadiusClass = 'rounded-l-sm';
                extraStyles = { 
                  position: 'relative',
                  zIndex: 2,
                };
                showTitle = true;
                break;
              case 'middle':
                borderRadiusClass = '';
                extraStyles = { 
                  position: 'relative',
                  zIndex: 2,
                };
                showTitle = false;
                break;
              case 'end':
                borderRadiusClass = 'rounded-r-sm';
                extraStyles = { 
                  position: 'relative',
                  zIndex: 2,
                };
                showTitle = false;
                break;
              default:
                borderRadiusClass = 'rounded-sm';
                showTitle = true;
                break;
            }
          } else {
            borderRadiusClass = 'rounded-sm';
            showTitle = true;
          }
          
          return (
            <div
              key={`${event.id}-${index}`}
              className={`${textColor} ${borderRadiusClass} px-1 py-0.5 text-xs font-medium relative overflow-hidden`}
              style={{ 
                backgroundColor: event.color,
                fontSize: '9px', 
                lineHeight: '1.1',
                height: '14px',
                minHeight: '14px',
                ...extraStyles
              }}
            >
              <div className="relative z-10 truncate">
                {showTitle ? event.title : ''}
              </div>
              
              {/* 연결선을 위한 배경 확장 */}
              {event.isMultiDay && event.endDate && (
                <>
                  {position === 'start' && (
                    <div 
                      className="absolute top-0 right-0 h-full w-2"
                      style={{ backgroundColor: event.color }}
                    />
                  )}
                  {position === 'middle' && (
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: event.color }}
                    />
                  )}
                  {position === 'end' && (
                    <div 
                      className="absolute top-0 left-0 h-full w-2"
                      style={{ backgroundColor: event.color }}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
        {events.length > 2 && (
          <div 
            className="bg-gray-100 text-gray-600 rounded-sm px-1 py-0.5 text-xs text-center font-medium"
            style={{ fontSize: '8px' }}
          >
            +{events.length - 2}
          </div>
        )}
      </div>
    );
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dayIndex = (firstDayOfMonth - 1 - i) % 7;
    const visibleEvents = getVisibleEvents();
    const events = visibleEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentMonth - 1 &&
             eventDate.getFullYear() === currentYear;
    });

    // 토요일(6)과 일요일(0) 색상 결정
    const dayTextColor = dayIndex === 0 ? 'text-red-400' : dayIndex === 6 ? 'text-blue-400' : 'text-muted-foreground';

    calendarDays.push(
      <button
        key={`prev-${day}`}
        className="h-24 w-full hover:bg-muted transition-colors relative"
        onClick={() => {
          const prevMonth = new Date(currentYear, currentMonth - 1, day, 0, 0, 0, 0);
          dispatch({ type: 'SET_CURRENT_DATE', payload: new Date(currentYear, currentMonth - 1, 1) });
          dispatch({ type: 'SET_SELECTED_DATE', payload: prevMonth });
        }}
        onDoubleClick={() => {
          const prevMonth = new Date(currentYear, currentMonth - 1, day, 0, 0, 0, 0);
          const visibleEvents = getVisibleEvents();
          const eventsForPrevDate = visibleEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                   eventDate.getMonth() === currentMonth - 1 &&
                   eventDate.getFullYear() === currentYear;
          });
          
          setSelectedEventDate(prevMonth);
          dispatch({ type: 'SET_CURRENT_DATE', payload: new Date(currentYear, currentMonth - 1, 1) });
          dispatch({ type: 'SET_SELECTED_DATE', payload: prevMonth });
          
          if (eventsForPrevDate.length > 0) {
            setIsDayEventsModalOpen(true);
          } else {
            setIsEventModalOpen(true);
          }
        }}
      >
        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium ${dayTextColor}`}>
          {day}
        </div>
        <div className="pt-6 px-0">
          {renderEventCards(events, day)}
        </div>
      </button>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isCurrentDay = isToday(day);
    const isSelectedDay = isSelected(day);
    const events = getEventsForDate(day);
    
    // 현재 날짜의 요일 인덱스 계산
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    
    // 토요일(6)과 일요일(0) 색상 결정
    const dayTextColor = isCurrentDay 
      ? 'text-primary font-bold' 
      : dayIndex === 0 
      ? 'text-red-500' 
      : dayIndex === 6 
      ? 'text-blue-500' 
      : 'text-foreground';
    
    calendarDays.push(
      <button
        key={day}
        className={`h-24 w-full transition-colors relative ${
          isCurrentDay 
            ? 'bg-primary/10' 
            : isSelectedDay
            ? 'bg-accent'
            : 'hover:bg-muted'
        }`}
        onClick={() => handleDateClick(day)}
        onDoubleClick={() => handleDateDoubleClick(day)}
      >
        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium ${dayTextColor}`}>
          {day}
        </div>
        <div className="pt-6 px-0">
          {renderEventCards(events, day)}
        </div>
      </button>
    );
  }

  // Next month's leading days
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const dayIndex = (calendarDays.length) % 7;
    const events = state.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentMonth + 1 &&
             eventDate.getFullYear() === currentYear;
    });

    // 토요일(6)과 일요일(0) 색상 결정
    const dayTextColor = dayIndex === 0 ? 'text-red-400' : dayIndex === 6 ? 'text-blue-400' : 'text-muted-foreground';

    calendarDays.push(
      <button
        key={`next-${day}`}
        className="h-24 w-full hover:bg-muted transition-colors relative"
        onClick={() => {
          const nextMonth = new Date(currentYear, currentMonth + 1, day, 0, 0, 0, 0);
          dispatch({ type: 'SET_CURRENT_DATE', payload: new Date(currentYear, currentMonth + 1, 1) });
          dispatch({ type: 'SET_SELECTED_DATE', payload: nextMonth });
        }}
        onDoubleClick={() => {
          const nextMonth = new Date(currentYear, currentMonth + 1, day, 0, 0, 0, 0);
          const eventsForNextDate = state.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                   eventDate.getMonth() === currentMonth + 1 &&
                   eventDate.getFullYear() === currentYear;
          });
          
          setSelectedEventDate(nextMonth);
          dispatch({ type: 'SET_CURRENT_DATE', payload: new Date(currentYear, currentMonth + 1, 1) });
          dispatch({ type: 'SET_SELECTED_DATE', payload: nextMonth });
          
          if (eventsForNextDate.length > 0) {
            setIsDayEventsModalOpen(true);
          } else {
            setIsEventModalOpen(true);
          }
        }}
      >
        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium ${dayTextColor}`}>
          {day}
        </div>
        <div className="pt-6 px-0">
          {renderEventCards(events, day)}
        </div>
      </button>
    );
  }

  return (
    <>
      <div className="flex-1 px-4 py-6">
        {/* Day headers - 요일 폰트를 더 두껍게 설정 */}
        <div className="grid grid-cols-7 mb-4">
          {dayNames.map((day, index) => (
            <div 
              key={day} 
              className={`h-8 flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-foreground'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid - 세로 선 제거를 위해 border 제거 */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays}
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEventDate(null);
        }}
        date={selectedEventDate}
      />

      <DayEventsModal
        isOpen={isDayEventsModalOpen}
        onClose={() => {
          setIsDayEventsModalOpen(false);
          setSelectedEventDate(null);
        }}
        date={selectedEventDate}
      />
    </>
  );
};

export default IndependentCalendarCore;