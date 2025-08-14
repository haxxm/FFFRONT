"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check, MessageSquare, Send, Hash, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';


import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { toast } from 'sonner';

import CalendarV2 from './CalendarV2';

import { CalendarProvider } from '../contexts/CalendarContext';

interface SharedCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'sharing' | 'calendar';
  initialCalendar?: SharedCalendar;
}

interface SharedCalendar {
  id: string;
  name: string;
  code: string;
  members: number;
  createdAt: Date;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

const SharedCalendarModal: React.FC<SharedCalendarModalProps> = ({ 
  isOpen, 
  onClose, 
  initialStep = 'sharing',
  initialCalendar = null 
}) => {
  const [step, setStep] = useState<'sharing' | 'calendar'>(initialStep);
  const [sharedCalendar, setSharedCalendar] = useState<SharedCalendar | null>(initialCalendar);
  const [shareCode, setShareCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // 4자리 랜덤 코드 생성
  const generateShareCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 공유 캘린더 생성
  const createSharedCalendar = () => {
    const code = generateShareCode();
    const calendar: SharedCalendar = {
      id: Date.now().toString(),
      name: '내 공유 캘린더',
      code,
      members: 1,
      createdAt: new Date()
    };
    
    setSharedCalendar(calendar);
    setShareCode(code);
    
    toast.success('공유 캘린더가 생성되었습니다!');
  };

  // 모달이 열릴 때 자동으로 공유 캘린더 생성 (초기 캘린더가 없을 때만)
  useEffect(() => {
    if (isOpen && !sharedCalendar && !initialCalendar) {
      createSharedCalendar();
    }
  }, [isOpen, initialCalendar]);

  // initialStep과 initialCalendar 변경 시 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      if (initialCalendar) {
        setSharedCalendar(initialCalendar);
        setShareCode(initialCalendar.code);
      }
    }
  }, [isOpen, initialStep, initialCalendar]);

  // 코드 복사
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast.success('코드가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('코드 복사에 실패했습니다.');
    }
  };

  // 캘린더 화면으로 이동
  const handleEnterCalendar = () => {
    setStep('calendar');
    // 초기 게시글 데이터
    setPosts([
      {
        id: '1',
        author: '나',
        avatar: '👤',
        content: '공유 캘린더가 생성되었습니다! 이제 함께 일정을 관리해보세요.',
        timestamp: new Date(),
        comments: []
      }
    ]);
  };

  // 새로운 공유 캘린더 뷰로 이동 (전체 화면)
  const handleEnterFullScreenCalendar = () => {
    if (sharedCalendar) {
      const calendarData = {
        ...sharedCalendar,
        color: '#3B82F6', // 기본 색상
        description: '공유 캘린더',
        isVisible: true,
        isDefault: false
      };
      
      // 공유 캘린더 뷰로 이동하는 이벤트 발생
      const event = new CustomEvent('navigate-shared-calendar-view', { detail: calendarData });
      window.dispatchEvent(event);
      
      // 모달 닫기
      handleClose();
    }
  };

  // 게시글 작성
  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: '나',
      avatar: '👤',
      content: newPost,
      timestamp: new Date(),
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    toast.success('게시글이 작성되었습니다!');
  };

  // 댓글 작성
  const handleCreateComment = (postId: string) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: '나',
      avatar: '👤',
      content: commentContent,
      timestamp: new Date()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    toast.success('댓글이 작성되었습니다!');
  };

  // 모달 닫기 시 초기화
  const handleClose = () => {
    setStep('sharing');
    setSharedCalendar(null);
    setShareCode('');
    setCopied(false);
    setPosts([]);
    setNewPost('');
    setCommentInputs({});
    onClose();
  };

  // 시간 포맷팅
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 border-0 bg-background overflow-hidden" aria-describedby="shared-calendar-modal-description">
        <VisuallyHidden>
          <DialogTitle>캘린더 공유</DialogTitle>
          <DialogDescription id="shared-calendar-modal-description">캘린더를 공유하고 함께 사용할 수 있습니다.</DialogDescription>
        </VisuallyHidden>

        {step === 'sharing' && sharedCalendar && (
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg text-foreground">공유 코드</h2>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="max-w-sm text-center space-y-6">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-12 h-12 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl text-foreground">공유 코드가 생성되었습니다!</h3>
                  <p className="text-muted-foreground text-sm">
                    아래 코드를 친구들과 공유하세요.
                  </p>
                </div>

                {/* 공유 코드 */}
                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold tracking-[0.5em] text-foreground bg-background rounded-lg py-4 px-6">
                      {shareCode}
                    </div>
                    <p className="text-sm text-muted-foreground">공유 코드</p>
                  </div>
                  
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        코드 복사
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleEnterFullScreenCalendar}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    공유 캘린더 입장 (전체화면)
                  </Button>
                  
                  <Button 
                    onClick={handleEnterCalendar}
                    variant="outline"
                    className="w-full"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    미리보기로 입장
                  </Button>
                  
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    className="w-full"
                  >
                    나중에 하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'calendar' && sharedCalendar && (
          <CalendarProvider>
            <div className="flex flex-col h-full bg-background">
              {/* Header */}
              <div className="flex items-center p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg text-foreground">{sharedCalendar.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {sharedCalendar.members}명 참여 • 코드: {sharedCalendar.code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendar and Posts Container with Resizable */}
              <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="vertical" className="h-full">
                  {/* Calendar Section */}
                  <ResizablePanel defaultSize={65} minSize={30} maxSize={80}>
                    <div className="h-full flex flex-col bg-background overflow-hidden">
                      {/* Calendar Header - 간단한 헤더 */}
                      <div className="px-4 py-3 bg-muted/30 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-medium text-foreground">방장의 캘린더</h3>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            함께 보는 일정
                          </div>
                        </div>
                      </div>
                      
                      {/* Calendar Component */}
                      <div className="flex-1 overflow-hidden">
                        <CalendarV2 />
                      </div>
                    </div>
                  </ResizablePanel>

                  {/* Resizable Handle */}
                  <ResizableHandle withHandle className="bg-border hover:bg-muted transition-colors" />

                  {/* Posts Section */}
                  <ResizablePanel defaultSize={35} minSize={20} maxSize={70}>
                    <div className="h-full flex flex-col bg-background">
                      {/* Posts Header */}
                      <div className="px-4 py-3 bg-muted/30 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-medium text-foreground">게시판</h3>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {posts.length}개의 게시글
                          </div>
                        </div>
                      </div>

                      {/* Posts List */}
                      <ScrollArea className="flex-1 px-4">
                        <div className="space-y-3 py-3">
                          {posts.map((post) => (
                            <div key={post.id} className="bg-card rounded-lg p-3 border border-border">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs">{post.avatar}</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-foreground">{post.author}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(post.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground">{post.content}</p>
                                  
                                  {/* Comments */}
                                  {post.comments.length > 0 && (
                                    <div className="mt-2 space-y-1 border-l-2 border-border pl-2">
                                      {post.comments.map((comment) => (
                                        <div key={comment.id} className="flex items-start gap-2">
                                          <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs">{comment.avatar}</span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                              <span className="text-xs text-foreground">{comment.author}</span>
                                              <span className="text-xs text-muted-foreground">
                                                {formatTime(comment.timestamp)}
                                              </span>
                                            </div>
                                            <p className="text-xs text-foreground">{comment.content}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Comment Input */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Input
                                      placeholder="댓글 달기..."
                                      value={commentInputs[post.id] || ''}
                                      onChange={(e) => setCommentInputs(prev => ({ 
                                        ...prev, 
                                        [post.id]: e.target.value 
                                      }))}
                                      onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                                      className="flex-1 h-7 text-xs"
                                    />
                                    <Button
                                      onClick={() => handleCreateComment(post.id)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                    >
                                      <Send className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Post Input */}
                      <div className="border-t border-border p-3">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="공유 캘린더에 글을 작성하세요..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[60px] resize-none text-sm"
                          />
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              게시글 작성
                            </div>
                            <Button
                              onClick={handleCreatePost}
                              disabled={!newPost.trim()}
                              size="sm"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              작성
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          </CalendarProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SharedCalendarModal;