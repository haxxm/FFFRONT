"use client";

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

import { useIndependentCalendar } from './IndependentCalendarProvider';
import { EventCategory } from '../types/calendar';
import EventModal from './EventModal';

const categoryLabels: Record<EventCategory, string> = {
  personal: '개인',
  work: '업무',
  important: '중요',
  family: '가족',
  health: '건강'
};

const IndependentBottomPanel = () => {
  const { state, dispatch, deleteEvent } = useIndependentCalendar();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return null;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
    
    return {
      dateString: `${year}년 ${month}월 ${day}일`,
      dayOfWeek
    };
  };

  const getFilteredEvents = () => {
    let filtered = state.events;

    // Category filter
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === state.selectedCategory);
    }

    // Search filter
    if (state.searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
    }

    // Selected date filter
    if (state.selectedDate) {
      filtered = filtered.filter(event => {
        const checkDate = new Date(state.selectedDate!);
        const eventStartDate = new Date(event.date);
        
        if (event.isMultiDay && event.endDate) {
          const eventEndDate = new Date(event.endDate);
          // 기간 일정: 시작일과 종료일 사이에 포함되는지 확인
          return checkDate >= eventStartDate && checkDate <= eventEndDate;
        } else {
          // 단일 일정: 정확한 날짜 매칭
          return eventStartDate.getDate() === state.selectedDate!.getDate() &&
                 eventStartDate.getMonth() === state.selectedDate!.getMonth() &&
                 eventStartDate.getFullYear() === state.selectedDate!.getFullYear();
        }
      });
    }

    return filtered.sort((a, b) => {
      // 기간 일정을 먼저 표시
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      if (!a.isAllDay && !b.isAllDay && a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
  };

  const formatEventTime = (event: any) => {
    if (event.isMultiDay && event.endDate) {
      const startDate = new Date(event.date);
      const endDate = new Date(event.endDate);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (event.isAllDay) {
        return `${daysDiff}일간`;
      } else if (event.startTime && event.endTime) {
        return `${daysDiff}일간 (${event.startTime} - ${event.endTime})`;
      } else {
        return `${daysDiff}일간`;
      }
    }
    
    if (event.isAllDay) return '하루 종일';
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    if (event.startTime) {
      return event.startTime;
    }
    return '';
  };

  const formatEventDateRange = (event: any) => {
    if (event.isMultiDay && event.endDate) {
      const startDate = new Date(event.date);
      const endDate = new Date(event.endDate);
      
      const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };
      
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return null;
  };

  const formattedDate = formatSelectedDate(state.selectedDate);
  const filteredEvents = getFilteredEvents();

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      deleteEvent(eventId);
    }
  };

  return (
    <>
      <div className="border-t border-border bg-background">
        {/* Selected Date Display */}
        {state.selectedDate && formattedDate && (
          <div className="px-4 py-3 border-b border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{formattedDate.dayOfWeek}</p>
              <p className="text-sm font-medium text-foreground">{formattedDate.dateString}</p>
              <p className="text-xs text-muted-foreground mt-1">
                독립 캘린더 - 날짜를 더블클릭하여 일정 관리
              </p>
            </div>
          </div>
        )}
        
        {/* Event List */}
        <div className="max-h-64 overflow-y-auto bg-card">
          {filteredEvents.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">
                  {state.selectedDate ? `오늘의 일정 (${filteredEvents.length})` : `전체 일정 (${filteredEvents.length})`}
                </h3>
              </div>
              <div className="space-y-2">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group flex items-start gap-3 p-3 bg-muted/30 hover:bg-muted/60 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleEditEvent(event)}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate text-foreground">{event.title}</p>
                        <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full flex-shrink-0">
                          {categoryLabels[event.category]}
                        </span>
                      </div>
                      {formatEventTime(event) && (
                        <p className="text-xs text-muted-foreground mb-1">
                          ⏰ {formatEventTime(event)}
                        </p>
                      )}
                      {formatEventDateRange(event) && (
                        <p className="text-xs text-muted-foreground mb-1">
                          📅 {formatEventDateRange(event)}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        className="h-7 w-7 p-0 hover:bg-accent"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        date={state.selectedDate}
      />
    </>
  );
};

export default IndependentBottomPanel;