"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import AntIcon from './AntIcon';

interface SignupFormScreenProps {
  onBack: () => void;
  onSignup: (formData: SignupFormData) => void;
}

interface SignupFormData {
  username: string;
  password: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | '';
  email: string;
  phone: string;
  verificationCode: string;
}

const SignupFormScreen: React.FC<SignupFormScreenProps> = ({ onBack, onSignup }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    verificationCode: ''
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendVerification = () => {
    if (formData.email) {
      setIsCodeSent(true);
      // 실제로는 여기서 이메일 인증번호를 발송
      console.log('이메일 인증번호 발송:', formData.email);
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode) {
      setIsEmailVerified(true);
      // 실제로는 여기서 이메일 인증번호를 확인
      console.log('이메일 인증번호 확인:', formData.verificationCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailVerified) {
      onSignup(formData);
    }
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

      <div className="flex-1 px-4 py-6 overflow-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wider mb-1">ANT</h1>
          <h1 className="text-2xl font-bold tracking-wider mb-4">TOGETHER</h1>
          <AntIcon className="w-12 h-12 mx-auto text-white" />
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">아이디</label>
            <Input
              type="text"
              placeholder="6-16자 영문소문자, 숫자"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">비밀번호</label>
            <Input
              type="password"
              placeholder="6-16자 영문소문자, 숫자"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">이름</label>
            <Input
              type="text"
              placeholder="6-16자 영문소문자, 숫자"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              required
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">생년월일</label>
            <Input
              type="text"
              placeholder="예)20000131"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
              maxLength={8}
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">성별</label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => handleInputChange('gender', 'male')}
                className={`flex-1 h-12 rounded-full ${
                  formData.gender === 'male' 
                    ? 'bg-white text-black' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                남자
              </Button>
              <div className="flex items-center px-4 text-gray-400">|</div>
              <Button
                type="button"
                onClick={() => handleInputChange('gender', 'female')}
                className={`flex-1 h-12 rounded-full ${
                  formData.gender === 'female' 
                    ? 'bg-white text-black' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                여자
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">이메일</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="이메일@도메인형식"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="flex-1 h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
                required
              />
              <Button
                type="button"
                onClick={handleSendVerification}
                disabled={!formData.email || isCodeSent}
                className="px-4 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 text-xs whitespace-nowrap"
              >
                {isCodeSent ? '전송됨' : '인증번호 전송'}
              </Button>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">휴대폰 번호</label>
            <Input
              type="tel"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-400 px-4">휴대폰 번호는 선택사항입니다</p>
          </div>

          {/* Verification Code */}
          {isCodeSent && (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">이메일 인증번호</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="이메일로 받은 인증번호를 입력하세요"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className="flex-1 h-12 bg-white text-black rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!formData.verificationCode || isEmailVerified}
                  className="px-6 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 text-xs"
                >
                  {isEmailVerified ? '확인됨' : '확인'}
                </Button>
              </div>
              {isEmailVerified && (
                <p className="text-xs text-green-400 px-4">✓ 이메일 인증이 완료되었습니다</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={!isEmailVerified}
              className="w-full h-14 bg-white text-black rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              가입 완료
            </Button>
            {!isEmailVerified && (
              <p className="text-xs text-gray-400 text-center mt-2">
                이메일 인증을 완료해야 가입할 수 있습니다
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupFormScreen;