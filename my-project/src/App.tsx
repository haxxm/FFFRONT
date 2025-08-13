import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import SignupFormScreen from './components/SignupFormScreen';
import HeaderV3 from './components/HeaderV3';
import CalendarV2 from './components/CalendarV2';
import BottomPanelV2 from './components/BottomPanelV2';
import CommunityApp from './components/CommunityApp';
import CalendarViewScreen from './components/CalendarViewScreen';
import SharedCalendarViewScreen from './components/SharedCalendarViewScreen';

import { CalendarProvider } from './contexts/CalendarContext';
import { Toaster } from './components/ui/sonner';

type Screen = 'login' | 'signup' | 'signup-form' | 'app' | 'community' | 'calendar-view' | 'shared-calendar-view';

interface SignupFormData {
  username: string;
  password: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | '';
  email: string;
  phone: string;
  verificationCode: string;
}

interface CalendarViewData {
  id: string;
  name: string;
  color: string;
  description?: string;
  isVisible: boolean;
  isDefault: boolean;
  createdAt: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarViewData | null>(null);
  const [selectedSharedCalendar, setSelectedSharedCalendar] = useState<CalendarViewData & { code: string; members: number } | null>(null);

  // 로그인 상태 확인 (localStorage에서 복원)
  useEffect(() => {
    const savedUser = localStorage.getItem('antogether_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen('app');
    }

    // 로그아웃 이벤트 리스너 추가
    const handleLogout = () => {
      setUser(null);
      setCurrentScreen('login');
      localStorage.removeItem('antogether_user');
      localStorage.removeItem('antogether_events');
      localStorage.removeItem('antogether_dark_mode');
      localStorage.removeItem('antogether_calendars');
      localStorage.removeItem('antogether_current_calendar');
      document.documentElement.classList.remove('dark');
    };

    // 커뮤니티 화면 이동 이벤트 리스너 추가
    const handleCommunityNavigate = () => {
      setCurrentScreen('community');
    };

    // 캘린더 뷰 화면 이동 이벤트 리스너 추가
    const handleCalendarViewNavigate = (event: any) => {
      const calendar = event.detail;
      setSelectedCalendar(calendar);
      setCurrentScreen('calendar-view');
    };

    // 공유 캘린더 뷰 화면 이동 이벤트 리스너 추가
    const handleSharedCalendarViewNavigate = (event: any) => {
      const sharedCalendar = event.detail;
      setSelectedSharedCalendar(sharedCalendar);
      setCurrentScreen('shared-calendar-view');
    };

    // 뒤로가기 이벤트 리스너 추가
    const handleBackToCalendar = () => {
      setCurrentScreen('app');
      setSelectedCalendar(null);
      setSelectedSharedCalendar(null);
    };

    // 커뮤니티 캘린더 가입 이벤트 리스너 추가
    const handleCommunityCalendarJoin = (event: any) => {
      const communityCalendar = event.detail;
      
      // 커뮤니티 캘린더를 공유 캘린더로 변환
      const sharedCalendarData = {
        name: communityCalendar.name,
        description: communityCalendar.description || `${communityCalendar.name} 커뮤니티 캘린더`,
        color: communityCalendar.color || '#3B82F6',
        isVisible: true,
        isShared: true,
        code: communityCalendar.code || communityCalendar.id?.slice(0, 4).toUpperCase() || 'COMM',
        members: communityCalendar.members || 1,
        communityId: communityCalendar.id,
        communityType: communityCalendar.type // 'shared' 또는 'ai-recommend'
      };

      // CalendarContext에 공유 캘린더로 추가하는 커스텀 이벤트 발생
      const addCalendarEvent = new CustomEvent('add-shared-calendar', { 
        detail: sharedCalendarData 
      });
      window.dispatchEvent(addCalendarEvent);

      // 성공 토스트 표시 (Toast 컴포넌트가 있는 경우에만)
      try {
        // @ts-ignore
        if (window.showToast) {
          // @ts-ignore
          window.showToast({
            title: '캘린더 가입 완료!',
            description: `'${communityCalendar.name}' 캘린더가 공유 캘린더에 추가되었습니다.`,
            variant: 'success'
          });
        } else {
          alert(`'${communityCalendar.name}' 캘린더에 가입했습니다! 캘린더 관리에서 확인할 수 있습니다.`);
        }
      } catch (error) {
        alert(`'${communityCalendar.name}' 캘린더에 가입했습니다! 캘린더 관리에서 확인할 수 있습니다.`);
      }
    };

    window.addEventListener('logout', handleLogout);
    window.addEventListener('navigate-community', handleCommunityNavigate);
    window.addEventListener('navigate-calendar-view', handleCalendarViewNavigate);
    window.addEventListener('navigate-shared-calendar-view', handleSharedCalendarViewNavigate);
    window.addEventListener('navigate-back-to-calendar', handleBackToCalendar);
    window.addEventListener('community-calendar-join', handleCommunityCalendarJoin);

    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('navigate-community', handleCommunityNavigate);
      window.removeEventListener('navigate-calendar-view', handleCalendarViewNavigate);
      window.removeEventListener('navigate-shared-calendar-view', handleSharedCalendarViewNavigate);
      window.removeEventListener('navigate-back-to-calendar', handleBackToCalendar);
      window.removeEventListener('community-calendar-join', handleCommunityCalendarJoin);
    };
  }, []);

  const handleLogin = (username: string, password: string) => {
    // 실제 앱에서는 여기서 인증 API를 호출합니다
    const userData = { username };
    setUser(userData);
    setCurrentScreen('app');
    
    // 로그인 정보를 localStorage에 저장
    localStorage.setItem('antogether_user', JSON.stringify(userData));
  };

  const handleSignup = () => {
    setCurrentScreen('signup');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleSignupForm = () => {
    setCurrentScreen('signup-form');
  };

  const handleBackToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} 회원가입 클릭`);
    // 소셜 회원가입 로직은 향후 Supabase 연동 시 구현
    // 임시로 자동 로그인 처리
    const userData = { username: `${provider}_user` };
    setUser(userData);
    setCurrentScreen('app');
    localStorage.setItem('antogether_user', JSON.stringify(userData));
  };

  const handleSignupComplete = (formData: SignupFormData) => {
    console.log('회원가입 완료:', formData);
    // 실제 앱에서는 여기서 회원가입 API를 호출합니다
    const userData = { username: formData.username };
    setUser(userData);
    setCurrentScreen('app');
    localStorage.setItem('antogether_user', JSON.stringify(userData));
  };

  // 캘린더로 돌아가기 핸들러
  const handleBackToCalendar = () => {
    setCurrentScreen('app');
    setSelectedCalendar(null);
    setSelectedSharedCalendar(null);
  };

  // 화면별 렌더링
  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen 
        onBack={handleBackToLogin}
        onSocialSignup={handleSocialSignup}
        onSignupForm={handleSignupForm}
      />
    );
  }

  if (currentScreen === 'signup-form') {
    return (
      <SignupFormScreen 
        onBack={handleBackToSignup}
        onSignup={handleSignupComplete}
      />
    );
  }

  // 커뮤니티 앱 화면 표시
  if (currentScreen === 'community') {
    return (
      <div className="min-h-screen bg-black">
        <CommunityApp onBackToCalendar={handleBackToCalendar} />
      </div>
    );
  }

  // 캘린더 뷰 화면 표시
  if (currentScreen === 'calendar-view' && selectedCalendar) {
    return (
      <CalendarProvider>
        <div className="min-h-screen bg-background">
          <CalendarViewScreen 
            calendar={selectedCalendar}
          />
          <Toaster />
        </div>
      </CalendarProvider>
    );
  }

  // 공유 캘린더 뷰 화면 표시
  if (currentScreen === 'shared-calendar-view' && selectedSharedCalendar) {
    return (
      <CalendarProvider>
        <div className="min-h-screen bg-background">
          <SharedCalendarViewScreen 
            calendar={selectedSharedCalendar}
          />
          <Toaster />
        </div>
      </CalendarProvider>
    );
  }

  // 로그인된 경우 캘린더 앱 V2 표시
  return (
    <CalendarProvider>
      <div className="min-h-screen bg-background flex flex-col transition-colors duration-200">
        {/* Header V3 */}
        <HeaderV3 />
        
        {/* Calendar V2 */}
        <CalendarV2 />
        
        {/* Bottom Panel V2 */}
        <BottomPanelV2 />
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </CalendarProvider>
  );
}