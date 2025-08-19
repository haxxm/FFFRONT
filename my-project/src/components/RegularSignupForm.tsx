import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import whiteantLogo from '../assets/images/whiteant.svg';

interface RegularSignupFormProps {
  onSignup: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => void;
  onBack: () => void;
}

export function RegularSignupForm({ onSignup, onBack }: RegularSignupFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('이용약관과 개인정보처리방침에 동의해주세요.');
      return;
    }
    onSignup(formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col text-white">
      {/* 상단 헤더 */}
      <div className="h-14 flex items-center justify-between px-4 text-white">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-base">회원가입</span>
        <div className="w-9"></div>
      </div>

      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <div className="max-w-sm mx-auto space-y-6">
          {/* 로고 */}
          <div className="text-center space-y-2 mt-8">
            <div className="w-12 h-12 mx-auto mb-3">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-2">
                <img 
                  src={whiteantLogo} 
                  alt="antogether logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-12 bg-white text-black rounded-full px-4 border-0 placeholder:text-gray-400"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full h-12 bg-white text-black rounded-full px-4 pr-12 border-0 placeholder:text-gray-400"
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

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full h-12 bg-white text-black rounded-full px-4 pr-12 border-0 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full h-12 bg-white text-black rounded-full px-4 border-0 placeholder:text-gray-400"
                required
              />

              <Input
                type="tel"
                placeholder="휴대폰 번호"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full h-12 bg-white text-black rounded-full px-4 border-0 placeholder:text-gray-400"
                required
              />
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  이용약관에 동의합니다 (필수)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="privacy"
                  checked={formData.agreePrivacy}
                  onCheckedChange={(checked) => handleInputChange('agreePrivacy', checked as boolean)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <label htmlFor="privacy" className="text-sm text-gray-300">
                  개인정보처리방침에 동의합니다 (필수)
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-black rounded-full text-base mt-6"
            >
              가입하기
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}