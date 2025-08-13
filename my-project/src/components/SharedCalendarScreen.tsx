import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, Calendar, MessageSquare, Heart, Share2, Plus, MoreHorizontal, Users, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Textarea } from './ui/textarea';
import CreatePostModal from './CreatePostModal';

// 파스텔 톤 색상 팔레트
const PASTEL_COLORS = [
  '#FFE4EB', '#DFF6FF', '#F3E8FF', '#DFFFE0', '#FFF9D9',
  '#FFE7D6', '#FFF4E6', '#E3F0FF', '#FFEAD7', '#E2FBF4',
  '#F5EFFF', '#FFFFE0', '#E6FFF6', '#FFEEF3', '#FFDCE0',
  '#E4FFF1', '#F2F2F2', '#FFF1DD', '#E7F6FF', '#FFFBEA'
];

interface CalendarPost {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  hasEvent: boolean;
  category: string;
  images?: string[];
  participants?: string[];
  maxParticipants?: number;
  isParticipating?: boolean;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

const SharedCalendarScreen: React.FC = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [posts, setPosts] = useState<CalendarPost[]>([
    {
      id: 1,
      author: "김민수",
      avatar: "👨‍💼",
      time: "2시간 전",
      content: "다음 주 스터디 그룹 모임 일정 공유합니다! 함께 참여하실 분들 댓글 남겨주세요 📚",
      eventTitle: "JavaScript 스터디 모임",
      eventDate: "2024년 8월 15일",
      eventTime: "19:00 - 21:00",
      eventLocation: "카페 코딩",
      likes: 12,
      comments: 5,
      isLiked: false,
      hasEvent: true,
      category: "스터디",
      participants: ["김민수", "이영희", "박철수"],
      maxParticipants: 10,
      isParticipating: false
    },
    {
      id: 2,
      author: "이수진",
      avatar: "👩‍🎓",
      time: "4시간 전",
      content: "오늘 점심시간에 학식에서 만나요! 새로운 메뉴가 나왔다고 하네요 🍽️",
      likes: 8,
      comments: 3,
      isLiked: true,
      hasEvent: false,
      category: "일상"
    },
    {
      id: 3,
      author: "박준호",
      avatar: "👨‍🎨",
      time: "6시간 전",
      content: "내일 디자인 워크샵 참가하실 분들 모집합니다. 포토샵과 일러스트레이터 기초부터 배울 예정입니다!",
      eventTitle: "디자인 워크샵",
      eventDate: "2024년 8월 16일",
      eventTime: "14:00 - 17:00",
      eventLocation: "디자인센터 2층",
      likes: 15,
      comments: 7,
      isLiked: false,
      hasEvent: true,
      category: "워크샵",
      participants: ["박준호", "김지영", "최민호", "정수연"],
      maxParticipants: 15,
      isParticipating: false
    },
    {
      id: 4,
      author: "최예은",
      avatar: "👩‍💻",
      time: "8시간 전",
      content: "기말고사 스터디 그룹 만들어요! 전공 과목별로 나누어서 진행할 예정입니다.",
      likes: 20,
      comments: 12,
      isLiked: true,
      hasEvent: false,
      category: "스터디"
    }
  ]);

