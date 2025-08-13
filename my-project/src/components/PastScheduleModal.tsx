import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, Upload, X, Plus, Brain, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface PastScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  addToCalendar: boolean;
  aiAnalysis?: {
    description: string;
    extractedDate?: string;
    confidence: number;
    analysis: string;
    isAnalyzing: boolean;
  };
}

const PastScheduleModal: React.FC<PastScheduleModalProps> = ({ isOpen, onClose }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImageForAnalysis, setSelectedImageForAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 검증
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 지원)');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('파일 크기가 너무 큽니다. (최대 10MB)');
      return false;
    }

    return true;
  };

  // AI 이미지 분석 (모의 함수)
  const analyzeImageWithAI = async (imageUrl: string, fileName: string): Promise<any> => {
    // 실제 구현에서는 여기서 AI API를 호출합니다
    return new Promise((resolve) => {
      setTimeout(() => {
        // 모의 분석 결과
        const mockAnalyses = [
          {
            description: "2024년 3월 15일 회사 워크샵 사진",
            extractedDate: "2024-03-15",
            confidence: 0.89,
            analysis: "이미지에서 회의실과 여러 사람들이 프레젠테이션을 보고 있는 모습이 확인됩니다. 화이트보드에 '워크샵 2024.03.15'라는 텍스트가 보입니다."
          },
          {
            description: "생일 파티 기념 사진",
            extractedDate: "2024-08-22",
            confidence: 0.95,
            analysis: "생일 케이크와 촛불, 축하하는 사람들의 모습이 보입니다. 케이크 위에 '2024.08.22'라는 날짜가 적혀있습니다."
          },
          {
            description: "여행 기념품 구매 영수증",
            extractedDate: "2024-07-10",
            confidence: 0.76,
            analysis: "여행지에서 구매한 기념품의 영수증 사진입니다. 날짜가 2024년 7월 10일로 표시되어 있습니다."
          }
        ];
        
        const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
        resolve(randomAnalysis);
      }, 2000 + Math.random() * 1000); // 2-3초 지연
    });
  };

  // 파일 업로드 처리
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const url = e.target?.result as string;
        const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newImage: UploadedImage = {
          id: imageId,
          file,
          url,
          name: file.name,
          addToCalendar: false,
          aiAnalysis: {
            description: '',
            extractedDate: undefined,
            confidence: 0,
            analysis: '',
            isAnalyzing: true
          }
        };

        setUploadedImages(prev => [...prev, newImage]);
        toast.success(`${file.name} 업로드 완료`);

        // AI 분석 시작
        try {
          const analysis = await analyzeImageWithAI(url, file.name);
          
          setUploadedImages(prev => 
            prev.map(img => 
              img.id === imageId 
                ? {
                    ...img,
                    aiAnalysis: {
                      ...analysis,
                      isAnalyzing: false
                    }
                  }
                : img
            )
          );
          
          toast.success(`${file.name} AI 분석 완료`);
        } catch (error) {
          setUploadedImages(prev => 
            prev.map(img => 
              img.id === imageId 
                ? {
                    ...img,
                    aiAnalysis: {
                      description: '분석 실패',
                      confidence: 0,
                      analysis: 'AI 분석 중 오류가 발생했습니다.',
                      isAnalyzing: false
                    }
                  }
                : img
            )
          );
          
          toast.error(`${file.name} AI 분석 실패`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 드래그 앤 드롭 이벤트
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // 파일 선택 버튼 클릭
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 이미지 삭제
  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  // 캘린더 추가 토글
  const toggleAddToCalendar = (id: string) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, addToCalendar: !img.addToCalendar } : img
      )
    );
  };

  // 캘린더에 추가된 이미지들 처리
  const handleSaveToCalendar = () => {
    const imagesToAdd = uploadedImages.filter(img => img.addToCalendar);
    
    if (imagesToAdd.length === 0) {
      toast.error('캘린더에 추가할 이미지를 선택해주세요.');
      return;
    }

    // AI 분석된 날짜로 캘린더에 일정 추가
    imagesToAdd.forEach(img => {
      const eventDate = img.aiAnalysis?.extractedDate || new Date().toISOString().split('T')[0];
      const eventTitle = img.aiAnalysis?.description || img.name;
      
      // 실제 캘린더에 이미지 기반 일정을 추가하는 로직
      const newEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: eventTitle,
        date: eventDate,
        time: '09:00',
        description: img.aiAnalysis?.analysis || '업로드된 이미지 기반 일정',
        category: 'memory',
        color: '#8B5CF6',
        image: img.url,
        confidence: img.aiAnalysis?.confidence || 0
      };
      
      // 로컬스토리지에 일정 저장
      const existingEvents = JSON.parse(localStorage.getItem('antogether_events') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('antogether_events', JSON.stringify(existingEvents));
      
      console.log('캘린더에 추가:', newEvent);
    });

    toast.success(`${imagesToAdd.length}개의 이미지가 AI 분석 날짜로 캘린더에 추가되었습니다.`);
    
    // 캘린더 갱신 이벤트 발생
    window.dispatchEvent(new Event('calendar-refresh'));
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden" aria-describedby="past-schedule-modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            AI 이미지 분석 & 캘린더 추가
          </DialogTitle>
          <DialogDescription id="past-schedule-modal-description">
            사진을 업로드하면 AI가 자동으로 분석하여 날짜와 내용을 파악합니다.
          </DialogDescription>
        </DialogHeader>
        
        {/* Content */}
        <div className="flex gap-6 overflow-hidden h-[70vh]">
          {/* 왼쪽: 업로드 및 이미지 목록 */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* 파일 업로드 영역 */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileSelect}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="mb-2 text-sm font-medium">사진 업로드 & AI 분석</h3>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF, WebP (최대 10MB)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* 업로드된 이미지 목록 */}
            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  업로드된 이미지 ({uploadedImages.length})
                </h4>
                <ScrollArea className="h-96">
                  <div className="space-y-2 pr-4">
                    {uploadedImages.map((image) => (
                      <div 
                        key={image.id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedImageForAnalysis === image.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedImageForAnalysis(image.id)}
                      >
                        {/* 이미지 미리보기 */}
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        
                        {/* 이미지 정보 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{image.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {(image.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                            {image.aiAnalysis?.isAnalyzing && (
                              <Badge variant="secondary" className="text-xs">
                                <Brain className="w-3 h-3 mr-1 animate-pulse" />
                                분석중
                              </Badge>
                            )}
                            {image.aiAnalysis?.extractedDate && !image.aiAnalysis.isAnalyzing && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {image.aiAnalysis.extractedDate}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* 캘린더 추가 버튼 */}
                        <Button
                          size="sm"
                          variant={image.addToCalendar ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAddToCalendar(image.id);
                          }}
                          className="flex items-center gap-1"
                          disabled={image.aiAnalysis?.isAnalyzing}
                        >
                          <Plus className="w-3 h-3" />
                          {image.addToCalendar ? '추가됨' : '추가'}
                        </Button>
                        
                        {/* 삭제 버튼 */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(image.id);
                          }}
                          className="p-1 h-auto text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          
          {/* 오른쪽: AI 분석 결과 */}
          {selectedImageForAnalysis && (
            <div className="flex-1 flex flex-col gap-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI 분석 결과
              </h4>
              
              {(() => {
                const selectedImage = uploadedImages.find(img => img.id === selectedImageForAnalysis);
                if (!selectedImage) return null;
                
                return (
                  <div className="flex flex-col gap-4 h-full">
                    {/* 선택된 이미지 미리보기 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden border">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 분석 중 상태 */}
                    {selectedImage.aiAnalysis?.isAnalyzing && (
                      <div className="flex flex-col items-center justify-center gap-4 p-8">
                        <Brain className="w-12 h-12 text-primary animate-pulse" />
                        <div className="text-center">
                          <p className="font-medium">AI가 이미지를 분석하고 있습니다...</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            날짜 정보와 내용을 파악 중입니다.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 분석 완료 결과 */}
                    {selectedImage.aiAnalysis && !selectedImage.aiAnalysis.isAnalyzing && (
                      <ScrollArea className="flex-1">
                        <div className="space-y-4 pr-4">
                          {/* 추출된 날짜 */}
                          {selectedImage.aiAnalysis.extractedDate && (
                            <div className="p-4 border rounded-lg bg-primary/5">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">추출된 날짜</span>
                                <Badge variant="secondary" className="text-xs">
                                  신뢰도: {Math.round(selectedImage.aiAnalysis.confidence * 100)}%
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                {selectedImage.aiAnalysis.extractedDate}
                              </p>
                            </div>
                          )}
                          
                          {/* 이미지 설명 */}
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium text-sm">이미지 설명</span>
                            </div>
                            <p className="text-sm">{selectedImage.aiAnalysis.description}</p>
                          </div>
                          
                          {/* 상세 분석 */}
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4" />
                              <span className="font-medium text-sm">상세 분석</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {selectedImage.aiAnalysis.analysis}
                            </p>
                          </div>
                          
                          <Separator />
                          
                          {/* 캘린더 추가 정보 */}
                          <div className="p-4 border rounded-lg bg-muted/50">
                            <h5 className="font-medium text-sm mb-2">캘린더 저장 정보</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">일정 제목:</span>
                                <span>{selectedImage.aiAnalysis.description}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">저장 날짜:</span>
                                <span>{selectedImage.aiAnalysis.extractedDate || '오늘'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">카테고리:</span>
                                <span>추억</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          
          {/* 분석 결과가 없을 때 */}
          {!selectedImageForAnalysis && uploadedImages.length > 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">이미지를 선택하세요</p>
                <p className="text-sm">AI 분석 결과를 확인할 수 있습니다</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {uploadedImages.filter(img => img.addToCalendar).length}개 이미지가 AI 분석 날짜로 캘린더에 추가 예정
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            {uploadedImages.some(img => img.addToCalendar) && (
              <Button onClick={handleSaveToCalendar}>
                AI 날짜로 캘린더에 저장
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PastScheduleModal;