import { useState, useEffect } from 'react';
import type { CalendarItem } from './components/CalendarSidebar';
import { CalendarSidebar } from './components/CalendarSidebar';
import { CalendarView } from './components/CalendarView';

import { Community } from './components/Community';
import { PostDetailView } from './components/PostDetailView';
import { MobileNavigation } from './components/MobileNavigation';
import { AddEventDialog } from './components/AddEventDialog';
import { DayEventsDialog } from './components/DayEventsDialog';
import { AuthScreen } from './components/AuthScreen';
import { SignupScreen } from './components/SignupScreen';
import { RegularSignupForm } from './components/RegularSignupForm';
import { FeaturePanel } from './components/FeaturePanel';
import type { FeaturePanelProps } from './components/FeaturePanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Menu, Bot } from 'lucide-react';
import { getCommunityPosts, createCommunityComment } from './api';

interface Event {
  id: string;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  color: string;
  calendarId: string;
  images?: string[]; // 이벤트 이미지 URL 배열
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  isPinned: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  announcementId: string;
}

interface SelectedCommunityState {
  id: string;
  name: string;
}

type AuthView = 'login' | 'signup' | 'regular-signup';

export default function App() {
  // Force dark theme on app initialization
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const [currentView, setCurrentView] = useState<'calendar' | 'community' | 'post-detail' | 'chat'>('calendar');
  const [mobileView, setMobileView] = useState<'calendar' | 'chat'>('calendar');
  const [selectedCommunity, setSelectedCommunity] = useState<SelectedCommunityState | null>(null);
  const [selectedPost, setSelectedPost] = useState<Announcement | null>(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(false);
  const [isFeaturePanelOpen, setIsFeaturePanelOpen] = useState(false);
  
  // 캘린더 데이터 상태
  const [calendars, setCalendars] = useState<CalendarItem[]>([
    {
      id: '1',
      name: '게임 스케줄',
      purpose: '게임',
      color: 'rgb(176, 224, 230)', // 파우더블루
      isActive: true,
      memberCount: 12
    },
    {
      id: '2',
      name: '운동 계획',
      purpose: '운동',
      color: 'rgb(189, 236, 182)', // 민트그린
      isActive: false,
      memberCount: 5
    }
  ]);
  
  // 각 캘린더별 독립적인 현재 날짜 상태
  const [calendarDates, setCalendarDates] = useState<{ [key: string]: Date }>({
    '1': new Date(), // 게임 스케줄
    '2': new Date()  // 운동 계획
  });

  // 이벤트 다이얼로그 상태들
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDayEventsOpen, setIsDayEventsOpen] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<Date | null>(null);

  // 이벤트 데이터 상태
  const [events, setEvents] = useState<Event[]>([
    // 게임 스케줄 일정들
    {
      id: '1',
      title: '팀 게임 대회',
      content: '월간 팀 토너먼트 참가',
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 0, 15),
      startTime: '20:00',
      endTime: '23:00',
      color: 'rgb(176, 224, 230)', // 파우더블루
      calendarId: '1'
    },
    {
      id: '3',
      title: '게임 스트리밍',
      content: '신작 게임 첫 플레이 스트리밍',
      startDate: new Date(2025, 0, 20),
      endDate: new Date(2025, 0, 20),
      startTime: '19:00',
      endTime: '21:00',
      color: 'rgb(221, 191, 255)', // 라벤더
      calendarId: '1'
    },
    {
      id: '4',
      title: '온라인 토너먼트',
      content: '시즌 마지막 토너먼트',
      startDate: new Date(2025, 0, 25),
      endDate: new Date(2025, 0, 26),
      startTime: '21:00',
      endTime: '02:00',
      color: 'rgb(135, 206, 235)', // 스카이블루
      calendarId: '1'
    },
    {
      id: '5',
      title: '게임 리뷰 미팅',
      content: '팀원들과 전략 논의',
      startDate: new Date(2025, 0, 28),
      endDate: new Date(2025, 0, 28),
      startTime: '18:30',
      endTime: '20:00',
      color: 'rgb(173, 216, 230)', // 베이비블루
      calendarId: '1'
    },
    // 운동 계획 일정들
    {
      id: '2',
      title: '운동 모임',
      content: '주간 그룹 운동 세션',
      startDate: new Date(2025, 0, 18),
      endDate: new Date(2025, 0, 18),
      startTime: '18:00',
      endTime: '19:30',
      color: 'rgb(189, 236, 182)', // 민트그린
      calendarId: '2'
    },
    {
      id: '6',
      title: '주말 등산',
      content: '북한산 등반',
      startDate: new Date(2025, 0, 22),
      endDate: new Date(2025, 0, 22),
      startTime: '08:00',
      endTime: '17:00',
      color: 'rgb(197, 225, 197)', // 세이지민트
      calendarId: '2'
    },
    {
      id: '7',
      title: '헬스장 PT',
      content: '개인 트레이너 세션',
      startDate: new Date(2025, 0, 24),
      endDate: new Date(2025, 0, 24),
      startTime: '19:00',
      endTime: '20:00',
      color: 'rgb(192, 242, 233)', // 소프트민트
      calendarId: '2'
    },
    {
      id: '8',
      title: '수영 레슨',
      content: '자유형 기술 향상',
      startDate: new Date(2025, 0, 26),
      endDate: new Date(2025, 0, 26),
      startTime: '10:00',
      endTime: '11:00',
      color: 'rgb(255, 182, 193)', // 베이비핑크
      calendarId: '2'
    }
  ]);

  // 커뮤니티 게시글 및 댓글 데이터
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getCommunityPosts();
        setAnnouncements(posts);
        // Comments should be fetched for each post, or the API should return them with the posts
        // For now, I will assume comments are not fetched here.
      } catch (error) {
        toast.error('게시글을 불러오는데 실패했습니다.');
      }
    };

    if (currentView === 'community' || currentView === 'post-detail') {
        fetchPosts();
    }
  }, [currentView]);

  // 인증 관련 핸들러들
  const handleLogin = (email: string, password: string) => {
    // 실제 구현에서는 서버 API 호출
    console.log('로그인:', { email, password });
    setUser({ email, name: email.split('@')[0] });
    setIsAuthenticated(true);
    toast.success('로그인되었습니다!');
  };

  const handleSocialLogin = (provider: 'naver' | 'kakao' | 'google' | 'apple') => {
    // 실제 구현에서는 소셜 로그인 API 연동
    console.log('소셜 로그인:', provider);
    const providerNames = {
      naver: '네이버',
      kakao: '카카오',
      google: '구글',
      apple: '애플'
    };
    setUser({ email: `user@${provider}.com`, name: `${providerNames[provider]} 사용자` });
    setIsAuthenticated(true);
    toast.success(`${providerNames[provider]} 로그인되었습니다!`);
  };

  const handleSocialSignup = (provider: 'naver' | 'kakao' | 'google' | 'apple') => {
    // 실제 구현에서는 소셜 회원가입 API 연동
    console.log('소셜 회원가입:', provider);
    const providerNames = {
      naver: '네이버',
      kakao: '카카오',
      google: '구글',
      apple: '애플'
    };
    setUser({ email: `newuser@${provider}.com`, name: `${providerNames[provider]} 사용자` });
    setIsAuthenticated(true);
    toast.success(`${providerNames[provider]} 계정으로 가입되었습니다!`);
  };

  const handleRegularSignup = (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => {
    // 실제 구현에서는 서버 API 호출
    console.log('일반 회원가입:', data);
    setUser({ email: data.email, name: data.name });
    setIsAuthenticated(true);
    toast.success('회원가입이 완료되었습니다!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthView('login');
    toast.success('로그아웃되었습니다.');
  };

  // 인증되지 않은 상태에서 인증 화면 렌더링
  if (!isAuthenticated) {
    switch (authView) {
      case 'login':
        return (
          <AuthScreen
            onLogin={handleLogin}
            onSocialLogin={handleSocialLogin}
            onShowSignup={() => setAuthView('signup')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onSocialSignup={handleSocialSignup}
            onShowRegularSignup={() => setAuthView('regular-signup')}
            onBack={() => setAuthView('login')}
          />
        );
      case 'regular-signup':
        return (
          <RegularSignupForm
            onSignup={handleRegularSignup}
            onBack={() => setAuthView('signup')}
          />
        );
      default:
        return null;
    }
  }

  // 기존 캘린더 앱 로직 (인증 후)
  const handleCalendarClick = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setCurrentView('calendar');
    setIsCalendarsOpen(false);
  };

  const handleCommunityClick = (calendarId: string) => {
    const calendar = calendars.find(cal => cal.id === calendarId);
    
    setSelectedCommunity({
      id: calendarId,
      name: calendar?.name || '알 수 없는 캘린더'
    });
    setCurrentView('community');
    setIsCalendarsOpen(false);
    // 모바일에서 커뮤니티 접근 시 캘린더 뷰로 설정 (커뮤니티는 오버레이로 표시)
    setMobileView('calendar');
  };

  const handlePostClick = (announcement: Announcement) => {
    setSelectedPost(announcement);
    setCurrentView('post-detail');
  };

  const handleBackToCommunity = () => {
    setSelectedPost(null);
    setCurrentView('community');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
    setSelectedCommunity(null);
    setSelectedPost(null);
    setMobileView('calendar');
  };

  const handleBackToCalendarList = () => {
    setSelectedCalendarId(null);
    setCurrentView('calendar');
  };

  const handleDateChange = (calendarId: string, newDate: Date) => {
    setCalendarDates(prev => ({
      ...prev,
      [calendarId]: newDate
    }));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDateForEvent(date);
    
    // 해당 날짜에 이벤트가 있는지 확인
    const eventsOnDate = selectedCalendarId ? getEventsForDate(date, selectedCalendarId) : [];
    
    if (eventsOnDate.length > 0) {
      // 이벤트가 있으면 이벤트 보기 다이얼로그 열기
      setIsDayEventsOpen(true);
    } else {
      // 이벤트가 없으면 바로 이벤트 추가 다이얼로그 열기
      setIsAddEventOpen(true);
    }
  };

  const handleAddNewEventFromDayView = () => {
    setIsDayEventsOpen(false);
    setIsAddEventOpen(true);
  };

  // 특정 날짜의 이벤트 가져오기 (시작일과 종료일 사이의 날짜 포함)
  const getEventsForDate = (date: Date, calendarId: string) => {
    return events.filter(event => {
      if (event.calendarId !== calendarId) return false;
      
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const targetDate = new Date(date);
      
      // 시간 정보를 제거하고 날짜만 비교
      eventStartDate.setHours(0, 0, 0, 0);
      eventEndDate.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      
      return targetDate >= eventStartDate && targetDate <= eventEndDate;
    });
  };

  const handleCreateCalendar = (newCalendar: CalendarItem) => {
    setCalendars(prev => [...prev, newCalendar]);
    // 새 캘린더 생성 후 자동으로 해당 캘린더로 이동
    setSelectedCalendarId(newCalendar.id);
    setCurrentView('calendar');
    setIsCalendarsOpen(false);
    
    // 새 캘린더의 현재 날짜 설정
    setCalendarDates(prev => ({
      ...prev,
      [newCalendar.id]: new Date()
    }));
  };

  const handleDeleteCalendar = (calendarId: string) => {
    // 캘린더 목록에서 제거
    setCalendars(prev => prev.filter(cal => cal.id !== calendarId));
    
    // 해당 캘린더의 모든 이벤트 제거
    setEvents(prev => prev.filter(event => event.calendarId !== calendarId));
    
    // 해당 캘린더의 날짜 상태 제거
    setCalendarDates(prev => {
      const newDates = { ...prev };
      delete newDates[calendarId];
      return newDates;
    });
    
    // 현재 선택된 캘린더가 삭제되는 경우 처리
    if (selectedCalendarId === calendarId) {
      setSelectedCalendarId(null);
      setCurrentView('calendar');
    }
    
    // 현재 커뮤니티가 삭제되는 캘린더인 경우 처리
    if (selectedCommunity?.id === calendarId) {
      setSelectedCommunity(null);
      setCurrentView('calendar');
    }
  };

  const handleAddEvent = (eventData: Parameters<NonNullable<FeaturePanelProps['onAddEvent']>>[0]) => {
    if (!selectedCalendarId) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title,
      content: eventData.content,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      color: eventData.color,
      calendarId: selectedCalendarId,
      images: eventData.images
    };

    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleUpdateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...updatedEvent }
        : event
    ));
  };

  // 커뮤니티 관련 핸들러들
  const handleAddComment = async (announcementId: string, content: string) => {
    try {
      const response = await createCommunityComment(announcementId, content);
      const newComment: Comment = {
        id: response.comment_id.toString(),
        content,
        author: user?.name || '나',
        timestamp: new Date(),
        announcementId
      };
      setComments(prev => [...prev, newComment]);
      toast.success('댓글이 추가되었습니다.');
    } catch (error) {
      toast.error('댓글 추가에 실패했습니다.');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    toast.success('댓글이 삭제되었습니다.');
  };

  // 선택된 캘린더의 이벤트만 필터링
  const getEventsForCalendar = (calendarId: string) => {
    return events.filter(event => event.calendarId === calendarId);
  };

  

  

  const handleMobileViewChange = (view: 'calendar' | 'chat') => {
    setMobileView(view);
    // 모바일에서는 커뮤니티 뷰를 직접 접근하지 않으므로 커뮤니티 상태 정리
    if (view === 'calendar') {
      setSelectedCommunity(null);
    }
  };

  const renderMobileView = () => {
    // 게시글 상세 뷰가 선택된 경우
    if (currentView === 'post-detail' && selectedPost && selectedCommunity) {
      return (
        <PostDetailView
          announcement={selectedPost}
          comments={comments.filter(comment => comment.announcementId === selectedPost.id)}
          calendarName={selectedCommunity.name}
          onBack={handleBackToCommunity}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      );
    }

    // 커뮤니티가 선택된 경우 커뮤니티 화면 표시 (사이드바에서 접근)
    if (selectedCommunity && currentView === 'community') {
      return (
        <Community 
          calendarId={selectedCommunity.id}
          calendarName={selectedCommunity.name}
          announcements={announcements}
          comments={comments}
          onBack={handleBackToCalendar}
          onPostClick={handlePostClick}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      );
    }

    switch (mobileView) {
      case 'calendar':
        return selectedCalendarId ? (
          <CalendarView 
            calendarId={selectedCalendarId}
            calendarName={calendars.find(cal => cal.id === selectedCalendarId)?.name}
            currentDate={calendarDates[selectedCalendarId]}
            events={getEventsForCalendar(selectedCalendarId)}
            onDateChange={(newDate) => handleDateChange(selectedCalendarId, newDate)}
            onDateClick={handleDateClick}
            onBackToList={handleBackToCalendarList}
            onDeleteEvent={handleDeleteEvent}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
            <div className="text-center text-muted-foreground max-w-sm mx-auto">
              <h3 className="mb-2 font-bold text-[20px] text-[16px]">캘린더를 선택해주세요</h3>
              <p className="text-sm">하단의 "내 캘린더"를 눌러<br />캘린더를 선택하여 일정을 확인하세요.</p>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-muted-foreground">
              {/* AI 일정 도우미 아이콘 */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="mb-2">일정 관리 봇</h3>
              <p className="text-sm mb-4">AI가 도와주는 스마트한 일정 관리를 경험해보세요.</p>
              <Button onClick={() => setIsFeaturePanelOpen(true)}>
                일정 관리 봇 열기
              </Button>
            </div>
          </div>
        );
      default:
        return <CalendarView />;
    }
  };

  // 게시글 상세 뷰가 활성화된 경우 전체 화면으로 렌더링
  if (currentView === 'post-detail' && selectedPost && selectedCommunity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PostDetailView
          announcement={selectedPost}
          comments={comments.filter(comment => comment.announcementId === selectedPost.id)}
          calendarName={selectedCommunity.name}
          onBack={handleBackToCommunity}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
        <Toaster />
      </div>
    );
  }

  // 커뮤니티 뷰가 활성화된 경우 전체 화면으로 렌더링
  if (currentView === 'community' && selectedCommunity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Community 
          calendarId={selectedCommunity.id}
          calendarName={selectedCommunity.name}
          announcements={announcements}
          comments={comments}
          onBack={handleBackToCalendar}
          onPostClick={handlePostClick}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        <CalendarSidebar 
          onCommunityClick={handleCommunityClick} 
          onCalendarClick={handleCalendarClick}
          onCreateCalendar={handleCreateCalendar}
          onDeleteCalendar={handleDeleteCalendar}
          calendars={calendars}
          user={user}
          onLogout={handleLogout}
        />
        {currentView === 'calendar' ? (
          selectedCalendarId ? (
            <CalendarView 
              calendarId={selectedCalendarId}
              calendarName={calendars.find(cal => cal.id === selectedCalendarId)?.name}
              currentDate={calendarDates[selectedCalendarId]}
              events={getEventsForCalendar(selectedCalendarId)}
              onDateChange={(newDate) => handleDateChange(selectedCalendarId, newDate)}
              onDateClick={handleDateClick}
              onBackToList={handleBackToCalendarList}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <h3 className="mb-2">캘린더를 선택해주세요</h3>
                <p className="text-sm">좌측 사이드바에서 캘린더를 선택하면 해당 캘린더의 일정을 확인할 수 있습니다.</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-muted-foreground">
              <h3 className="mb-2">선택된 뷰가 없습니다</h3>
              <p className="text-sm">좌측 사이드바에서 캘린더나 커뮤니티를 선택해주세요.</p>
            </div>
          </div>
        )}

        {/* 기능 패널 버튼 - 우상단 작은 버튼 */}
        <Button
          onClick={() => setIsFeaturePanelOpen(true)}
          className="hidden lg:flex fixed top-16 right-4 h-12 w-12 bg-transparent hover:bg-transparent text-black hover:text-gray-700 transition-colors duration-200 z-40 items-center justify-center border-0 shadow-none"
          title="추가 기능 (일정 관리 봇, 설정 등)"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col flex-1 lg:hidden">
        <main className="flex-1 pb-6 overflow-hidden min-h-0">
          {renderMobileView()}
        </main>
        
        <MobileNavigation 
          currentView={mobileView}
          onViewChange={handleMobileViewChange}
          onCalendarsClick={() => setIsCalendarsOpen(true)}
          onFeaturesClick={() => setIsFeaturePanelOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Calendar Sidebar Sheet */}
      <Sheet open={isCalendarsOpen} onOpenChange={setIsCalendarsOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm p-0" aria-describedby={undefined}>
          <SheetHeader className="sr-only">
            <SheetTitle>캘린더 관리</SheetTitle>
            <SheetDescription>
              캘린더를 선택하고 커뮤니티에 참여하거나 새 캘린더를 만들 수 있습니다.
            </SheetDescription>
          </SheetHeader>
          <CalendarSidebar 
            onCommunityClick={handleCommunityClick} 
            onCalendarClick={handleCalendarClick}
            onCreateCalendar={handleCreateCalendar}
            onDeleteCalendar={handleDeleteCalendar}
            calendars={calendars}
            user={user}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* Day Events Dialog */}
      {selectedCalendarId && selectedDateForEvent && (
        <DayEventsDialog
          open={isDayEventsOpen}
          onOpenChange={setIsDayEventsOpen}
          selectedDate={selectedDateForEvent}
          events={getEventsForDate(selectedDateForEvent, selectedCalendarId)}
          calendarId={selectedCalendarId}
          onAddNewEvent={handleAddNewEventFromDayView}
          onDeleteEvent={handleDeleteEvent}
          onUpdateEvent={handleUpdateEvent}
        />
      )}

      {/* Add Event Dialog */}
      {selectedCalendarId && (
        <AddEventDialog
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          selectedDate={selectedDateForEvent}
          calendarId={selectedCalendarId}
          onAddEvent={handleAddEvent}
        />
      )}

      {/* Feature Panel */}
      <FeaturePanel 
        open={isFeaturePanelOpen}
        onOpenChange={setIsFeaturePanelOpen}
        currentCalendarId={selectedCalendarId || undefined}
        calendars={calendars}
        onAddEvent={handleAddEvent}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