  const [comments] = useState<{ [key: number]: Comment[] }>({
    1: [
      {
        id: 1,
        author: "홍길동",
        avatar: "👨‍🎓",
        content: "저도 참여하고 싶어요!",
        time: "1시간 전",
        likes: 2,
        isLiked: false
      },
      {
        id: 2,
        author: "김영희",
        avatar: "👩‍🎓",
        content: "시간 괜찮습니다. 참여할게요!",
        time: "30분 전",
        likes: 1,
        isLiked: true
      }
    ],
    2: [
      {
        id: 3,
        author: "이철수",
        avatar: "👨‍🍳",
        content: "오늘 메뉴 정말 맛있어 보이더라구요!",
        time: "2시간 전",
        likes: 3,
        isLiked: false
      }
    ]
  });

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('navigate-calendar'));
  };

  const handleCreatePost = (newPost: {
    title: string;
    content: string;
    category: string;
    isAnonymous: boolean;
  }) => {
    const post: CalendarPost = {
      id: posts.length + 1,
      author: newPost.isAnonymous ? "익명" : "현재 사용자",
      avatar: "👤",
      time: "방금 전",
      content: newPost.content,
      likes: 0,
      comments: 0,
      isLiked: false,
      hasEvent: false,
      category: newPost.category
    };

    setPosts([post, ...posts]);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '스터디': 'bg-blue-100 text-blue-800',
      '워크샵': 'bg-purple-100 text-purple-800',
      '일상': 'bg-green-100 text-green-800',
      '모임': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getRandomPastelColor = () => {
    return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
  };

  const handleAddComment = (postId: number) => {
    if (newComment.trim()) {
      // 실제 구현에서는 댓글을 서버에 저장하고 상태를 업데이트
      console.log(`댓글 추가: ${newComment} to post ${postId}`);
      setNewComment('');
    }
  };

  const handleParticipateEvent = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.hasEvent) {
        const currentUser = "현재 사용자";
        const newParticipants = post.participants || [];
        const isCurrentlyParticipating = post.isParticipating || false;
        
        if (isCurrentlyParticipating) {
          // 참가 취소
          return {
            ...post,
            isParticipating: false,
            participants: newParticipants.filter(name => name !== currentUser)
          };
        } else {
          // 참가 신청
          if (newParticipants.length >= (post.maxParticipants || 0)) {
            alert('모집 인원이 마감되었습니다.');
            return post;
          }
          return {
            ...post,
            isParticipating: true,
            participants: [...newParticipants, currentUser]
          };
        }
      }
      return post;
    }));
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-sm">공유 캘린더</span>
          </div>
          <Badge className="bg-blue-600 text-white text-xs">
            <Users className="w-3 h-3 mr-1" />
            24명 참여중
          </Badge>
        </div>
        <div className="flex items-center gap-2">
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

      {/* 게시글 목록 */}
      <div className="px-4 space-y-4 pb-32">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-4">
            {/* 게시글 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{post.author}</span>
                    <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </Badge>
                  </div>
                  <span className="text-gray-400 text-sm">{post.time}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* 게시글 내용 */}
            <p className="text-gray-200 mb-3">{post.content}</p>

            {/* 이벤트 정보 (있는 경우) */}
            {post.hasEvent && (
              <div 
                className="rounded-lg p-3 mb-3 text-gray-800"
                style={{ backgroundColor: getRandomPastelColor() }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">일정 정보</span>
                </div>
                <h4 className="font-bold mb-2">{post.eventTitle}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{post.eventDate} {post.eventTime}</span>
                  </div>
                  {post.eventLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{post.eventLocation}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs">
                    <span className="text-gray-700">
                      {post.participants?.length || 0}/{post.maxParticipants || 0}명 참여중
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className={`${
                      post.isParticipating 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-800 hover:bg-gray-900 text-white'
                    }`}
                    onClick={() => handleParticipateEvent(post.id)}
                  >
                    {post.isParticipating ? '참가 취소' : '참가 신청'}
                  </Button>
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 h-8 ${
                    post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-8 text-gray-400 hover:text-white"
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-8 text-gray-400 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                  <span>공유</span>
                </Button>
              </div>
            </div>

            {/* 댓글 섹션 */}
            {selectedPost === post.id && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                {/* 기존 댓글 */}
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{comment.author}</span>
                        <span className="text-gray-400 text-xs">{comment.time}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`mt-1 h-6 px-2 text-xs ${
                          comment.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                        {comment.likes}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* 댓글 작성 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-sm min-h-[32px] resize-none"
                      rows={1}
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment.trim()}
                    >
                      등록
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 게시글 작성 버튼 */}
      <div className="fixed bottom-20 right-4">
        <Button 
          className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2 flex items-center gap-2"
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>일정 공유</span>
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

export default SharedCalendarScreen;