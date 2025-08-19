import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';

import AntogetherLogo from '../assets/images/whiteant.svg';
import AppleLogo from '../assets/images/Apple.svg';
import GoogleLogo from '../assets/images/google.svg';
import KakaoLogo from '../assets/images/kakao.svg';
import NaverLogo from '../assets/images/naver.svg';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onSocialLogin: (provider: 'naver' | 'kakao' | 'google' | 'apple') => void;
  onShowSignup: () => void;
}

export function AuthScreen({ onLogin, onSocialLogin, onShowSignup }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center p-4 text-white">
      {/* 상단 상태바 영역 */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 text-white text-sm">
        <span className="ml-6">3:30</span>
        <div className="flex items-center space-x-1 mr-6">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
          </div>
          <span className="ml-2">100%</span>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col h-full mt-24">
        {/* 로고 */}
        <div className="text-center space-y-6 mt-16">
          <div className="w-80 h-60 mx-auto p-6 bg-[#0E0E0E]">
            <img 
              src={AntogetherLogo} 
              alt="ANT TOGETHER" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 공간 채우기 */}
        <div className="flex-1"></div>

        {/* 하단 그룹 - 로그인 폼, 링크, 소셜 버튼 */}
        <div className="space-y-6 pb-8">
          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="antogether ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white/90 text-white rounded-full px-4 border-0 placeholder:text-gray-400"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-white/90 text-white rounded-full px-4 pr-12 border-0 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-black rounded-full text-base"
            >
              로그인
            </Button>
          </form>

          {/* 하단 링크들 */}
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <button className="hover:text-foreground transition-colors">
              아이디 찾기
            </button>
            <span>|</span>
            <button className="hover:text-foreground transition-colors">
              비밀번호 찾기
            </button>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onSocialLogin('naver')}
              className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center"
              title="네이버로 로그인"
            >
              <img
                src={NaverLogo}
                alt="네이버 로고"
                className="w-8 h-8 object-contain"
              />
            </button>
            <button
              onClick={() => onSocialLogin('kakao')}
              className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center"
              title="카카오로 로그인"
            >
              <img
                src={KakaoLogo}
                alt="카카오 로고"
                className="w-8 h-8 object-contain"
              />
            </button>
            <button
              onClick={() => onSocialLogin('google')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
              title="구글로 로그인"
            >
              <img
                src={GoogleLogo}
                alt="구글 로고"
                className="w-8 h-8 object-contain"
              />
            </button>
            <button
              onClick={() => onSocialLogin('apple')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
              title="애플로 로그인"
            >
              <img
                src={AppleLogo}
                alt="애플 로고"
                className="w-8 h-8 object-contain"
              />
            </button>
          </div>

          {/* 회원가입 버튼 - 별도 섹션으로 분리 */}
          <div className="text-center">
            <button 
              onClick={onShowSignup}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}