"use client";

import React, { useState } from 'react';
import {
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Check,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useCalendar } from '../contexts/CalendarContext';
import type { Calendar } from '../types/calendar';
import { IndependentCalendarView } from './IndependentCalendarView';

interface CalendarManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalendarFormData {
  name: string;
  description: string;
  color: string;
  isVisible: boolean;
}

const predefinedColors = [
  '#3B82F6', // 파랑
  '#EF4444', // 빨강
  '#10B981', // 초록
  '#F59E0B', // 주황
  '#8B5CF6', // 보라
  '#EC4899', // 핑크
  '#06B6D4', // 시안
  '#84CC16', // 라임
];

const CalendarManagementModal: React.FC<CalendarManagementModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    state, 
    addCalendar, 
    updateCalendar, 
    deleteCalendar, 
    toggleCalendarVisibility,
    setCurrentCalendar 
  } = useCalendar();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [formData, setFormData] = useState<CalendarFormData>({
    name: '',
    description: '',
    color: predefinedColors[0],
    isVisible: true
  });
  const [openCalendars, setOpenCalendars] = useState<string[]>([]);

  // 저장된 세션에서 활성 캘린더 ID 가져오기
  const getSessionCalendarIds = (): string[] => {
    const saved = localStorage.getItem('antogether_independent_sessions');
    if (!saved) return [];
    const sessions = JSON.parse(saved);
    return sessions.map((session: any) => session.calendarId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: predefinedColors[0],
      isVisible: true
    });
    setIsCreating(false);
    setEditingCalendar(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('캘린더 이름을 입력해주세요.');
      return;
    }

    if (editingCalendar) {
      // 편집 모드
      updateCalendar({
        ...editingCalendar,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isVisible: formData.isVisible
      });
    } else {
      // 생성 모드
      addCalendar({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isVisible: formData.isVisible
      });
    }
    
    resetForm();
  };

  const handleEdit = (calendar: Calendar) => {
    setEditingCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description || '',
      color: calendar.color,
      isVisible: calendar.isVisible
    });
    setIsCreating(true);
  };

  const handleDelete = (calendar: Calendar) => {
    if (calendar.isDefault) {
      alert('기본 캘린더는 삭제할 수 없습니다.');
      return;
    }
    
    if (confirm(`'${calendar.name}' 캘린더를 삭제하시겠습니까?
이 캘린더의 모든 일정이 함께 삭제됩니다.`)) {
      deleteCalendar(calendar.id);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCloseAllCalendars = () => {
    setOpenCalendars([]);
    
    // 모든 독립 캘린더 세션 제거 이벤트 발생
    const event = new CustomEvent('clear-all-independent-calendars');
    window.dispatchEvent(event);
  };

  const handleOpenCalendar = (calendarId: string) => {
    if (!openCalendars.includes(calendarId)) {
      setOpenCalendars(prev => [...prev, calendarId]);
      
      // 독립 캘린더 세션 생성 이벤트 발생
      const calendar = state.calendars.find(c => c.id === calendarId);
      if (calendar) {
        const event = new CustomEvent('open-independent-calendar', { detail: calendar });
        window.dispatchEvent(event);
      }
    }
  };

  const handleCloseCalendar = (calendarId: string) => {
    setOpenCalendars(prev => prev.filter(id => id !== calendarId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col" aria-describedby="calendar-management-modal-description">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            캘린더 관리
          </DialogTitle>
          <DialogDescription id="calendar-management-modal-description">
            여러 캘린더를 생성하고 관리하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 새 캘린더 추가 버튼 */}
          {!isCreating && (
            <div className="flex-shrink-0 pb-4">
              <Button 
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 캘린더 만들기
              </Button>
            </div>

          {/* 캘린더 생성/편집 폼 */}
          {isCreating && (
            <div className="flex-shrink-0 p-4 bg-muted/30 rounded-lg mb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {editingCalendar ? '캘린더 편집' : '새 캘린더'}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-muted-foreground"
                  >
                    취소
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">이름</label>
                  <Input
                    placeholder="캘린더 이름"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">설명 (선택사항)</label>
                  <Textarea
                    placeholder="캘린더 설명"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">색상</label>
                  <div className="flex gap-2 flex-wrap">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                        style={{ 
                          backgroundColor: color,
                          borderColor: formData.color === color ? '#000' : 'transparent'
                        }}
                        onClick={() => setFormData({ ...formData, color })}
                      >
                        {formData.color === color && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">표시</label>
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingCalendar ? '수정' : '생성'}
                </Button>
              </form>
            </div>
          )}

          {/* 캘린더 목록 */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>내 캘린더 ({state.calendars.length}개)</span>
                </div>
                {(openCalendars.length > 0 || getSessionCalendarIds().length > 0) && (
                  <div className="flex items-center gap-4">
                    {getSessionCalendarIds().length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-blue-600">{getSessionCalendarIds().length}개 세션</span>
                      </div>
                    )}
                    {openCalendars.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">{openCalendars.length}개 임시</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {state.calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="group flex items-center gap-3 p-3 bg-card hover:bg-accent/50 rounded-lg transition-colors border cursor-pointer relative"
                    style={{ borderLeftColor: calendar.color, borderLeftWidth: '4px' }}
                    onClick={() => handleOpenCalendar(calendar.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{calendar.name}</p>
                        {calendar.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            기본
                          </span>
                        )}
                        {state.currentCalendarId === calendar.id && (
                          <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
                            현재
                          </span>
                        )}
                        {getSessionCalendarIds().includes(calendar.id) && (
                          <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full">
                            세션
                          </span>
                        )}
                        {openCalendars.includes(calendar.id) && (
                          <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">
                            임시
                          </span>
                        )}
                      </div>
                      {calendar.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {calendar.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        생성일: {calendar.createdAt.toLocaleDateString()}
                        {getSessionCalendarIds().includes(calendar.id) && (
                          <span className="ml-2 text-blue-600">• 세션 저장됨</span>
                        )}
                        {openCalendars.includes(calendar.id) && (
                          <span className="ml-2 text-green-600">• 임시 실행 중</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* 새 캘린더 열기 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCalendar(calendar.id);
                        }}
                        className="h-8 w-8 p-0"
                        title={
                          getSessionCalendarIds().includes(calendar.id) 
                            ? "세션으로 저장됨" 
                            : openCalendars.includes(calendar.id) 
                            ? "임시로 열린 상태" 
                            : "독립 실행"
                        }
                        disabled={openCalendars.includes(calendar.id)}
                      >
                        <ExternalLink className={`h-3 w-3 ${ 
                          getSessionCalendarIds().includes(calendar.id) 
                            ? 'text-blue-600' 
                            : openCalendars.includes(calendar.id) 
                            ? 'text-green-600' 
                            : ''
                        }`} />
                      </Button>

                      {/* 표시/숨김 토글 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCalendarVisibility(calendar.id);
                        }}
                        className="h-8 w-8 p-0"
                        title={calendar.isVisible ? '숨기기' : '표시하기'}
                      >
                        {calendar.isVisible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>

                      {/* 현재 캘린더로 설정 */}
                      {state.currentCalendarId !== calendar.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCalendar(calendar.id);
                          }}
                          className="h-8 w-8 p-0"
                          title="현재 캘린더로 설정"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}

                      {/* 편집 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(calendar);
                        }}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      {/* 삭제 버튼 */}
                      {!calendar.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(calendar);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 하단 버튼 */}
          <div className="flex-shrink-0 space-y-2">
            {openCalendars.length > 0 && (
              <Button 
                onClick={handleCloseAllCalendars} 
                variant="destructive" 
                size="sm"
                className="w-full"
              >
                임시 캘린더 닫기 ({openCalendars.length}개)
              </Button>
            )}
            <Button onClick={handleClose} variant="outline" className="w-full">
              관리 창 닫기
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Independent Calendar Views - 임시로 열린 것들 (세션에 저장되지 않음) */}
      {openCalendars.map(calendarId => {
        const calendar = state.calendars.find(c => c.id === calendarId);
        if (!calendar) return null;
        
        return (
          <IndependentCalendarView
            key={`temp-${calendarId}`}
            calendar={calendar}
            isOpen={true}
            onClose={() => handleCloseCalendar(calendarId)}
          />
        );
      })}
    </Dialog>
  );
};

export default CalendarManagementModal;
