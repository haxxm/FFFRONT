"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface SVGFile {
  id: string;
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
}

interface SVGUploaderProps {
  onUpload?: (files: SVGFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

const SVGUploader: React.FC<SVGUploaderProps> = ({ 
  onUpload, 
  maxFiles = 10, 
  maxSize = 1024 * 1024 // 1MB
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<SVGFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SVGFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로컬스토리지에서 파일 로드
  React.useEffect(() => {
    const savedFiles = localStorage.getItem('antogether_svg_files');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        }));
        setUploadedFiles(files);
      } catch (error) {
        console.error('Failed to load saved SVG files:', error);
      }
    }
  }, []);

  // 파일 저장
  const saveFiles = useCallback((files: SVGFile[]) => {
    localStorage.setItem('antogether_svg_files', JSON.stringify(files));
    onUpload?.(files);
  }, [onUpload]);

  // SVG 파일 검증
  const validateSVGFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
        reject(new Error('SVG 파일만 업로드할 수 있습니다.'));
        return;
      }

      if (file.size > maxSize) {
        reject(new Error(`파일 크기는 ${Math.round(maxSize / 1024)}KB 이하여야 합니다.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content.includes('<svg') || content.includes('<?xml')) {
          resolve(content);
        } else {
          reject(new Error('유효한 SVG 파일이 아닙니다.'));
        }
      };
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsText(file);
    });
  };

  // 파일 처리
  const processFiles = async (files: FileList) => {
    const newFiles: SVGFile[] = [];
    const currentFileCount = uploadedFiles.length;

    for (let i = 0; i < Math.min(files.length, maxFiles - currentFileCount); i++) {
      const file = files[i];
      try {
        const content = await validateSVGFile(file);
        const svgFile: SVGFile = {
          id: `svg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          content,
          size: file.size,
          uploadedAt: new Date()
        };
        newFiles.push(svgFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        alert(`${file.name}: ${(error as Error).message}`);
      }
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      saveFiles(updatedFiles);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [uploadedFiles, maxFiles]);

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 파일 삭제
  const deleteFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    saveFiles(updatedFiles);
  };

  // 파일 다운로드
  const downloadFile = (file: SVGFile) => {
    const blob = new Blob([file.content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 파일 미리보기
  const previewFile = (file: SVGFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 업로드 영역 */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-foreground">SVG 파일 업로드</p>
                <p className="text-sm text-muted-foreground">
                  파일을 드래그하거나 클릭하여 업로드하세요
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>최대 {maxFiles}개 파일, 각 파일당 최대 {Math.round(maxSize / 1024)}KB</p>
                <p>현재 업로드된 파일: {uploadedFiles.length}개</p>
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadedFiles.length >= maxFiles}
              >
                <FileImage className="w-4 h-4 mr-2" />
                파일 선택
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">
              업로드된 SVG 파일 ({uploadedFiles.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  {/* SVG 미리보기 */}
                  <div 
                    className="w-full h-24 bg-muted rounded-md mb-3 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => previewFile(file)}
                  >
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: file.content }}
                    />
                  </div>
                  
                  {/* 파일 정보 */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.uploadedAt.toLocaleString('ko-KR')}
                    </p>
                    
                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewFile(file)}
                        className="flex-1"
                      >
                        <FileImage className="w-3 h-3 mr-1" />
                        미리보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 미리보기 모달 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto" aria-describedby="svg-preview-description">
          <DialogHeader>
            <DialogTitle>SVG 미리보기</DialogTitle>
            <DialogDescription id="svg-preview-description">
              {selectedFile?.name} 파일을 미리보기합니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              {/* SVG 표시 */}
              <div className="w-full bg-muted rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div 
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: selectedFile.content }}
                />
              </div>
              
              {/* 파일 정보 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">파일명:</span>
                  <p className="text-muted-foreground">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">크기:</span>
                  <p className="text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">업로드 일시:</span>
                  <p className="text-muted-foreground">{selectedFile.uploadedAt.toLocaleString('ko-KR')}</p>
                </div>
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => downloadFile(selectedFile)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    deleteFile(selectedFile.id);
                    setIsPreviewOpen(false);
                  }}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SVGUploader;