"use client";

import React, { useState } from 'react';
import { X, FolderOpen, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import SVGUploader from './SVGUploader';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileManagerModal: React.FC<FileManagerModalProps> = ({ isOpen, onClose }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileUpload = (files: any[]) => {
    setUploadedFiles(files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" aria-describedby="file-manager-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            파일 관리자
          </DialogTitle>
          <DialogDescription id="file-manager-description">
            SVG 파일을 업로드하고 관리하세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="svg" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="svg" className="flex items-center gap-2">
                <FileImage className="w-4 h-4" />
                SVG 파일
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="svg" className="mt-6 space-y-6">
              <SVGUploader 
                onUpload={handleFileUpload}
                maxFiles={20}
                maxSize={2 * 1024 * 1024} // 2MB
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileManagerModal;