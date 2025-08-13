import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, Users, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  scheduleData?: {
    conflicts: number;
    duplicates: number;
    optimizations: number;
  };
}

interface CommunityCalendarChatbotProps {
  calendarId: string;
  calendarName: string;
  memberCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const CommunityCalendarChatbot: React.FC<CommunityCalendarChatbotProps> = ({
  calendarId,
  calendarName,
  memberCount,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 초기 메시지 설정
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: 'initial',
        type: 'bot',
        content: `안녕하세요! 저는 "${calendarName}" 커뮤니티의 일정 관리 AI입니다. 🤖\n\n${memberCount}명의 멤버들이 함께 사용하는 일정들을 분석하고 최적화하는 것을 도와드릴게요.`,
        timestamp: new Date(),
        suggestions: [
          '일정 충돌 검사하기',
          '중복 일정 찾기',
          '최적 시간대 추천받기',
          '멤버별 일정 현황 보기'
        ],
        scheduleData: {
          conflicts: Math.floor(Math.random() * 5) + 1,
          duplicates: Math.floor(Math.random() * 3),
          optimizations: Math.floor(Math.random() * 8) + 2
        }
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, calendarName, memberCount, messages.length]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI 응답 생성
  const generateAIResponse = (userMessage: string): ChatMessage => {
    const responses = {
      '일정 충돌': {
        content: `📊 일정 충돌 분석 결과입니다:\n\n• 이번 주 충돌 일정: 3개\n• 가장 많이 충돌하는 시간대: 오후 2-4시\n• 영향받는 멤버: 5명\n\n💡 해결 방안을 제시해드릴까요?`,
        suggestions: ['해결 방안 보기', '대안 시간 추천받기', '멤버에게 알림 보내기']
      },
      '중복 일정': {
        content: `🔍 중복 일정 검사 완료:\n\n• 발견된 중복: 2개\n  - "팀 미팅" (3월 15일, 3월 16일)\n  - "프로젝트 리뷰" (3월 20일 중복 등록)\n\n자동으로 통합하시겠어요?`,
        suggestions: ['자동 통합하기', '수동으로 선택하기', '나중에 하기']
      },
      '최적 시간': {
        content: `⏰ 멤버들의 최적 시간대 분석:\n\n🟢 추천 시간대:\n• 화요일 오전 10-12시 (참여 가능: 8/10명)\n• 목요일 오후 3-5시 (참여 가능: 9/10명)\n\n🔴 피해야 할 시간:\n• 월요일 오전 (회의 집중)\n• 금요일 오후 (업무 마감)`,
        suggestions: ['이 시간으로 일정 잡기', '다른 시간대 보기', '개인별 현황 확인']
      },
      'default': {
        content: `죄송합니다. 아직 해당 요청을 처리할 수 없습니다. 😅\n\n다음과 같은 도움을 드릴 수 있어요:\n• 일정 충돌 분석\n• 중복 일정 정리\n• 최적 시간대 추천\n• 멤버 참여도 분석`,
        suggestions: ['일정 충돌 검사하기', '중복 일정 찾기', '최적 시간대 추천받기']
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    let responseKey = 'default';
    
    if (lowerMessage.includes('충돌')) responseKey = '일정 충돌';
    else if (lowerMessage.includes('중복')) responseKey = '중복 일정';
    else if (lowerMessage.includes('시간') || lowerMessage.includes('추천')) responseKey = '최적 시간';

    const response = responses[responseKey as keyof typeof responses];
    
    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = generateAIResponse(messageContent);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 제안 클릭 처리
  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = generateAIResponse(suggestion);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-8 pb-4 px-4">
      <div className="w-full max-w-md h-[calc(100vh-6rem)] max-h-[600px]">
        <Card className="w-full h-full bg-gray-900 border-gray-700 overflow-hidden flex flex-col shadow-2xl">
          {/* 헤더 - 고정 */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">AI 일정 도우미</h3>
                <p className="text-xs text-gray-400">{calendarName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          {/* 상태 정보 - 고정 */}
          <div className="flex-shrink-0 p-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-blue-400">
                <Users className="w-3 h-3" />
                <span>{memberCount}명</span>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>활성</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <AlertCircle className="w-3 h-3" />
                <span>3개 알림</span>
              </div>
            </div>
          </div>

          {/* 메시지 영역 - 스크롤 가능한 영역 */}
          <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {/* 일정 데이터 표시 */}
                    {message.scheduleData && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            충돌 {message.scheduleData.conflicts}개
                          </Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            중복 {message.scheduleData.duplicates}개
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            최적화 가능 {message.scheduleData.optimizations}개
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* 제안 버튼들 */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full justify-start text-xs h-7 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 하단 여백 추가 */}
              <div className="h-4" />
              
              {/* 스크롤 앵커 */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>

          {/* 입력 영역 - 하단 완전 고정 */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="일정 관리에 대해 물어보세요..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityCalendarChatbot;