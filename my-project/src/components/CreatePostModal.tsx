import React, { useState } from 'react';
import { X, Image, Paperclip, User, UserX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    title: string;
    content: string;
    category: string;
    isAnonymous: boolean;
  }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('secret');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        isAnonymous
      });
      
      // 폼 초기화
      setTitle('');
      setContent('');
      setCategory('secret');
      setIsAnonymous(true);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black w-full max-w-md rounded-lg border border-gray-600 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-white text-lg font-medium">새 게시글</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              게시판
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="secret" className="text-white">비밀게시판</SelectItem>
                <SelectItem value="general" className="text-white">자유게시판</SelectItem>
                <SelectItem value="question" className="text-white">질문게시판</SelectItem>
                <SelectItem value="info" className="text-white">정보게시판</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 작성자 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              작성자
            </label>
            <div className="flex gap-2">
              <Button
                variant={isAnonymous ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 flex-1 ${
                  isAnonymous 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setIsAnonymous(true)}
              >
                <UserX className="w-4 h-4" />
                익명
              </Button>
              <Button
                variant={!isAnonymous ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 flex-1 ${
                  !isAnonymous 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setIsAnonymous(false)}
              >
                <User className="w-4 h-4" />
                실명
              </Button>
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              내용
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/1000
            </div>
          </div>

          {/* 첨부 옵션 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Image className="w-4 h-4" />
              이미지
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Paperclip className="w-4 h-4" />
              파일
            </Button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-600 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            게시
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;