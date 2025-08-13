import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, Edit, MessageSquare, User, Menu } from 'lucide-react';
import { Button } from './ui/button';
import CreatePostModal from './CreatePostModal';

const SecretBoardScreen: React.FC = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "남출",
      content: "볼고무 자 노가 탈추느 암 라?",
      comments: 1,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 2,
      title: "위이하이 예 이래",
      content: "나빈 줄 장기고, 과 포사 안 되느 거 이나?",
      comments: 8,
      time: "1시간 전", 
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 3,
      title: "첨심 뭐 먹을지 잦이한 30분째",
      content: "우리 UX 좋았다고 더 했다.",
      comments: 1,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 4,
      title: "우리 댐에 만험 좋라는 가능응 있느예",
      content: "정적 우빈 출덥 덩되다 더 까를 ㄲ",
      comments: 3,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 5,
      title: "야금둠 화익뵤 원 이날부",
      content: "그틀 비크 이너 고씽너다 되벤등델 시켱됐고",
      comments: 5,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 6,
      title: "다저이너뷰 이전 예 이재개 액든가요",
      content: "비틀 위너어 젝 장자이긴이라 만든색요",
      comments: 2,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    },
    {
      id: 7,
      title: "진씩 나 기실서 입거에소 너무 으럽",
      content: "3층 브구 메뇌 는  글 쓰기",
      comments: 1,
      time: "1시간 전",
      replies: "1 덩글",
      author: "익명",
      category: "secret"
    }
  ]);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('navigate-community-menu'));
  };

  const handleCreatePost = (newPost: {
    title: string;
    content: string;
    category: string;
    isAnonymous: boolean;
  }) => {
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      comments: 0,
      time: "방금 전",
      replies: "0 덩글",
      author: newPost.isAnonymous ? "익명" : "사용자",
      category: newPost.category
    };

    setPosts([post, ...posts]);
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

      {/* 비밀게시판 제목 섹션 */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">비밀게시판</h1>
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
      </div>

      {/* 게시글 목록 */}
      <div className="px-4 space-y-4 pb-32">
        {posts.map((post) => (
          <Button
            key={post.id}
            variant="ghost"
            className="w-full h-auto p-0 text-left hover:bg-gray-700"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-post-detail'))}
          >
            <div className="bg-gray-800 rounded-lg p-4 w-full">
              <div className="mb-2">
                <h3 className="font-medium mb-1 text-white">{post.title}</h3>
                <p className="text-gray-300 text-sm">{post.content}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{post.comments}</span>
                  <span>{post.time}</span>
                  <span>{post.replies}</span>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-20 right-4">
        <Button 
          className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2 flex items-center gap-2"
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          <Edit className="w-4 h-4" />
          <span>글 쓰기</span>
        </Button>
      </div>

      {/* 게시글 작성 모달 */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default SecretBoardScreen;