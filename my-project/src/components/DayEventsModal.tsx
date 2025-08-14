"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useContextualCalendar } from './ContextSwitch';
import EventModal from './EventModal';
import type { EventCategory } from '../types/calendar';

interface DayEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
}

const categoryLabels: Record<EventCategory, string> = {
  personal: '개인',
  work: '업무',
  important: '중요',
  family: '가족',
  health: '건강'
};

const DayEventsModal: React.FC<DayEventsModalProps> = ({ isOpen, onClose, date }) => {
  const { state, deleteEvent } = useContextualCalendar();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  if (!date) return null;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
    
    return {
      dateString: `${year}년 ${month}월 ${day}일`,
      dayOfWeek
    };
  };

  const getEventsForDate = () => {
    return state.events.filter(event => {
      const checkDate = new Date(date);
      const eventStartDate = new Date(event.date);
      
      if (event.isMultiDay && event.endDate) {
        const eventEndDate = new Date(event.endDate);
        // 기간 일정: 시작일과 종료일 사이에 포함되는지 확인
        return checkDate >= eventStartDate && checkDate <= eventEndDate;
      } else {
        // 단일 일정: 정확한 날짜 매칭
        return eventStartDate.getDate() === date.getDate() &&
               eventStartDate.getMonth() === date.getMonth() &&
               eventStartDate.getFullYear() === date.getFullYear();
      }
    }).sort((a, b) => {
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

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      deleteEvent(eventId);
    }
  };

  const handleAddNewEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const formattedDate = formatDate(date);
  const dayEvents = getEventsForDate();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col" aria-describedby="day-events-modal-description">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <div className="text-left">
                <div className="text-base">{formattedDate.dateString}</div>
                <div className="text-sm text-muted-foreground font-normal">{formattedDate.dayOfWeek}</div>
              </div>
            </DialogTitle>
            <DialogDescription id="day-events-modal-description">
              이 날의 일정을 확인하고 관리하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* 새 일정 추가 버튼 */}
            <div className="flex-shrink-0 pb-4">
              <Button 
                onClick={handleAddNewEvent}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 일정 추가
              </Button>
            </div>

            {/* 일정 목록 */}
            <div className="flex-1 overflow-y-auto">
              {dayEvents.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>오늘의 일정 ({dayEvents.length}개)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group flex items-start gap-3 p-3 bg-muted/30 hover:bg-muted/60 rounded-lg transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: event.color }}
                        />
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleEditEvent(event)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-sm text-foreground">{event.title}</p>
                            <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full flex-shrink-0">
                              {categoryLabels[event.category]}
                            </span>
                          </div>
                          {formatEventTime(event) && (
                            <p className="text-xs text-muted-foreground mb-1">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatEventTime(event)}
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
                            onClick={(e: React.MouseEvent) => {
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
                            onClick={(e: React.MouseEvent) => {
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
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-sm mb-2">
                    이 날에는 일정이 없습니다
                  </div>
                  <p className="text-xs text-muted-foreground">
                    위의 버튼을 클릭하여 새 일정을 추가해보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        date={date}
      />
    </>
  );
};

export default DayEventsModal;