"use client";

import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import AntIcon from './AntIcon';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 간단한 로딩 시뮬레이션
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 클릭`);
    // 소셜 로그인 로직은 향후 Supabase 연동 시 구현
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <span>3:50</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <AntIcon className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-2xl font-bold tracking-wider mb-2">ANT</h1>
          <h1 className="text-2xl font-bold tracking-wider">TOGETHER</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Antogether ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 pl-12 pr-4 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pl-12 pr-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-white text-black rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Login Options */}
        <div className="flex justify-center items-center gap-6 text-sm text-gray-300 mb-8">
          <button className="hover:text-white transition-colors">로그인 유지</button>
          <span>|</span>
          <button className="hover:text-white transition-colors">아이디 찾기</button>
          <span>|</span>
          <button className="hover:text-white transition-colors">비밀번호 찾기</button>
        </div>

        {/* Social Login */}
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {/* Naver */}
            <button
              onClick={() => handleSocialLogin('naver')}
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <span className="text-white font-bold">N</span>
            </button>

            {/* Kakao */}
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors"
            >
              <span className="text-black font-bold">K</span>
            </button>

            {/* Google */}
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-red-500 font-bold">G</span>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-black font-bold"></span>
            </button>
          </div>

          <div className="text-center">
            <button 
              onClick={onSignup}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;