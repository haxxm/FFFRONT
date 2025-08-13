import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, MessageSquare, Bookmark, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
}

interface PostDetailScreenProps {
  postId?: number;
}

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ postId = 1 }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "익명",
      content: "공감해요ㅠㅠ 저도 요즘 같은 고민이 있어서..",
      time: "08/1 4:15",
      likes: 2
    }
  ]);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('navigate-secret-board'));
  };

  // 게시글 데이터 (실제로는 postId로 조회)
  const [post, setPost] = useState({
    id: postId,
    title: "진짜 나 기숙사 방단가 수명 유도 덥",
    content: "3층 소스 덜떠 누늘지 만...\n멘토는 왜 이래게 차가...\n잇는 덤 젓지만, 가능 이해는 풍왕.",
    author: "익명",
    time: "08/1 3:38",
    likes: 3,
    comments: 1,
    isLiked: false,
    isBookmarked: false
  });

  const handleSendComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: "익명",
        content: comment.trim(),
        time: new Date().toLocaleDateString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\. /g, '/').replace('.', ''),
        likes: 0
      };
      
      setComments([...comments, newComment]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      setComment('');
    }
  };

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }));
  };

  const handleBookmark = () => {
    setPost(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
  };

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
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
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-secret-board'))}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* 비밀게시판 제목 */}
      <div className="px-4 mb-6">
        <h1 className="text-xl">비밀게시판</h1>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 pb-32 overflow-y-auto">
        {/* 게시글 상세 내용 */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author}</span>
                  <span className="text-sm text-gray-400">{post.time}</span>
                </div>
              </div>
            </div>

            {/* 게시글 제목 */}
            <h2 className="font-medium mb-3 text-lg">{post.title}</h2>

            {/* 게시글 내용 */}
            <div className="text-gray-300 mb-4 whitespace-pre-line">
              {post.content}
            </div>

            {/* 상호작용 버튼들 */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-600">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 hover:bg-gray-700 h-auto p-2 ${
                  post.isLiked ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{post.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 h-auto p-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{post.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 hover:bg-gray-700 h-auto p-2 ml-auto ${
                  post.isBookmarked ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
                }`}
                onClick={handleBookmark}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="px-4 space-y-4">
          <h3 className="text-lg font-medium">댓글 {comments.length}개</h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-400">{comment.time}</span>
                </div>
              </div>
              
              <div className="text-gray-300 mb-3 ml-11">
                {comment.content}
              </div>
              
              <div className="ml-11">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-700 h-auto p-1 text-xs"
                  onClick={() => handleCommentLike(comment.id)}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 입력창 - 화면 하단 고정 */}
      <div className="fixed bottom-20 left-0 right-0 px-4 bg-black pt-2">
        <div className="bg-white rounded-full flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-gray-500 text-sm">익명</span>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요."
              className="border-none bg-transparent text-black placeholder:text-gray-500 focus-visible:ring-0 px-0"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendComment();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendComment}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 w-8 p-0"
            disabled={!comment.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailScreen;