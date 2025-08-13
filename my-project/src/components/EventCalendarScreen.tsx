import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, Calendar, MapPin, Users, Clock, Filter, Plus, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const EventCalendarScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('navigate-community'));
  };

  const events = [
    {
      id: 1,
      title: "2024 대학축제",
      date: "2024년 8월 15일",
      time: "14:00 - 22:00",
      location: "대학교 중앙잔디밭",
      category: "축제",
      participants: 1250,
      maxParticipants: null,
      description: "올해 가장 큰 대학축제가 돌아왔습니다! 다양한 공연과 부스를 즐겨보세요.",
      isRegistered: false,
      isPinned: true,
      status: "모집중"
    },
    {
      id: 2,
      title: "IT 취업박람회",
      date: "2024년 8월 20일",
      time: "10:00 - 17:00",
      location: "컨벤션센터 A홀",
      category: "취업",
      participants: 89,
      maxParticipants: 100,
      description: "IT 기업들이 참여하는 취업박람회입니다. 현장 면접 기회도 있습니다.",
      isRegistered: true,
      isPinned: false,
      status: "마감임박"
    },
    {
      id: 3,
      title: "창업 경진대회",
      date: "2024년 8월 25일",
      time: "13:00 - 18:00",
      location: "창업보육센터",
      category: "경진대회",
      participants: 45,
      maxParticipants: 50,
      description: "혁신적인 아이디어로 창업의 꿈을 펼쳐보세요.",
      isRegistered: false,
      isPinned: false,
      status: "모집중"
    },
    {
      id: 4,
      title: "동아리 박람회",
      date: "2024년 8월 28일",
      time: "11:00 - 16:00",
      location: "학생회관 1층",
      category: "동아리",
      participants: 200,
      maxParticipants: null,
      description: "다양한 동아리를 만나보고 새로운 취미를 찾아보세요.",
      isRegistered: false,
      isPinned: false,
      status: "모집중"
    },
    {
      id: 5,
      title: "학술 세미나",
      date: "2024년 9월 2일",
      time: "15:00 - 17:00",
      location: "대강당",
      category: "세미나",
      participants: 78,
      maxParticipants: 200,
      description: "최신 기술 트렌드와 연구 성과를 공유하는 세미나입니다.",
      isRegistered: true,
      isPinned: false,
      status: "모집중"
    }
  ];

  const categories = ['all', '축제', '취업', '경진대회', '동아리', '세미나'];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.category === selectedFilter);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '축제': 'bg-purple-100 text-purple-800',
      '취업': 'bg-blue-100 text-blue-800',
      '경진대회': 'bg-green-100 text-green-800',
      '동아리': 'bg-orange-100 text-orange-800',
      '세미나': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      '모집중': 'bg-green-500',
      '마감임박': 'bg-orange-500',
      '마감': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상태바 */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <div>3:50</div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="ml-2">📶</div>
          <div>📶</div>
          <div>🔋</div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-sm">행사 정보</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-gray-800"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-gray-800"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedFilter === category ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 ${
                selectedFilter === category 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedFilter(category)}
            >
              {category === 'all' ? '전체' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="px-4 space-y-4 pb-32">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-gray-800 rounded-lg p-4 relative">
            {/* 상태 표시 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                <span className="text-xs text-gray-400">{event.status}</span>
                {event.isPinned && (
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                )}
              </div>
              {event.isRegistered && (
                <Badge className="bg-green-600 text-white text-xs">
                  참가 신청됨
                </Badge>
              )}
            </div>

            {/* 이벤트 정보 */}
            <h3 className="text-white text-lg font-medium mb-2">{event.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{event.description}</p>

            {/* 상세 정보 */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>
                  {event.participants}명 참가
                  {event.maxParticipants && ` / ${event.maxParticipants}명`}
                </span>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              {!event.isRegistered ? (
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={event.status === '마감'}
                >
                  {event.status === '마감' ? '마감됨' : '참가 신청'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  신청 취소
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                상세보기
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 행사 등록 버튼 */}
      <div className="fixed bottom-20 right-4">
        <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>행사 등록</span>
        </Button>
      </div>
    </div>
  );
};

export default EventCalendarScreen;