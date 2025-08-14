"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Switch } from './ui/switch';

interface RepeatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: RepeatSettings) => void;
  initialSettings?: RepeatSettings;
}

export interface RepeatSettings {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endType: 'never' | 'count' | 'date';
  endCount?: number;
  endDate?: string;
  weekdays?: number[]; // 0-6 (Sunday-Saturday) for weekly repeats
}

const RepeatSettingsModal: React.FC<RepeatSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings
}) => {
  const [settings, setSettings] = useState<RepeatSettings>(
    initialSettings || {
      enabled: false,
      type: 'weekly',
      interval: 1,
      endType: 'never',
      weekdays: []
    }
  );

  const repeatTypeLabels = {
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
    yearly: '매년'
  };

  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleWeekdayToggle = (day: number) => {
    const weekdays = settings.weekdays || [];
    const newWeekdays = weekdays.includes(day)
      ? weekdays.filter(d => d !== day)
      : [...weekdays, day].sort();
    
    setSettings({ ...settings, weekdays: newWeekdays });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="repeat-settings-modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            반복 설정
          </DialogTitle>
          <DialogDescription id="repeat-settings-modal-description">
            일정의 반복 옵션을 설정하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable Repeat */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">반복 일정</label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled: boolean) => setSettings({ ...settings, enabled })}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Repeat Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">반복 주기</label>
                <Select
                  value={settings.type}
                  onValueChange={(type: RepeatSettings['type']) => 
                    setSettings({ ...settings, type })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(repeatTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interval */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {settings.interval}
                  {settings.type === 'daily' && '일'}
                  {settings.type === 'weekly' && '주'}
                  {settings.type === 'monthly' && '개월'}
                  {settings.type === 'yearly' && '년'}
                  마다 반복
                </label>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={settings.interval}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    interval: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                />
              </div>

              {/* Weekly Options */}
              {settings.type === 'weekly' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">반복 요일</label>
                  <div className="flex gap-1">
                    {weekdayLabels.map((label, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={settings.weekdays?.includes(index) ? "default" : "outline"}
                        size="sm"
                        className="w-10 h-10 p-0 text-xs"
                        onClick={() => handleWeekdayToggle(index)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* End Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">종료 조건</label>
                <Select
                  value={settings.endType}
                  onValueChange={(endType: RepeatSettings['endType']) => 
                    setSettings({ ...settings, endType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">무제한</SelectItem>
                    <SelectItem value="count">횟수 제한</SelectItem>
                    <SelectItem value="date">종료 날짜</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* End Count */}
              {settings.endType === 'count' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">반복 횟수</label>
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    value={settings.endCount || 1}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      endCount: Math.max(1, parseInt(e.target.value) || 1)
                    })}
                    placeholder="반복 횟수"
                  />
                </div>
              )}

              {/* End Date */}
              {settings.endType === 'date' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">종료 날짜</label>
                  <Input
                    type="date"
                    value={settings.endDate || ''}
                    onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                  />
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSave} className="flex-1">
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepeatSettingsModal;