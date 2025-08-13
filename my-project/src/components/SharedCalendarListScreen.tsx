import React, { useState } from 'react';
import { Calendar, Users, Search, Filter, Plus, Share2, Lock, Globe, Sparkles, ArrowRight, Clock, Hash, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';

import CommunityCalendarChatbot from './CommunityCalendarChatbot';
import CalendarSharingModal from './CalendarSharingModal';

interface SharedCalendar {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: number;
  maxMembers: number;
  isPublic: boolean;
  category: string;
  color: string;
  lastActivity: string;
  eventsCount: number;
  image?: string;
  code?: string;
  isOwnedByMe?: boolean;
  createdAt?: Date;
}

interface SharedCalendarListScreenProps {
  onNavigateToAI: () => void;
}

const SharedCalendarListScreen: React.FC<SharedCalendarListScreenProps> = ({ onNavigateToAI }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [joinedCommunityCalendars, setJoinedCommunityCalendars] = useState<SharedCalendar[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [selectedCalendarForChat, setSelectedCalendarForChat] = useState<SharedCalendar | null>(null);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [selectedCalendarForSharing, setSelectedCalendarForSharing] = useState<SharedCalendar | null>(null);

  // 가입한 커뮤니티 캘린더 로드
  React.useEffect(() => {
    const saved = localStorage.getItem('antogether_joined_shared_calendars');
    if (saved) {
      setJoinedCommunityCalendars(JSON.parse(saved));
    }
  }, []);

  // 내가 소유한 공유 캘린더들
  const mySharedCalendars: SharedCalendar[] = [
    {
      id: 'my-1',
      name: '내 공유 캘린더',
      description: '가족과 함께 사용하는 개인 공유 캘린더입니다.',
      owner: '나',
      members: 4,
      maxMembers: 8,
      isPublic: false,
      category: '개인',
      color: '#EF4444',
      lastActivity: '방금 전',
      eventsCount: 15,
      image: '👨‍👩‍👧‍👦',
      code: 'ABC1',
      isOwnedByMe: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'my-2',
      name: '팀 워크스페이스',
      description: '우리 팀만의 프로젝트 관리 캘린더',
      owner: '나',
      members: 6,
      maxMembers: 10,
      isPublic: false,
      category: '업무',
      color: '#3B82F6',
      lastActivity: '1시간 전',
      eventsCount: 32,
      image: '💼',
      code: 'DEF2',
      isOwnedByMe: true,
      createdAt: new Date('2024-02-01')
    }
  ];



  const categories = ['all', '개인', '업무', '행사', '교육', '지역', '비즈니스', '기술', '의료'];

  // 커뮤니티 공유 캘린더 (가입 가능한 외부 캘린더들)
  const communitySharedCalendars: SharedCalendar[] = [
    {
      id: 'comm-1',
      name: '강남 러닝 크루',
      description: '매주 토요일 아침 한강에서 함께 러닝하는 크루입니다. 초보자부터 마라토너까지 환영!',
      owner: '김러너',
      members: 24,
      maxMembers: 30,
      isPublic: true,
      category: '지역',
      color: '#10B981',
      lastActivity: '2시간 전',
      eventsCount: 8,
      image: '🏃‍♂️',
      code: 'RUN1',
      isOwnedByMe: false,
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'comm-2',
      name: '요리 동호회',
      description: '맛있는 요리를 함께 만들고 레시피를 공유하는 모임입니다.',
      owner: '셰프박',
      members: 15,
      maxMembers: 20,
      isPublic: true,
      category: '개인',
      color: '#F59E0B',
      lastActivity: '30분 전',
      eventsCount: 12,
      image: '👨‍🍳',
      code: 'COOK',
      isOwnedByMe: false,
      createdAt: new Date('2024-02-05')
    },
    {
      id: 'comm-3',
      name: '프론트엔드 개발자 모임',
      description: 'React, Vue, Angular 등 프론트엔드 기술을 공유하고 스터디하는 모임',
      owner: '코드마스터',
      members: 45,
      maxMembers: 50,
      isPublic: true,
      category: '기술',
      color: '#8B5CF6',
      lastActivity: '1시간 전',
      eventsCount: 18,
      image: '💻',
      code: 'FE01',
      isOwnedByMe: false,
      createdAt: new Date('2024-01-10')
    }
  ];

  // 모든 공유 캘린더 (내 캘린더 + 가입한 커뮤니티 캘린더)
  const allSharedCalendars = [...mySharedCalendars, ...joinedCommunityCalendars];

  const filteredMyCalendars = mySharedCalendars.filter(calendar => {
    const matchesSearch = calendar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         calendar.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || calendar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCommunityCalendars = joinedCommunityCalendars.filter(calendar => {
    const matchesSearch = calendar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         calendar.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || calendar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 가입 가능한 커뮤니티 캘린더 필터링 (이미 가입한 것은 제외)
  const filteredAvailableCalendars = communitySharedCalendars.filter(calendar => {
    const isAlreadyJoined = joinedCommunityCalendars.some(joined => joined.id === calendar.id);
    const matchesSearch = calendar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         calendar.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || calendar.category === selectedCategory;
    return !isAlreadyJoined && matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '개인': 'bg-red-100 text-red-800',
      '업무': 'bg-blue-100 text-blue-800',
      '행사': 'bg-green-100 text-green-800',
      '교육': 'bg-purple-100 text-purple-800',
      '지역': 'bg-orange-100 text-orange-800',
      '비즈니스': 'bg-blue-100 text-blue-800',
      '기술': 'bg-purple-100 text-purple-800',
      '의료': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // 내 공유 캘린더 클릭 핸들러
  const handleMyCalendarClick = (calendar: SharedCalendar) => {
    const sharedCalendarData = {
      id: calendar.id,
      name: calendar.name,
      color: calendar.color,
      description: calendar.description,
      isVisible: true,
      isDefault: false,
      createdAt: calendar.createdAt || new Date(),
      code: calendar.code || '',
      members: calendar.members
    };
    
    // 공유 캘린더 뷰 화면으로 이동하는 이벤트 발생
    const navigateEvent = new CustomEvent('navigate-shared-calendar-view', {
      detail: sharedCalendarData
    });
    window.dispatchEvent(navigateEvent);
  };

  // 챗봇 열기 핸들러
  const handleOpenChatbot = (calendar: SharedCalendar) => {
    setSelectedCalendarForChat(calendar);
    setIsChatbotOpen(true);
  };

  // 공유 모달 열기 핸들러
  const handleOpenSharingModal = (calendar: SharedCalendar) => {
    setSelectedCalendarForSharing(calendar);
    setIsSharingModalOpen(true);
  };

  // 커뮤니티 캘린더 가입 핸들러
  const handleJoinCommunityCalendar = (calendar: SharedCalendar) => {
    if (calendar.members >= calendar.maxMembers) {
      alert('이 캘린더는 인원이 가득 찼습니다.');
      return;
    }

    // 가입한 커뮤니티 캘린더 목록에 추가
    const updatedCalendar = {
      ...calendar,
      members: calendar.members + 1 // 멤버 수 증가
    };
    const updatedCommunityCalendars = [...joinedCommunityCalendars, updatedCalendar];
    setJoinedCommunityCalendars(updatedCommunityCalendars);
    localStorage.setItem('antogether_joined_shared_calendars', JSON.stringify(updatedCommunityCalendars));

    // 커뮤니티 캘린더 가입 이벤트 발생 (캘린더 컨텍스트에 공유 캘린더로 추가)
    const communityCalendarData = {
      id: calendar.id,
      name: calendar.name,
      description: `${calendar.description} (공유 캘린더)`,
      color: calendar.color,
      code: calendar.code,
      members: calendar.members + 1,
      type: 'shared',
      category: calendar.category,
      image: calendar.image
    };

    const joinEvent = new CustomEvent('community-calendar-join', {
      detail: communityCalendarData
    });
    window.dispatchEvent(joinEvent);

    // 가입 후 바로 해당 캘린더 화면으로 이동
    const sharedCalendarData = {
      id: calendar.id,
      name: calendar.name,
      color: calendar.color,
      description: calendar.description,
      isVisible: true,
      isDefault: false,
      createdAt: calendar.createdAt || new Date(),
      code: calendar.code || '',
      members: calendar.members + 1
    };
    
    const navigateEvent = new CustomEvent('navigate-shared-calendar-view', {
      detail: sharedCalendarData
    });
    window.dispatchEvent(navigateEvent);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* AI 추천 버튼 - 상단에 고정 */}
      <div className="px-4 py-4 border-b border-gray-800">
        <Button
          onClick={onNavigateToAI}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 h-12 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">AI 추천</div>
              <div className="text-xs text-purple-200">맞춤형 캘린더 및 이벤트 추천</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="캘린더 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? '전체' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* 내 공유 캘린더 리스트 */}
      <div className="px-4 space-y-6 pb-32">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">내 공유 캘린더</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 캘린더
            </Button>
          </div>

          {filteredMyCalendars.length > 0 ? (
            filteredMyCalendars.map((calendar) => (
              <Card 
                key={calendar.id} 
                className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => handleMyCalendarClick(calendar)}
              >
                <div className="flex items-start gap-4">
                  {/* 캘린더 아이콘 */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl relative"
                    style={{ backgroundColor: calendar.color + '20', color: calendar.color }}
                  >
                    {calendar.image || <Calendar className="w-6 h-6" />}
                    <Hash className="w-3 h-3 absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5" />
                  </div>

                  <div className="flex-1">
                    {/* 캘린더 정보 */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-medium">{calendar.name}</h3>
                      <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                        내 캘린더
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(calendar.category)}`}>
                        {calendar.category}
                      </Badge>
                      {calendar.members >= calendar.maxMembers && (
                        <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          만원
                        </Badge>
                      )}
                      {calendar.isPublic ? (
                        <Globe className="w-3 h-3 text-green-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {calendar.description}
                    </p>

                    {/* 인원 현황 프로그레스 바 */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${calendar.members >= calendar.maxMembers ? 'text-red-400' : 'text-gray-400'}`}>
                          {calendar.members}/{calendar.maxMembers}명
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            calendar.members >= calendar.maxMembers 
                              ? 'bg-red-500' 
                              : calendar.members / calendar.maxMembers > 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((calendar.members / calendar.maxMembers) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{calendar.eventsCount}개 일정</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{calendar.lastActivity}</span>
                      </div>
                      {calendar.code && (
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          <span>{calendar.code}</span>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className={
                            calendar.members >= calendar.maxMembers && !calendar.isOwnedByMe
                              ? "bg-gray-600 hover:bg-gray-700 text-white h-8 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700 text-white h-8"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (calendar.members < calendar.maxMembers || calendar.isOwnedByMe) {
                              handleMyCalendarClick(calendar);
                            }
                          }}
                          disabled={calendar.members >= calendar.maxMembers && !calendar.isOwnedByMe}
                        >
                          {calendar.members >= calendar.maxMembers && !calendar.isOwnedByMe ? '인원 만료' : '입장하기'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenChatbot(calendar);
                          }}
                          title="AI 일정 도우미"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSharingModal(calendar);
                          }}
                          title="캘린더 공유"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: calendar.color }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {searchQuery || selectedCategory !== 'all' 
                  ? '검색 결과가 없습니다.' 
                  : '아직 생성한 공유 캘린더가 없습니다.'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <p className="text-gray-500 text-sm">
                  '새 캘린더' 버튼을 눌러 첫 번째 공유 캘린더를 만들어보세요.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 가입한 커뮤니티 캘린더 섹션 */}
        {joinedCommunityCalendars.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">가입한 커뮤니티 캘린더</h2>
              <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                {joinedCommunityCalendars.length}개
              </Badge>
            </div>

            {filteredCommunityCalendars.length > 0 ? (
              filteredCommunityCalendars.map((calendar) => (
                <Card 
                  key={calendar.id} 
                  className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handleMyCalendarClick(calendar)}
                >
                  <div className="flex items-start gap-4">
                    {/* 캘린더 아이콘 */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl relative"
                      style={{ backgroundColor: calendar.color + '20', color: calendar.color }}
                    >
                      {calendar.image || <Calendar className="w-6 h-6" />}
                      <Sparkles className="w-3 h-3 absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5" />
                    </div>

                    <div className="flex-1">
                      {/* 캘린더 정보 */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-medium">{calendar.name}</h3>
                        <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                          커뮤니티
                        </Badge>
                        <Badge className={`text-xs ${getCategoryColor(calendar.category)}`}>
                          {calendar.category}
                        </Badge>
                        {calendar.members >= calendar.maxMembers && (
                          <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                            만원
                          </Badge>
                        )}
                        <Globe className="w-3 h-3 text-green-400" />
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {calendar.description}
                      </p>

                      {/* 인원 현황 프로그레스 바 */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${calendar.members >= calendar.maxMembers ? 'text-red-400' : 'text-gray-400'}`}>
                            {calendar.members}/{calendar.maxMembers}명
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              calendar.members >= calendar.maxMembers 
                                ? 'bg-red-500' 
                                : calendar.members / calendar.maxMembers > 0.8 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((calendar.members / calendar.maxMembers) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{calendar.eventsCount}개 일정</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{calendar.lastActivity}</span>
                        </div>
                        {calendar.code && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>{calendar.code}</span>
                          </div>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className={
                              calendar.members >= calendar.maxMembers
                                ? "bg-gray-600 hover:bg-gray-700 text-white h-8 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white h-8"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calendar.members < calendar.maxMembers) {
                                handleMyCalendarClick(calendar);
                              }
                            }}
                            disabled={calendar.members >= calendar.maxMembers}
                          >
                            {calendar.members >= calendar.maxMembers ? '인원 만료' : '입장하기'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenChatbot(calendar);
                            }}
                            title="AI 일정 도우미"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSharingModal(calendar);
                            }}
                            title="캘린더 공유"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: calendar.color }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 가입 가능한 커뮤니티 캘린더 섹션 */}
        {filteredAvailableCalendars.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">가입 가능한 공유 캘린더</h2>
              <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                {filteredAvailableCalendars.length}개
              </Badge>
            </div>

            {filteredAvailableCalendars.map((calendar) => (
              <Card 
                key={calendar.id} 
                className="bg-gradient-to-r from-gray-800 to-gray-750 border-gray-600 p-4 hover:from-gray-750 hover:to-gray-700 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* 캘린더 아이콘 */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl relative"
                    style={{ backgroundColor: calendar.color + '20', color: calendar.color }}
                  >
                    {calendar.image || <Calendar className="w-6 h-6" />}
                    <Share2 className="w-3 h-3 absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5" />
                  </div>

                  <div className="flex-1">
                    {/* 캘린더 정보 */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-medium">{calendar.name}</h3>
                      <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                        공개
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(calendar.category)}`}>
                        {calendar.category}
                      </Badge>
                      {calendar.members >= calendar.maxMembers && (
                        <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          만원
                        </Badge>
                      )}
                      <Globe className="w-3 h-3 text-green-400" />
                    </div>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {calendar.description}
                    </p>

                    {/* 인원 현황 프로그레스 바 */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${calendar.members >= calendar.maxMembers ? 'text-red-400' : 'text-gray-400'}`}>
                          {calendar.members}/{calendar.maxMembers}명
                        </span>
                        <span className="text-xs text-gray-500">• 관리자: {calendar.owner}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            calendar.members >= calendar.maxMembers 
                              ? 'bg-red-500' 
                              : calendar.members / calendar.maxMembers > 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min((calendar.members / calendar.maxMembers) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{calendar.eventsCount}개 일정</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{calendar.lastActivity}</span>
                      </div>
                      {calendar.code && (
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          <span>{calendar.code}</span>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className={
                            calendar.members >= calendar.maxMembers
                              ? "bg-gray-600 hover:bg-gray-700 text-white h-8 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white h-8"
                          }
                          onClick={() => {
                            if (calendar.members < calendar.maxMembers) {
                              handleJoinCommunityCalendar(calendar);
                            }
                          }}
                          disabled={calendar.members >= calendar.maxMembers}
                        >
                          {calendar.members >= calendar.maxMembers ? '인원 만료' : '가입하기'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white h-8"
                          onClick={() => handleOpenChatbot(calendar)}
                          title="AI 일정 도우미"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: calendar.color }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>



      {/* Community Calendar Chatbot */}
      {selectedCalendarForChat && (
        <CommunityCalendarChatbot
          calendarId={selectedCalendarForChat.id}
          calendarName={selectedCalendarForChat.name}
          memberCount={selectedCalendarForChat.members}
          isOpen={isChatbotOpen}
          onClose={() => {
            setIsChatbotOpen(false);
            setSelectedCalendarForChat(null);
          }}
        />
      )}

      {/* Calendar Sharing Modal */}
      {selectedCalendarForSharing && (
        <CalendarSharingModal
          calendar={selectedCalendarForSharing}
          isOpen={isSharingModalOpen}
          onClose={() => {
            setIsSharingModalOpen(false);
            setSelectedCalendarForSharing(null);
          }}
        />
      )}
    </div>
  );
};

export default SharedCalendarListScreen;