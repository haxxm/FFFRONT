"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Monitor, 
  Trash2, 
  RefreshCw,
  Clock,
  X,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface SessionManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IndependentCalendarSession {
  id: string;
  calendarId: string;
  calendarName: string;
  calendarColor: string;
  calendarDescription?: string;
  createdAt: string;
  instanceId: string;
}

const SessionManager: React.FC<SessionManagerProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<IndependentCalendarSession[]>([]);

  // 세션 정보 로드
  const loadSessions = () => {
    const saved = localStorage.getItem('antogether_independent_sessions');
    const loadedSessions = saved ? JSON.parse(saved) : [];
    setSessions(loadedSessions);
  };

  // 컴포넌트 마운트 시 세션 로드
  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  // 개별 세션 삭제
  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('antogether_independent_sessions', JSON.stringify(updatedSessions));
    
    // 세션 제거 이벤트 발생
    const event = new CustomEvent('close-independent-calendar', { detail: sessionId });
    window.dispatchEvent(event);
    
    toast.success('독립 캘린더 세션이 제거되었습니다.');
  };

  // 모든 세션 삭제
  const handleClearAllSessions = () => {
    if (sessions.length === 0) return;
    
    if (confirm(`${sessions.length}개의 독립 캘린더 세션을 모두 제거하시겠습니까?`)) {
      setSessions([]);
      localStorage.removeItem('antogether_independent_sessions');
      
      // 모든 세션 제거 이벤트 발생
      const event = new CustomEvent('clear-all-independent-calendars');
      window.dispatchEvent(event);
      
      toast.success('모든 독립 캘린더 세션이 제거되었습니다.');
    }
  };

  // 세션 새로고침
  const handleRefreshSessions = () => {
    loadSessions();
    toast.success('세션 정보를 새로고침했습니다.');
  };

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? '방금 전' : `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col" aria-describedby="session-manager-description">
        <DialogHeader className="sr-only">
          <DialogTitle>독립 캘린더 세션 관리</DialogTitle>
          <DialogDescription id="session-manager-description">
            저장된 독립 캘린더 세션을 관리합니다. 독립 캘린더 세션이 저장되어 브라우저 재시작 후에도 복원됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">세션 관리</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshSessions}
                className="h-8 w-8 p-0"
                title="새로고침"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            독립 캘린더 세션이 저장되어 브라우저 재시작 후에도 복원됩니다.
          </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 세션 통계 */}
          <div className="flex-shrink-0 p-4 bg-muted/30 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">활성 세션</span>
              </div>
              <Badge variant="secondary">{sessions.length}개</Badge>
            </div>
            {sessions.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                마지막 생성: {formatTime(sessions[sessions.length - 1]?.createdAt)}
              </p>
            )}
          </div>

          {/* 세션 목록 */}
          <div className="flex-1 overflow-hidden">
            {sessions.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="group flex items-start gap-3 p-3 bg-card hover:bg-accent/50 rounded-lg transition-colors border"
                      style={{ borderLeftColor: session.calendarColor, borderLeftWidth: '4px' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: session.calendarColor }}
                      >
                        <CalendarIcon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate text-foreground">
                            {session.calendarName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        {session.calendarDescription && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {session.calendarDescription}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(session.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            <span className="truncate max-w-20" title={session.instanceId}>
                              {session.instanceId.split('-').slice(-1)[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="세션 제거"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Monitor className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-2">
                  저장된 세션이 없습니다
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  캘린더 관리에서 독립 캘린더를 열면<br />
                  자동으로 세션이 저장됩니다.
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* 액션 버튼 */}
          <div className="flex-shrink-0 space-y-2">
            {sessions.length > 0 && (
              <Button
                onClick={handleClearAllSessions}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                모든 세션 제거 ({sessions.length}개)
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="w-full">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionManager;