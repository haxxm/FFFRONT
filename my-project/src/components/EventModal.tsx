"use client";

import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, Tag, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Event, EventCategory } from '../types/calendar';
import { useContextualCalendar } from './ContextSwitch';
import EventOptionsModal from './EventOptionsModal';
import RepeatSettingsModal, { RepeatSettings } from './RepeatSettingsModal';
import FileManagerModal from './FileManagerModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  date?: Date | null;
}

const categoryColors: Record<EventCategory, string> = {
  personal: '#3B82F6',
  work: '#EF4444',
  important: '#F59E0B',
  family: '#10B981',
  health: '#8B5CF6'
};

const categoryLabels: Record<EventCategory, string> = {
  personal: '개인',
  work: '업무',
  important: '중요',
  family: '가족',
  health: '건강'
};

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, date }) => {
  const { state, addEvent, updateEvent, getNextAvailableColor } = useContextualCalendar();
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  // 로컬 날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    category: 'personal' as EventCategory,
    isAllDay: false,
    calendarId: ''
  });



  const [repeatSettings, setRepeatSettings] = useState<RepeatSettings>({
    enabled: false,
    type: 'weekly',
    interval: 1,
    endType: 'never',
    weekdays: []
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        endDate: event.endDate || event.date,
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        category: event.category,
        isAllDay: event.isAllDay,
        calendarId: event.calendarId
      });
      

    } else if (date) {
      setFormData(prev => ({ 
        ...prev, 
        date,
        endDate: date,
        calendarId: state.currentCalendarId || 'default'
      }));

    } else {
      setFormData(prev => ({
        ...prev,
        calendarId: state.currentCalendarId || 'default'
      }));
    }
  }, [event, date, state.currentCalendarId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 종료일 검증
    if (formData.endDate < formData.date) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }
    
    // 시작일과 종료일이 다른지 확인하여 기간 일정 여부 결정
    const isMultiDay = formData.endDate.toDateString() !== formData.date.toDateString();
    
    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      endDate: isMultiDay ? formData.endDate : undefined,
      startTime: formData.isAllDay ? undefined : formData.startTime,
      endTime: formData.isAllDay ? undefined : formData.endTime,
      category: formData.category,
      color: event ? event.color : getNextAvailableColor(), // 기존 이벤트는 색상 유지, 새 이벤트는 랜덤 파스텔 색상 할당
      isAllDay: formData.isAllDay,
      isMultiDay: isMultiDay,
      calendarId: formData.calendarId
    };

    if (event) {
      updateEvent({ ...eventData, id: event.id });
    } else {
      addEvent(eventData);
    }
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date(),
      endDate: new Date(),
      startTime: '',
      endTime: '',
      category: 'personal',
      isAllDay: false,
      calendarId: state.currentCalendarId || 'default'
    });

  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleOptionSelect = (option: string) => {
    console.log(`선택된 옵션: ${option}`);
    switch (option) {
      case 'repeat':
        setIsRepeatModalOpen(true);
        break;
      case 'lunar-repeat':
        // 음력 반복 설정 모달 열기 (TODO)
        alert('음력 반복 설정 기능은 개발 중입니다.');
        break;
      case 'reminder':
        // 알림 설정 포커스 (TODO)
        alert('고급 알림 설정 기능은 개발 중입니다.');
        break;
      case 'dday':
        // D-Day 설정 모달 열기 (TODO)
        alert('D-Day 설정 기능은 개발 중입니다.');
        break;
      case 'location':
        // 위치 설정 모달 열기 (TODO)
        alert('위치 설정 기능은 개발 중입니다.');
        break;
      case 'attendees':
        // 참석자 설정 모달 열기 (TODO)
        alert('참석자 초대 기능은 개발 중입니다.');
        break;
      case 'notes':
        // 노트 섹션 포커스 (TODO)
        alert('고급 노트 기능은 개발 중입니다.');
        break;
      case 'attachments':
        // 파일 첨부 모달 열기
        setIsFileManagerOpen(true);
        break;
      default:
        break;
    }
  };

  const handleRepeatSettingsSave = (settings: RepeatSettings) => {
    setRepeatSettings(settings);
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="event-modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {event ? '일정 편집' : '새 일정'}
          </DialogTitle>
          <DialogDescription id="event-modal-description">
            {event ? '기존 일정을 편집하고 저장하세요.' : '새로운 일정을 추가하세요.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">제목</label>
            <Input
              placeholder="일정 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Calendar */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              캘린더
            </label>
            <Select
              value={formData.calendarId}
              onValueChange={(value: string) => setFormData({ ...formData, calendarId: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: calendar.color }}
                      />
                      {calendar.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              카테고리
            </label>
            <Select
              value={formData.category}
              onValueChange={(value: EventCategory) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: categoryColors[key as EventCategory] }}
                      />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              날짜
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">시작일</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.date)}
                  onChange={(e) => {
                    const newStartDate = new Date(e.target.value + 'T00:00:00');
                    setFormData(prev => ({ 
                      ...prev, 
                      date: newStartDate,
                      // 시작일이 변경되면 종료일이 시작일보다 이전인 경우 시작일로 설정
                      endDate: prev.endDate < newStartDate ? newStartDate : prev.endDate
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">종료일</label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.endDate)}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, endDate: new Date(e.target.value + 'T00:00:00') }));
                  }}
                />
              </div>
            </div>
            {formData.endDate < formData.date && (
              <p className="text-xs text-destructive">
                종료일은 시작일보다 늦어야 합니다.
              </p>
            )}
            {formData.endDate.toDateString() !== formData.date.toDateString() && (
              <p className="text-xs text-muted-foreground">
                📅 {Math.ceil((formData.endDate.getTime() - formData.date.getTime()) / (1000 * 60 * 60 * 24)) + 1}일간 진행되는 일정입니다.
              </p>
            )}
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">하루 종일</label>
            <Switch
              checked={formData.isAllDay}
              onCheckedChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
            />
          </div>

          {/* Time */}
          {!formData.isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  시작 시간
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">종료 시간</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          )}



          {/* Repeat Status */}
          {repeatSettings.enabled && (
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-accent-foreground">반복 설정</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {repeatSettings.type === 'daily' && `${repeatSettings.interval}일마다 반복`}
                {repeatSettings.type === 'weekly' && `${repeatSettings.interval}주마다 반복`}
                {repeatSettings.type === 'monthly' && `${repeatSettings.interval}개월마다 반복`}
                {repeatSettings.type === 'yearly' && `${repeatSettings.interval}년마다 반복`}
              </div>
            </div>
          )}



          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">메모</label>
            <Textarea
              placeholder="메모를 입력하세요 (선택사항)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Advanced Options */}
          <div className="pt-2">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setIsOptionsModalOpen(true)}
              className="w-full flex items-center gap-2 h-10"
            >
              <Settings className="w-4 h-4" />
              고급 설정
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              {event ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>

      <EventOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        onOptionSelect={handleOptionSelect}
      />

      <RepeatSettingsModal
        isOpen={isRepeatModalOpen}
        onClose={() => setIsRepeatModalOpen(false)}
        onSave={handleRepeatSettingsSave}
        initialSettings={repeatSettings}
      />
      
      <FileManagerModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
      />
    </Dialog>
  );
};

export default EventModal;