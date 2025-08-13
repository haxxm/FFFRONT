import React, { useState } from 'react';
import { Users, MessageSquare, Calendar, Settings, Search, Bell, Plus, TrendingUp, Star, Clock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface PopularPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  board: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isHot: boolean;
}

interface QuickMenu {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  color: string;
}

export default function CommunityScreen() {
  const [selectedTab, setSelectedTab] = useState<'popular' | 'recent' | 'my'>('popular');

  // 네비게이션 함수들
  const navigateToBoards = () => {
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'boards' } }));
  };

  const navigateToAIRecommend = () => {
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'ai-recommend' } }));
  };

  const navigateToEventCalendar = () => {
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'event-calendar' } }));
  };

  const navigateToSharedCalendar = () => {
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'shared-calendar' } }));
  };

  const navigateToMenu = () => {
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'menu' } }));
  };

  // 샘플 데이터
  const popularPosts: PopularPost[] = [
    {
      id: '1',
      title: '이번 주말 등산 모임 어떠세요?',
      author: '등산왕김철수',
      authorAvatar: '/api/placeholder/32/32',
      board: '운동모임',
      likes: 24,
      comments: 12,
      timeAgo: '2시간 전',
      isHot: true
    },
    {
      id: '2',
      title: '새로운 카페 추천드려요!',
      author: '카페마니아',
      authorAvatar: '/api/placeholder/32/32',
      board: '정보공유',
      likes: 18,
      comments: 8,
      timeAgo: '4시간 전',
      isHot: false
    },
    {
      id: '3',
      title: '다음 주 회식 장소 투표해주세요',
      author: '팀장님',
      authorAvatar: '/api/placeholder/32/32',
      board: '자유게시판',
      likes: 31,
      comments: 15,
      timeAgo: '1일 전',
      isHot: true
    }
  ];

  const quickMenus: QuickMenu[] = [
    {
      id: '1',
      name: '게시판',
      icon: <MessageSquare className="w-6 h-6" />,
      description: '다양한 주제의 게시판',
      action: navigateToBoards,
      color: '#FFE4EB'
    },
    {
      id: '2',
      name: 'AI 추천',
      icon: <Star className="w-6 h-6" />,
      description: 'AI가 추천하는 콘텐츠',
      action: navigateToAIRecommend,
      color: '#DFF6FF'
    },
    {
      id: '3',
      name: '행사 캘린더',
      icon: <Calendar className="w-6 h-6" />,
      description: '커뮤니티 행사 일정',
      action: navigateToEventCalendar,
      color: '#F3E8FF'
    },
    {
      id: '4',
      name: '공유 캘린더',
      icon: <Users className="w-6 h-6" />,
      description: '멤버들과 일정 공유',
      action: navigateToSharedCalendar,
      color: '#E8F5E8'
    }
  ];

  const handlePostClick = (post: PopularPost) => {
    console.log('게시글 클릭:', post.title);
    window.dispatchEvent(new CustomEvent('community-navigate', { detail: { page: 'post-detail' } }));
  };

  const handleCreatePost = () => {
    console.log('새 게시글 작성');
    // 게시글 작성 로직 추가 예정
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 환영 섹션 */}
      <div className="px-4 py-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-medium">안녕하세요! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">오늘도 활발한 커뮤니티 활동을 시작해보세요</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToMenu}
            className="h-8 w-8 p-0 text-white hover:bg-gray-800"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-blue-400">2.3K</div>
            <div className="text-xs text-gray-400">총 멤버</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-green-400">156</div>
            <div className="text-xs text-gray-400">온라인</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-yellow-400">42</div>
            <div className="text-xs text-gray-400">새 글</div>
          </div>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="px-4 py-4 border-b border-gray-800">
        <h2 className="text-lg font-medium mb-3">빠른 메뉴</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickMenus.map((menu) => (
            <Card 
              key={menu.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
              onClick={menu.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-800"
                      style={{ backgroundColor: menu.color }}
                    >
                      {menu.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{menu.name}</h3>
                      <p className="text-xs text-gray-400">{menu.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 인기 게시글 섹션 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">인기 게시글</h2>
          <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('popular')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTab === 'popular' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              인기
            </button>
            <button
              onClick={() => setSelectedTab('recent')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTab === 'recent' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              최신
            </button>
            <button
              onClick={() => setSelectedTab('my')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTab === 'my' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              내글
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {popularPosts.map((post) => (
            <Card 
              key={post.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
              onClick={() => handlePostClick(post)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white line-clamp-1">{post.title}</h3>
                      {post.isHot && (
                        <Badge variant="destructive" className="text-xs">
                          HOT
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-400">{post.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {post.board}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={navigateToBoards}
        >
          모든 게시글 보기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* 플로팅 액션 버튼 */}
      <Button
        onClick={handleCreatePost}
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}