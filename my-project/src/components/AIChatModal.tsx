"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Bot, Paperclip, Plus, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCalendar } from '../contexts/CalendarContext';
import type { Event } from '../types/calendar';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: File[];
  eventProposal?: Event;
  isLoading?: boolean;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const { addEvent } = useCalendar();
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "안녕하세요! ANT TOGETHER AI 어시스턴트입니다. 일정 관리를 도와드릴게요. 예를 들어 '내일 오후 2시에 팀 회의 일정 추가해줘' 라고 말씀해 주세요!",
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const detectEventRequest = (text: string): boolean => {
    const eventKeywords = [
      '일정', '약속', '회의', '미팅', '스케줄', '예약', 
      'event', 'meeting', 'appointment', 'schedule',
      '추가해줘', '만들어줘', '생성해줘', '등록해줘'
    ];
    return eventKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  };

  const generateEventFromText = (text: string): Event => {
    const today = new Date();
    const targetDate = new Date(today);
    
    // 날짜 추출 로직
    if (text.includes('내일')) {
      targetDate.setDate(today.getDate() + 1);
    } else if (text.includes('모레')) {
      targetDate.setDate(today.getDate() + 2);
    } else if (text.includes('다음주')) {
      targetDate.setDate(today.getDate() + 7);
    } else {
      targetDate.setDate(today.getDate() + 1);
    }

    // 시간 추출 로직
    let time = '14:00';
    let endTime = '15:00';
    
    if (text.includes('오전') || text.includes('AM')) {
      time = '10:00';
      endTime = '11:00';
    } else if (text.includes('오후') || text.includes('PM')) {
      time = '14:00';
      endTime = '15:00';
    } else if (text.includes('저녁')) {
      time = '18:00';
      endTime = '19:00';
    }

    // 제목 생성 로직
    let title = '새로운 일정';
    if (text.includes('회의') || text.includes('meeting')) {
      title = '팀 회의';
    } else if (text.includes('미팅')) {
      title = '클라이언트 미팅';
    } else if (text.includes('약속')) {
      title = '중요한 약속';
    } else if (text.includes('운동')) {
      title = '운동';
    } else if (text.includes('식사') || text.includes('점심') || text.includes('저녁')) {
      title = '식사 약속';
    }

    return {
      id: Date.now().toString(),
      title,
      date: targetDate,
      startTime: time,
      endTime,
      category: 'work',
      description: `AI가 생성한 일정: ${text}`,
      isAllDay: false,
      reminder: 15,
      color: '#000000',
      calendarId: 'default'
    };
  };

  const handleSendMessage = () => {
    if (message.trim() || attachedFiles.length > 0) {
      const userMessage: ChatMessage = {
        id: Date.now(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
        attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined
      };
      
      setMessages(prev => [...prev, userMessage]);
      const userText = message.trim();
      setMessage('');
      setAttachedFiles([]);
      
      // 새 메시지 전송 시 강제로 맨 아래로 스크롤
      setIsUserScrolling(false);
      setIsAtBottom(true);
      
      // 일정 생성 요청인지 확인
      const isEventRequest = detectEventRequest(userText);
      
      if (isEventRequest) {
        // 로딩 메시지 추가
        const loadingMessage: ChatMessage = {
          id: Date.now() + 1,
          text: "일정을 생성하고 있습니다...",
          sender: 'ai',
          timestamp: new Date(),
          isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        // 일정 생성 후 승인 요청
        setTimeout(() => {
          const generatedEvent = generateEventFromText(userText);
          const eventProposalMessage: ChatMessage = {
            id: Date.now() + 2,
            text: "다음 일정을 캘린더에 추가하시겠습니까?",
            sender: 'ai',
            timestamp: new Date(),
            eventProposal: generatedEvent
          };
          
          setMessages(prev => prev.filter(msg => !msg.isLoading).concat([eventProposalMessage]));
        }, 2000);
      } else {
        // 일반 AI 응답
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const responses = [
            "네, 도와드리겠습니다! 어떤 일정을 추가하고 싶으신가요?",
            "궁금한 점이 있으시면 언제든지 말씀해 주세요.",
            "일정 관리와 관련해서 더 필요한 도움이 있다면 알려주세요!",
            "이해했습니다. 다른 도움이 필요하시면 말씀해 주세요."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const aiResponse: ChatMessage = {
            id: Date.now() + 1,
            text: randomResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1500);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  

  const handleAddEvent = (event: Event) => {
    setMessages(prev => prev.map(msg => 
      msg.eventProposal?.id === event.id 
        ? { ...msg, text: "일정이 성공적으로 추가되었습니다! ✅", eventProposal: undefined, isLoading: false }
        : msg
    ));
    addEvent(event);
  };

  const handleSkipEvent = (eventId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.eventProposal?.id === eventId 
        ? { ...msg, text: "일정 추가를 건너뛰었습니다.", eventProposal: undefined }
        : msg
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // 스크롤 핸들러 - 사용자가 스크롤하고 있는지 감지
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // 맨 아래에 있는지 확인 (약간의 여유를 둠)
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsAtBottom(atBottom);
    
    // 사용자가 스크롤 중인지 감지
    setIsUserScrolling(!atBottom);
  };

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // 전체 문서에 터치 스크롤 방지
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      
      return () => {
        // 모달이 닫힐 때 원래 상태로 복원
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.touchAction = '';
        
        // 스크롤 위치 복원
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 (사용자가 스크롤하고 있지 않을 때만)
  useEffect(() => {
    // 사용자가 위쪽을 보고 있다면 자동 스크롤하지 않음
    if (isUserScrolling && !isAtBottom) {
      return;
    }
    
    if (messagesEndRef.current) {
      // requestAnimationFrame을 사용해서 더 안정적으로 스크롤
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      });
    }
  }, [messages, isTyping, isUserScrolling, isAtBottom]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className="w-[90vw] max-w-md sm:max-w-lg md:max-w-xl h-[100dvh] sm:h-[80vh] m-0 p-0 border bg-background overflow-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl z-50 [&>button]:hidden"
        style={{ 
          overscrollBehavior: 'contain',
          touchAction: 'manipulation',
          height: 'min(100dvh, 80vh)', // 디바이스 화면 높이에 맞춰 고정
          pointerEvents: 'auto'
        }}
        aria-describedby="ai-chat-modal-description"
        onPointerDownOutside={(e: any) => e.preventDefault()} // 외부 클릭 시 배경 스크롤 방지
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>AI 채팅</DialogTitle>
          <DialogDescription id="ai-chat-modal-description">AI 어시스턴트와 채팅하며 일정을 관리할 수 있습니다.</DialogDescription>
        </VisuallyHidden>

        {/* 최상위 프레임 - 디바이스 화면 높이 고정, Vertical scrolling */}
        <div className="h-full flex flex-col" style={{ overflowY: 'auto' }}>

        {/* 헤더 */}
        <div 
          className="flex items-center justify-between py-3 px-4 bg-background border-b border-border flex-shrink-0"
          style={{ touchAction: 'none' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-background" />
            </div>
            <h2 className="text-sm font-medium text-foreground">AI 어시스턴트</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* MessagesList - Fill container, Clip content ON, Vertical scrolling */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-muted/30"
          style={{ 
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            minHeight: 0 // flex-1이 제대로 작동하도록
          }}
          onScroll={handleScroll}
        >
          <div className="p-4 pb-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* 아바타 - 크기 줄임 */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-foreground' 
                    : 'bg-muted border border-border'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-3 h-3 text-background" />
                  ) : (
                    <Bot className="w-3 h-3 text-foreground" />
                  )}
                </div>

                {/* 메시지 버블 */}
                <div className={`flex flex-col gap-1 max-w-[70%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.isLoading ? (
                    <div className="bg-background rounded-2xl px-3 py-2 shadow-sm border border-border">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-foreground" />
                        <span className="text-sm text-foreground">{msg.text}</span>
                      </div>
                    </div>
                  ) : msg.eventProposal ? (
                    <div className="bg-background rounded-2xl p-3 shadow-sm border border-border min-w-[260px]">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">일정 제안</span>
                      </div>
                      
                      <div className="bg-muted rounded-xl p-3 mb-3">
                        <h4 className="font-medium text-foreground mb-1">{msg.eventProposal.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{new Date(msg.eventProposal.date).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{msg.eventProposal.startTime} - {msg.eventProposal.endTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddEvent(msg.eventProposal!)}
                          className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-xl h-8 text-sm"
                        >
                          일정 추가
                        </Button>
                        <Button
                          onClick={() => handleSkipEvent(msg.eventProposal!.id)}
                          variant="outline"
                          className="flex-1 rounded-xl h-8 text-sm"
                        >
                          건너뛰기
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-2xl px-3 py-2 max-w-fit ${
                      msg.sender === 'user' 
                        ? 'bg-foreground text-background' 
                        : 'bg-background text-foreground border border-border'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      
                      {/* 첨부파일 */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((file, index) => (
                            <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${
                              msg.sender === 'user' ? 'bg-background/20' : 'bg-muted'
                            }`}>
                              <Paperclip className="w-3 h-3" />
                              <span className="text-xs truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 타임스탬프 */}
                  {!msg.isLoading && (
                    <span className={`text-xs text-muted-foreground px-2 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-muted border border-border rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-foreground" />
                </div>
                <div className="bg-background rounded-2xl px-3 py-2 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* InputBar - MessagesList 바깥, Fix position when scrolling, 화면 하단 고정 */}
        <div 
          className="flex-shrink-0 px-4 py-3 bg-black border-t border-border mt-auto"
          style={{ 
            touchAction: 'none'
          }}
        >
          {/* 첨부파일 미리보기 */}
          {attachedFiles.length > 0 && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground truncate max-w-32">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 입력 바 */}
          <div className="flex items-end gap-2">
            {/* 첨부 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0 hover:bg-muted rounded-full flex-shrink-0"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            {/* 메시지 입력 */}
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  // 포커스 시 스크롤 방지
                  e.preventDefault();
                  setTimeout(() => {
                    // 메시지 영역을 맨 아래로 스크롤 (키보드가 올라온 후)
                    messagesEndRef.current?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'end'
                    });
                  }, 300);
                }}
                placeholder="메시지를 입력하세요..."
                className="resize-none rounded-2xl border-border focus:border-foreground focus:ring-1 focus:ring-foreground min-h-[2rem] bg-background"
                style={{ 
                  fontSize: '16px' // iOS에서 zoom 방지
                }}
              />
            </div>
            
            {/* 전송 버튼 */}
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() && attachedFiles.length === 0}
              className="h-8 w-8 p-0 rounded-full bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground flex-shrink-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AIChatModal;