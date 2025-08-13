import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import AIRecommendScreen from './AIRecommendScreen';
import SharedCalendarListScreen from './SharedCalendarListScreen';

type CommunityScreen = 'shared-calendars' | 'ai-recommend';

interface CommunityAppProps {
  onBackToCalendar: () => void;
}

export default function CommunityApp({ onBackToCalendar }: CommunityAppProps) {
  const [currentScreen, setCurrentScreen] = useState<CommunityScreen>('shared-calendars');

  const navigateToAI = () => {
    setCurrentScreen('ai-recommend');
  };

  const navigateToSharedCalendars = () => {
    setCurrentScreen('shared-calendars');
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'shared-calendars':
        return '공유 캘린더';
      case 'ai-recommend':
        return 'AI 추천';
      default:
        return '커뮤니티';
    }
  };

  const getHeaderIcon = () => {
    switch (currentScreen) {
      case 'shared-calendars':
        return <Share2 className="w-5 h-5 text-blue-400" />;
      case 'ai-recommend':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Share2 className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleBack = () => {
    if (currentScreen === 'ai-recommend') {
      navigateToSharedCalendars();
    } else {
      onBackToCalendar();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 공통 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-10 w-10 p-0 text-white bg-gray-800/50 hover:bg-gray-700 hover:text-blue-400 transition-colors rounded-full border border-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            {getHeaderIcon()}
            <span className="text-lg font-medium">{getHeaderTitle()}</span>
          </div>
        </div>

      </div>
      
      {/* 화면별 콘텐츠 */}
      <div className="flex-1">
        {currentScreen === 'shared-calendars' && (
          <SharedCalendarListScreen onNavigateToAI={navigateToAI} />
        )}
        {currentScreen === 'ai-recommend' && (
          <AIRecommendScreen />
        )}
      </div>
    </div>
  );
}