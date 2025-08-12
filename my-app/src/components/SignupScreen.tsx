"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import AntIcon from './AntIcon';

interface SignupScreenProps {
  onBack: () => void;
  onSocialSignup: (provider: string) => void;
  onSignupForm: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onBack, onSocialSignup, onSignupForm }) => {
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

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <h1 className="text-lg">회원가입</h1>
        <button 
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8">
        {/* Logo and Title */}
        <div className="text-center mb-16">
          <AntIcon className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-2xl font-bold tracking-wider mb-2">ANT</h1>
          <h1 className="text-2xl font-bold tracking-wider">TOGETHER</h1>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-4 mb-8">
          {/* Naver */}
          <Button
            onClick={() => onSocialSignup('naver')}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center gap-3"
          >
            <span className="w-6 h-6 bg-white text-green-500 rounded font-bold flex items-center justify-center text-sm">N</span>
            네이버 계정으로 가입하기
          </Button>

          {/* Kakao */}
          <Button
            onClick={() => onSocialSignup('kakao')}
            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full flex items-center justify-center gap-3"
          >
            <span className="w-6 h-6 bg-black text-yellow-400 rounded font-bold flex items-center justify-center text-sm">K</span>
            카카오 계정으로 가입하기
          </Button>

          {/* Google */}
          <Button
            onClick={() => onSocialSignup('google')}
            className="w-full h-14 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center gap-3"
          >
            <span className="w-6 h-6 bg-red-500 text-white rounded font-bold flex items-center justify-center text-sm">G</span>
            google 계정으로 가입하기
          </Button>

          {/* Apple */}
          <Button
            onClick={() => onSocialSignup('apple')}
            className="w-full h-14 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center gap-3"
          >
            <span className="text-lg"></span>
            Apple로 계속
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">또는</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Manual Signup Button */}
        <Button
          onClick={onSignupForm}
          className="w-full h-14 bg-white text-black rounded-full hover:bg-gray-100"
        >
          회원 가입하기
        </Button>
      </div>
    </div>
  );
};

export default SignupScreen;