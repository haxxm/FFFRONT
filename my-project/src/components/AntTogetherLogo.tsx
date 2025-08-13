import React, { useState, useEffect } from 'react';

interface AntTogetherLogoProps {
  className?: string;
}

const AntTogetherLogo: React.FC<AntTogetherLogoProps> = ({ className = "w-64 h-32" }) => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // 로컬스토리지에서 업로드된 로고 이미지 확인
  useEffect(() => {
    const savedFiles = localStorage.getItem('antogether_svg_files');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        // 'logo' 또는 'ant' 키워드가 포함된 파일 찾기
        const logoFile = files.find((file: any) => 
          file.name.toLowerCase().includes('logo') || 
          file.name.toLowerCase().includes('ant') ||
          file.name.toLowerCase().includes('together')
        );
        
        if (logoFile) {
          // SVG 콘텐츠를 Data URL로 변환
          const dataUrl = `data:image/svg+xml;base64,${btoa(logoFile.content)}`;
          setLogoImage(dataUrl);
        }
      } catch (error) {
        console.error('Failed to load logo from saved files:', error);
      }
    }
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  // 이미지가 있고 오류가 없으면 이미지 표시
  if (logoImage && !imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src={logoImage}
          alt="ANT TOGETHER Logo"
          className="w-full h-full object-contain"
          style={{
            filter: 'brightness(0) invert(1)', // 흰색으로 변환
          }}
          onError={handleImageError}
        />
      </div>
    );
  }

  // 폴백: SVG 로고 사용 (개미 아이콘 포함)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 그림자 효과를 위한 배경 텍스트 */}
        <text
          x="202"
          y="82"
          textAnchor="middle"
          className="fill-black/30"
          style={{
            fontSize: '48px',
            fontWeight: '900',
            fontFamily: 'Arial Black, Arial, sans-serif',
            letterSpacing: '0.3em'
          }}
        >
          ANT
        </text>
        
        <text
          x="202"
          y="142"
          textAnchor="middle"
          className="fill-black/30"
          style={{
            fontSize: '36px',
            fontWeight: '900',
            fontFamily: 'Arial Black, Arial, sans-serif',
            letterSpacing: '0.15em'
          }}
        >
          TOGETHER
        </text>


        
        {/* ANT 텍스트 */}
        <text
          x="200"
          y="80"
          textAnchor="middle"
          className="fill-white"
          style={{
            fontSize: '48px',
            fontWeight: '900',
            fontFamily: 'Arial Black, Arial, sans-serif',
            letterSpacing: '0.3em'
          }}
        >
          ANT
        </text>
        
        {/* TOGETHER 텍스트 */}
        <text
          x="200"
          y="140"
          textAnchor="middle"
          className="fill-white"
          style={{
            fontSize: '36px',
            fontWeight: '900',
            fontFamily: 'Arial Black, Arial, sans-serif',
            letterSpacing: '0.15em'
          }}
        >
          TOGETHER
        </text>
      </svg>
    </div>
  );
};

export default AntTogetherLogo;