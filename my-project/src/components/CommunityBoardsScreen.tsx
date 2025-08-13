import React, { useState } from 'react';
import { ArrowLeft, Users, Search, Bell, Grid3X3, List, Plus, TrendingUp, MessageSquare, Eye, ThumbsUp, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardContent } from './ui/card';

interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  postCount: number;
  todayPostCount: number;
  color: string;
  category: '일반' | '취미' | '정보' | '질문';
  isHot: boolean;
  lastActivity: string;
}

export default function CommunityBoardsScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'members'>('popular');

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('community-back'));
  };

  const sampleBoards: Board[] = [
    {
      id: '1',
      name: '자유게시판',
      description: '자유롭게 이야기하는 공간',
      icon: '💬',
      memberCount: 1234,
      postCount: 567,
      todayPostCount: 23,
      color: '#FFE4EB',
      category: '일반',
      isHot: true,
      lastActivity: '방금 전'
    },
    {
      id: '2',
      name: '질문과 답변',
      description: '궁금한 것들을 물어보세요',
      icon: '❓',
      memberCount: 892,
      postCount: 234,
      todayPostCount: 12,
      color: '#DFF6FF',
      category: '질문',
      isHot: true,
      lastActivity: '5분 전'
    },
    {
      id: '3',
      name: '취미공유',
      description: '취미를 공유하고 함께해요',
      icon: '🎨',
      memberCount: 567,
      postCount: 123,
      todayPostCount: 8,
      color: '#F3E8FF',
      category: '취미',
      isHot: false,
      lastActivity: '1시간 전'
    },
    {
      id: '4',
      name: '정보공유',
      description: '유용한 정보를 나누어요',
      icon: '📚',
      memberCount: 789,
      postCount: 345,
      todayPostCount: 15,
      color: '#E8F5E8',
      category: '정보',
      isHot: true,
      lastActivity: '30분 전'
    },
    {
      id: '5',
      name: '일정공유',
      description: '일정과 이벤트를 공유하세요',
      icon: '📅',
      memberCount: 456,
      postCount: 89,
      todayPostCount: 4,
      color: '#FFF4E6',
      category: '정보',
      isHot: false,
      lastActivity: '2시간 전'
    },
    {
      id: '6',
      name: '운동모임',
      description: '함께 운동하실 분들 모여요',
      icon: '🏃‍♂️',
      memberCount: 234,
      postCount: 67,
      todayPostCount: 7,
      color: '#F0F8FF',
      category: '취미',
      isHot: false,
      lastActivity: '45분 전'
    }
  ];

  const sortedBoards = [...sampleBoards].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.postCount - a.postCount;
      case 'recent':
        return new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
      case 'members':
        return b.memberCount - a.memberCount;
      default:
        return 0;
    }
  });

  const handleBoardClick = (board: Board) => {
    console.log('게시판 클릭:', board.name);
    // 게시판 상세 페이지로 이동하는 로직 추가 예정
  };

  const handleCreatePost = () => {
    console.log('새 게시글 작성');
    // 게시글 작성 모달 또는 페이지로 이동하는 로직 추가 예정
  };

  const renderBoardCard = (board: Board) => (
    <Card 
      key={board.id}
      className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
      onClick={() => handleBoardClick(board)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: board.color }}
            >
              {board.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{board.name}</h3>
                {board.isHot && (
                  <Badge variant="destructive" className="text-xs">
                    HOT
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{board.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>멤버 {board.memberCount.toLocaleString()}</span>
          <span>게시글 {board.postCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
            {board.category}
          </Badge>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              오늘 {board.todayPostCount}
            </span>
            <span>{board.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBoardList = (board: Board) => (
    <div 
      key={board.id}
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
      onClick={() => handleBoardClick(board)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: board.color }}
          >
            {board.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white">{board.name}</h3>
              {board.isHot && (
                <Badge variant="destructive" className="text-xs">
                  HOT
                </Badge>
              )}
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                {board.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{board.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {board.memberCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {board.postCount}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 text-blue-400">
              <TrendingUp className="w-3 h-3" />
              오늘 {board.todayPostCount}
            </span>
            <span>{board.lastActivity}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
          >
            <option value="popular">인기순</option>
            <option value="recent">최근순</option>
            <option value="members">멤버순</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="ghost"
            className="flex flex-col items-center gap-1 p-3 h-auto bg-gray-900/50 hover:bg-gray-800 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-medium">2.3K</span>
            <span className="text-xs text-gray-400">총 멤버</span>
          </Button>
          <Button 
            variant="ghost"
            className="flex flex-col items-center gap-1 p-3 h-auto bg-gray-900/50 hover:bg-gray-800 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-green-400" />
            <span className="text-lg font-medium">1.2K</span>
            <span className="text-xs text-gray-400">총 게시글</span>
          </Button>
          <Button 
            variant="ghost"
            className="flex flex-col items-center gap-1 p-3 h-auto bg-gray-900/50 hover:bg-gray-800 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-medium">69</span>
            <span className="text-xs text-gray-400">오늘 활동</span>
          </Button>
        </div>
      </div>

      {/* 게시판 목록 */}
      <div className="px-4 space-y-3 pb-24">
        {sortedBoards.map((board) => 
          viewMode === 'grid' ? renderBoardCard(board) : renderBoardList(board)
        )}
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