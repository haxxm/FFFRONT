import React, { useState } from 'react';
import { Users, Clock, Star, TrendingUp, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface RecommendedCommunity {
  id: number;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  category: string;
  rating: number;
  isPopular: boolean;
  recentActivity: string;
  image: string;
  tags: string[];
}



const AIRecommendScreen: React.FC = () => {
  const [joinedCommunities, setJoinedCommunities] = useState<number[]>([]);

  // 가입한 커뮤니티 정보 로드
  React.useEffect(() => {
    const saved = localStorage.getItem('antogether_joined_communities');
    if (saved) {
      setJoinedCommunities(JSON.parse(saved));
    }
  }, []);

  // 커뮤니티 가입 핸들러
  const handleJoinCommunity = (community: RecommendedCommunity) => {
    if (joinedCommunities.includes(community.id)) {
      return; // 이미 가입한 경우
    }

    if (community.members >= community.maxMembers) {
      alert('이 커뮤니티는 인원이 가득 찼습니다.');
      return;
    }

    // 가입한 커뮤니티 목록에 추가
    const newJoinedCommunities = [...joinedCommunities, community.id];
    setJoinedCommunities(newJoinedCommunities);
    localStorage.setItem('antogether_joined_communities', JSON.stringify(newJoinedCommunities));

    // 공유 캘린더 목록에 추가
    const joinedSharedCalendars = JSON.parse(localStorage.getItem('antogether_joined_shared_calendars') || '[]');
    const newSharedCalendar = {
      id: `community-${community.id}`,
      name: community.name,
      description: community.description,
      owner: '커뮤니티',
      members: community.members,
      maxMembers: community.maxMembers,
      isPublic: true,
      category: community.category,
      color: '#8B5CF6', // 보라색
      lastActivity: community.recentActivity,
      eventsCount: Math.floor(Math.random() * 20) + 5, // 랜덤 이벤트 수
      image: community.image,
      code: `AI${community.id}`,
      isOwnedByMe: false,
      createdAt: new Date(),
      isCommunityCalendar: true
    };

    const updatedSharedCalendars = [...joinedSharedCalendars, newSharedCalendar];
    localStorage.setItem('antogether_joined_shared_calendars', JSON.stringify(updatedSharedCalendars));

    // 커뮤니티 캘린더 가입 이벤트 발생 (캘린더 컨텍스트에 공유 캘린더로 추가)
    const communityCalendarData = {
      id: `community-${community.id}`,
      name: community.name,
      description: `${community.description} (AI 추천 커뮤니티)`,
      color: '#8B5CF6',
      code: `AI${community.id}`,
      members: community.members,
      type: 'ai-recommend',
      category: community.category,
      image: community.image
    };

    const joinEvent = new CustomEvent('community-calendar-join', {
      detail: communityCalendarData
    });
    window.dispatchEvent(joinEvent);

    // 가입 후 바로 해당 캘린더 화면으로 이동
    const sharedCalendarData = {
      id: `community-${community.id}`,
      name: community.name,
      color: '#8B5CF6',
      description: community.description,
      isVisible: true,
      isDefault: false,
      createdAt: new Date(),
      code: `AI${community.id}`,
      members: community.members + 1
    };
    
    const navigateEvent = new CustomEvent('navigate-shared-calendar-view', {
      detail: sharedCalendarData
    });
    window.dispatchEvent(navigateEvent);

    // 성공 알림은 App.tsx에서 처리하므로 여기서는 제거
    // alert(`'${community.name}' 커뮤니티에 가입했습니다! 공유 캘린더에서 확인할 수 있습니다.`);
  };

  const recommendedCommunities: RecommendedCommunity[] = [
    {
      id: 1,
      name: "스타트업 네트워킹",
      description: "젊은 창업가들과 투자자들이 모이는 커뮤니티입니다. 매주 정기 모임과 투자 설명회를 진행합니다.",
      members: 2950,
      maxMembers: 3000,
      category: "비즈니스",
      rating: 4.8,
      isPopular: true,
      recentActivity: "2시간 전",
      image: "💼",
      tags: ["창업", "네트워킹", "투자"]
    },
    {
      id: 2,
      name: "개발자 스터디",
      description: "최신 기술 트렌드를 공유하고 함께 성장하는 개발자 커뮤니티입니다.",
      members: 1923,
      maxMembers: 2500,
      category: "기술",
      rating: 4.9,
      isPopular: true,
      recentActivity: "30분 전",
      image: "💻",
      tags: ["개발", "코딩", "기술"]
    },
    {
      id: 3,
      name: "헬스케어 연구회",
      description: "의료진과 연구원들이 최신 의학 정보를 공유하는 전문가 그룹입니다.",
      members: 800,
      maxMembers: 800,
      category: "의료",
      rating: 4.7,
      isPopular: false,
      recentActivity: "1시간 전",
      image: "⚕️",
      tags: ["의료", "연구", "건강"]
    },
    {
      id: 4,
      name: "디자인 크리에이터",
      description: "UI/UX 디자이너들이 포트폴리오를 공유하고 피드백을 주고받는 커뮤니티입니다.",
      members: 642,
      maxMembers: 1000,
      category: "기술",
      rating: 4.6,
      isPopular: false,
      recentActivity: "3시간 전",
      image: "🎨",
      tags: ["디자인", "UI/UX", "크리에이티브"]
    },
    {
      id: 5,
      name: "마케팅 전략가",
      description: "디지털 마케팅과 브랜딩 전략을 연구하고 실무 노하우를 공유합니다.",
      members: 1200,
      maxMembers: 1200,
      category: "비즈니스",
      rating: 4.5,
      isPopular: true,
      recentActivity: "5시간 전",
      image: "📊",
      tags: ["마케팅", "브랜딩", "전략"]
    }
  ];



  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '비즈니스': 'bg-blue-100 text-blue-800',
      '기술': 'bg-purple-100 text-purple-800',
      '의료': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 컨텐츠 영역 */}
      <div className="px-4 space-y-4 pb-32 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-medium">당신을 위한 맞춤 커뮤니티</span>
          </div>
            
            {recommendedCommunities.map((community) => (
              <Card key={community.id} className="bg-gray-800 border-gray-700 p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                    {community.image}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-medium">{community.name}</h3>
                      {community.isPopular && (
                        <Badge className="bg-red-600 text-white text-xs">
                          🔥 인기
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getCategoryColor(community.category)}`}>
                        {community.category}
                      </Badge>
                      {community.members >= community.maxMembers && (
                        <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          만원
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{community.description}</p>
                    
                    {/* 인원 현황 프로그레스 바 */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${community.members >= community.maxMembers ? 'text-red-400' : 'text-gray-400'}`}>
                          {community.members.toLocaleString()}/{community.maxMembers.toLocaleString()}명
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            community.members >= community.maxMembers 
                              ? 'bg-red-500' 
                              : community.members / community.maxMembers > 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((community.members / community.maxMembers) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{community.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{community.recentActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {community.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className={
                            joinedCommunities.includes(community.id)
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : community.members >= community.maxMembers
                                ? "bg-gray-600 hover:bg-gray-700 text-white cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                          }
                          onClick={() => {
                            if (!joinedCommunities.includes(community.id) && community.members < community.maxMembers) {
                              handleJoinCommunity(community);
                            }
                          }}
                          disabled={joinedCommunities.includes(community.id) || community.members >= community.maxMembers}
                        >
                          {joinedCommunities.includes(community.id) 
                            ? '가입 완료' 
                            : community.members >= community.maxMembers 
                              ? '인원 만료'
                              : '가입하기'
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendScreen;