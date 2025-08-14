"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  Users,
  Hash,
  Globe,
  Sparkles,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { useCalendar } from '../contexts/CalendarContext';
import type { Calendar } from '../types/calendar';
import { toast } from 'sonner';

interface CalendarManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalendarFormData {
  name: string;
  description: string;
  color: string;
  isVisible: boolean;
  isShared: boolean;
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
    
     
  } = useCalendar();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [formData, setFormData] = useState<CalendarFormData>({
    name: '',
    description: '',
    color: predefinedColors[0],
    isVisible: true,
    isShared: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: predefinedColors[0],
      isVisible: true,
      isShared: false
    });
    setIsCreating(false);
    setEditingCalendar(null);
  };

  // 공유 코드 생성 함수
  const generateShareCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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
      const calendarData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isVisible: formData.isVisible
      };

      // 공유 캘린더인 경우 추가 속성 설정
      if (formData.isShared) {
        (calendarData as any).isShared = true;
        (calendarData as any).code = generateShareCode();
        (calendarData as any).members = 1;
      }

      addCalendar(calendarData);
      
      // 성공 메시지 표시
      if (formData.isShared) {
        toast.success(`공유 캘린더 '${formData.name}'이 생성되었습니다! 공유 코드: ${(calendarData as any).code}`, {
          duration: 5000,
        });
      } else {
        toast.success(`캘린더 '${formData.name}'이 생성되었습니다!`);
      }
    }
    
    resetForm();
  };

  const handleEdit = (calendar: Calendar) => {
    setEditingCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description || '',
      color: calendar.color,
      isVisible: calendar.isVisible,
      isShared: (calendar as any).isShared || false
    });
    setIsCreating(true);
  };

  const handleDelete = (calendar: Calendar) => {
    if (calendar.isDefault) {
      alert('기본 캘린더는 삭제할 수 없습니다.');
      return;
    }
    
    if (confirm(`'${calendar.name}' 캘린더를 삭제하시겠습니까?\n이 캘린더의 모든 일정이 함께 삭제됩니다.`)) {
      deleteCalendar(calendar.id);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOpenCalendar = (calendarId: string) => {
    // 캘린더 뷰 페이지로 이동하는 이벤트 발생
    const calendar = state.calendars.find(c => c.id === calendarId);
    if (calendar) {
      // 공유 캘린더인지 확인하고 적절한 이벤트 발생
      if ((calendar as any).isShared) {
        const event = new CustomEvent('navigate-shared-calendar-view', { detail: calendar });
        window.dispatchEvent(event);
      } else {
        const event = new CustomEvent('navigate-calendar-view', { detail: calendar });
        window.dispatchEvent(event);
      }
      
      // 모달 닫기
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-gray-900 border-0 shadow-2xl" aria-describedby="calendar-management-modal-description">
        <DialogHeader className="flex-shrink-0 pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <CalendarIcon className="w-5 h-5" />
            </div>
            캘린더 관리
          </DialogTitle>
          <DialogDescription id="calendar-management-modal-description" className="text-gray-600 dark:text-gray-400 mt-2">
            여러 캘린더를 생성하고 관리하세요. 캘린더를 클릭하면 전체 화면으로 열립니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6">
          {/* 새 캘린더 추가 버튼 */}
          {!isCreating && (
            <div className="flex-shrink-0">
              <Button 
                onClick={() => setIsCreating(true)}
                className="w-full h-12 flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                새 캘린더 만들기
              </Button>
            </div>
          )}

          {/* 캘린더 생성/편집 폼 */}
          {isCreating && (
            <div className="flex-shrink-0 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {editingCalendar ? (
                      <>
                        <Edit className="w-4 h-4" />
                        캘린더 편집
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        새 캘린더
                      </>
                    )}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    취소
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">캘린더 이름</label>
                  <Input
                    placeholder="예: 개인 일정, 업무 캘린더"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 rounded-xl border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">설명 (선택사항)</label>
                  <Textarea
                    placeholder="캘린더에 대한 간단한 설명을 입력하세요"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white transition-colors resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">테마 색상</label>
                  <div className="flex gap-3 flex-wrap">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg"
                        style={{ 
                          backgroundColor: color,
                          borderColor: formData.color === color ? '#000' : 'transparent',
                          boxShadow: formData.color === color ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'
                        }}
                        onClick={() => setFormData({ ...formData, color })}
                      >
                        {formData.color === color && (
                          <Check className="w-5 h-5 text-white drop-shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <CalendarIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">캘린더 표시</label>
                  </div>
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, isVisible: checked })}
                  />
                </div>

                {/* 공유 캘린더 선택 */}
                {!editingCalendar && (
                  <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                          <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">공유 캘린더로 생성</label>
                          <p className="text-xs text-gray-600 dark:text-gray-400">다른 사람들과 함께 사용할 수 있습니다</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.isShared}
                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, isShared: checked })}
                      />
                    </div>
                    {formData.isShared && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <span>4자리 공유 코드가 자동으로 생성됩니다</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <span>코드를 공유하여 다른 사람을 초대할 수 있습니다</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <span>모든 멤버가 일정을 추가하고 편집할 수 있습니다</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  {editingCalendar ? '수정 완료' : (formData.isShared ? '공유 캘린더 생성' : '캘린더 생성')}
                </Button>
              </form>
            </div>
          )}

          {/* 캘린더 목록 */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* 일반 캘린더 섹션 */}
              {(() => {
                const regularCalendars = state.calendars.filter(cal => !(cal as any).isShared);
                return regularCalendars.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">내 캘린더</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{regularCalendars.length}개의 개인 캘린더</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {regularCalendars.map((calendar) => (
                        <div
                          key={calendar.id}
                          className="group relative p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
                          onClick={() => handleOpenCalendar(calendar.id)}
                        >
                          {/* 색상 스트라이프 */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                            style={{ backgroundColor: calendar.color }}
                          />

                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div 
                                  className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm" 
                                  style={{ backgroundColor: calendar.color }}
                                />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{calendar.name}</h4>
                                <div className="flex items-center gap-2">
                                  {calendar.isDefault && (
                                    <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium">
                                      기본
                                    </span>
                                  )}
                                  {state.currentCalendarId === calendar.id && (
                                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                                      현재
                                    </span>
                                  )}
                                </div>
                              </div>
                              {calendar.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                  {calendar.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                생성일: {calendar.createdAt.toLocaleDateString('ko-KR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* 편집 버튼 */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleEdit(calendar);
                                }}
                                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                title="편집"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>

                              {/* 삭제 버튼 */}
                              {!calendar.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleDelete(calendar);
                                  }}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                  title="삭제"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* 공유 캘린더 섹션 */}
              {(() => {
                const sharedCalendars = state.calendars.filter(cal => (cal as any).isShared);
                return sharedCalendars.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                      <div className="p-2 rounded-lg bg-gray-900 dark:bg-gray-100">
                        <Users className="w-4 h-4 text-white dark:text-gray-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">공유 캘린더</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sharedCalendars.length}개의 협업 캘린더</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sharedCalendars.map((calendar) => (
                        <div
                          key={calendar.id}
                          className="group relative p-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-50 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-50 dark:hover:to-white rounded-2xl border border-gray-700 dark:border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/5"
                          onClick={() => handleOpenCalendar(calendar.id)}
                        >
                          {/* 특별한 배경 패턴 */}
                          <div className="absolute top-2 right-2 opacity-10">
                            <Hash className="w-6 h-6 text-white dark:text-gray-900" />
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <Hash className="w-4 h-4 text-white dark:text-gray-900" />
                                <h4 className="font-semibold text-white dark:text-gray-900 truncate">{calendar.name}</h4>
                                <span className="text-xs px-2 py-1 bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-900 rounded-full font-medium flex items-center gap-1">
                                  <Users className="w-2.5 h-2.5" />
                                  공유
                                </span>
                                {state.currentCalendarId === calendar.id && (
                                  <span className="text-xs px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full font-medium">
                                    현재
                                  </span>
                                )}
                              </div>
                              {calendar.description && (
                                <p className="text-sm text-gray-300 dark:text-gray-600 line-clamp-2 mb-3">
                                  {calendar.description}
                                </p>
                              )}
                              <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                                <p>생성일: {calendar.createdAt.toLocaleDateString('ko-KR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" />
                                    <span className="font-mono font-medium text-white dark:text-gray-900">
                                      {(calendar as any).code}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    <span>{(calendar as any).members || 1}명 참여</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* 편집 버튼 */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleEdit(calendar);
                                }}
                                className="h-8 w-8 p-0 text-white dark:text-gray-900 hover:bg-white/20 dark:hover:bg-gray-900/20 rounded-lg"
                                title="편집"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>

                              {/* 삭제 버튼 */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleDelete(calendar);
                                }}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                                title="삭제"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
              
              {/* 캘린더가 없을 때 안내 메시지 */}
              {state.calendars.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 inline-block mb-4">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    아직 캘린더가 없습니다
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    위의 버튼을 눌러 첫 번째 캘린더를 만들어보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarManagementModal;