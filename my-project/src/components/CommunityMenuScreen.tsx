import React from 'react';
import { ArrowLeft, User, Menu, Search, Bell, Plus, Edit3, MessageSquare, Bookmark, Flame, Trophy } from 'lucide-react';
import { Button } from './ui/button';

const CommunityMenuScreen: React.FC = () => {
  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('navigate-community'));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상태바 */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <div>3:50</div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="ml-2">📶</div>
          <div>📶</div>
          <div>🔋</div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-black" />
          </div>
          <div className="bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-sm">Samsung community</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* 게시판 섹션 */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">게시판</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-gray-800"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-gray-800"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 공지사항 카드 */}
        <div className="bg-white text-black rounded-lg p-4 mb-6">
          <div className="mb-2">
            <h3 className="font-medium">공지 사항</h3>
            <p className="text-sm text-gray-600">3월 1일 (금)</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-gray-500" />
              </div>
              <span className="text-sm text-gray-700">회원룩 작성</span>
            </div>
            <span className="text-xs text-gray-500">전체 보기</span>
          </div>
        </div>

        {/* 메뉴 항목들 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 py-2">
            <Edit3 className="w-5 h-5" />
            <span>내가 쓴 글</span>
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <MessageSquare className="w-5 h-5" />
            <span>댓글 단 글</span>
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <Bookmark className="w-5 h-5" />
            <span>스크랩</span>
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <Flame className="w-5 h-5" />
            <span>HOT 게시판</span>
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <Trophy className="w-5 h-5" />
            <span>BEST 게시판</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* 카테고리 게시판들 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>자유게시판</span>
            </div>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">N</span>
          </div>
          
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3 py-2 w-full text-white hover:bg-gray-800 h-auto"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-secret-board'))}
          >
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>비밀게시판</span>
          </Button>
          
          <div className="flex items-center gap-3 py-2">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>정치게시판</span>
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>맛집게시판</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMenuScreen;