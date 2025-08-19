import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, Bell, Plus } from 'lucide-react';
import { NotificationToast } from './NotificationToast';
import { sendNotificationResponse, fetchNotifications } from '../utils/notificationApi';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  formatYear, 
  formatMonth, 
  getYearOptions, 
  getMonthOptions, 
  getEventsForDate 
} from '../utils/calendarHelpers';
import { DAY_HEADERS, CALENDAR_INFO, TOTAL_CALENDAR_CELLS } from '../constants/calendar';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  color: string;
  calendarId: string;
}

interface CalendarViewProps {
  calendarId?: string;
  calendarName?: string;
  currentDate?: Date;
  events?: Event[];
  onDateChange?: (newDate: Date) => void;
  onDateClick?: (date: Date) => void;
  onBackToList?: () => void;
  onDeleteEvent?: (eventId: string) => void;
}

export function CalendarView({ 
  calendarId, 
  calendarName, 
  currentDate, 
  events: externalEvents, 
  onDateChange, 
  onDateClick, 
  onBackToList
}: CalendarViewProps) {
  const [localCurrentDate, setLocalCurrentDate] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  
  // 외부에서 currentDate가 제공되면 그것을 사용, 아니면 내부 상태 사용
  const effectiveCurrentDate = currentDate || localCurrentDate;
  const setCurrentDate = onDateChange || setLocalCurrentDate;
  // 외부에서 전달받은 이벤트를 사용하거나 기본 이벤트 사용
  const events = externalEvents || [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(effectiveCurrentDate.getFullYear(), effectiveCurrentDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
    setCurrentDate(newDate);
  };

  // 연도 선택 함수
  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, effectiveCurrentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setShowYearDropdown(false);
  };

  // 월 선택 함수
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(effectiveCurrentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    setShowMonthDropdown(false);
  };

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
      }
    };

    if (showYearDropdown || showMonthDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showYearDropdown, showMonthDropdown]);

  // 드롭다운 위치 계산을 위한 ref
  
  const [yearDropdownPosition, setYearDropdownPosition] = useState({ top: 0, left: 0 });
  const [monthDropdownPosition, setMonthDropdownPosition] = useState({ top: 0, left: 0 });

  // 드롭다운 위치 계산
  const calculateDropdownPosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 8, // 8px margin
      left: rect.left + window.scrollX + rect.width / 2 - 64 // 64px는 드롭다운 너비의 절반 (128px / 2)
    };
  };

  // 연도 드롭다운 토글
  const handleYearDropdownToggle = (event: React.MouseEvent) => {
    if (!showYearDropdown) {
      const position = calculateDropdownPosition(event.currentTarget as HTMLElement);
      setYearDropdownPosition(position);
    }
    setShowYearDropdown(!showYearDropdown);
    setShowMonthDropdown(false); // 다른 드롭다운 닫기
  };

  // 월 드롭다운 토글
  const handleMonthDropdownToggle = (event: React.MouseEvent) => {
    if (!showMonthDropdown) {
      const position = calculateDropdownPosition(event.currentTarget as HTMLElement);
      setMonthDropdownPosition(position);
    }
    setShowMonthDropdown(!showMonthDropdown);
    setShowYearDropdown(false); // 다른 드롭다운 닫기
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(effectiveCurrentDate);
    const firstDay = getFirstDayOfMonth(effectiveCurrentDate);
    const days = [];

    // 이전 달의 마지막 날들 계산
    const prevMonth = new Date(effectiveCurrentDate.getFullYear(), effectiveCurrentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // 이전 달 날짜들 (연하게 표시)
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      days.push(
        <div 
          key={`prev-${prevDate}`} 
          className="min-h-28 lg:min-h-0 flex flex-col items-center justify-start pt-2 lg:pt-4 relative"
        >
          <div className="text-lg mb-4 text-gray-300 font-semibold">
            {prevDate}
          </div>
        </div>
      );
    }

    // 실제 날짜들
    for (let date = 1; date <= daysInMonth; date++) {
      const dayEvents = getEventsForDate(date, effectiveCurrentDate, events);
      const isToday = new Date().getDate() === date && 
                     new Date().getMonth() === effectiveCurrentDate.getMonth() && 
                     new Date().getFullYear() === effectiveCurrentDate.getFullYear();

      const handleDateClick = () => {
        if (onDateClick) {
          const clickedDate = new Date(effectiveCurrentDate.getFullYear(), effectiveCurrentDate.getMonth(), date);
          onDateClick(clickedDate);
        }
      };

      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <div 
          key={date} 
          className="min-h-28 lg:min-h-0 cursor-pointer transition-colors hover:bg-gray-50 flex flex-col items-center justify-start pt-2 lg:pt-4 relative border-r border-gray-200 last:border-r-0"
          onClick={handleDateClick}
          title={hasEvents ? `${dayEvents.length}개의 일정 보기` : '새 일정 추가'}
        >
          <div 
            className={`text-sm lg:text-lg mb-2 lg:mb-4 font-semibold ${isToday ? 'text-white w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-base' : 'text-black'}`}
            style={isToday ? { backgroundColor: '#000000' } : { color: '#000000' }}
          >
            {date}
          </div>
          <div className="w-full space-y-1 absolute top-14 lg:top-16 left-0 right-0 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => {
              // 이벤트가 여러 날에 걸치는지 확인
              const isMultiDay = event.startDate.toDateString() !== event.endDate.toDateString();
              // 현재 날짜가 시작일인지 확인
              const currentDateObj = new Date(effectiveCurrentDate.getFullYear(), effectiveCurrentDate.getMonth(), date);
              const isStartDate = event.startDate.toDateString() === currentDateObj.toDateString();
              const isEndDate = event.endDate.toDateString() === currentDateObj.toDateString();
              
              const handleEventClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (onDateClick) {
                  const clickedDate = new Date(effectiveCurrentDate.getFullYear(), effectiveCurrentDate.getMonth(), date);
                  onDateClick(clickedDate);
                }
              };
              
              // 컬러 바 모서리 둥글기와 확장 스타일 결정
              const getBarStyle = () => {
                if (!isMultiDay) {
                  // 단일일 이벤트: 양쪽 모두 둥글게, 일반 마진
                  return {
                    rounded: 'rounded-sm',
                    marginClass: 'mx-1',
                    paddingClass: 'px-2',
                    textVisible: true,
                    width: 'calc(100% - 8px)'
                  };
                } else if (isStartDate && isEndDate) {
                  // 시작일과 끝일이 같은 경우 (하루짜리)
                  return {
                    rounded: 'rounded-sm',
                    marginClass: 'mx-1',
                    paddingClass: 'px-2',
                    textVisible: true,
                    width: 'calc(100% - 8px)'
                  };
                } else if (isStartDate) {
                  // 시작일: 왼쪽만 둥글게, 오른쪽으로 완전히 확장
                  return {
                    rounded: 'rounded-l-sm rounded-r-none',
                    marginClass: 'ml-1',
                    paddingClass: 'pl-2 pr-0',
                    textVisible: true,
                    width: 'calc(100% - 4px)'
                  };
                } else if (isEndDate) {
                  // 끝일: 오른쪽만 둥글게, 왼쪽으로 완전히 확장
                  return {
                    rounded: 'rounded-r-sm rounded-l-none',
                    marginClass: 'mr-1',
                    paddingClass: 'pl-0 pr-2',
                    textVisible: false,
                    width: 'calc(100% - 4px)'
                  };
                } else {
                  // 중간일: 직사각형, 양쪽으로 완전히 확장하여 연결
                  return {
                    rounded: 'rounded-none',
                    marginClass: '',
                    paddingClass: 'px-0',
                    textVisible: false,
                    width: '100%'
                  };
                }
              };

              const barStyle = getBarStyle();

              return (
                <div 
                  key={event.id} 
                  className={`text-white text-[10px] lg:text-xs py-0.5 lg:py-1 ${barStyle.paddingClass} ${barStyle.rounded} ${barStyle.marginClass} cursor-pointer hover:opacity-80 transition-opacity h-4 lg:h-5 flex items-center relative z-10`}
                  onClick={handleEventClick}
                  title={`${event.title} - 클릭하여 자세히 보기`}
                  style={{
                    backgroundColor: event.color,
                    width: barStyle.width
                  }}
                >
                  <div className="truncate w-full">
                    {barStyle.textVisible ? event.title : ''}
                  </div>
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-[10px] lg:text-xs text-gray-500 mx-1">+{dayEvents.length - 2}개</div>
            )}
          </div>
        </div>
      );
    }

    // 다음 달 날짜들 계산 (총 42칸 채우기 위해)
    const remainingCells = TOTAL_CALENDAR_CELLS - (firstDay + daysInMonth);
    
    // 다음 달 날짜들 (연하게 표시)
    for (let date = 1; date <= remainingCells; date++) {
      days.push(
        <div 
          key={`next-${date}`} 
          className="min-h-28 lg:min-h-0 flex flex-col items-center justify-start pt-2 lg:pt-4 relative border-r border-gray-200 last:border-r-0"
        >
          <div className="text-lg mb-4 text-gray-300 font-semibold">
            {date}
          </div>
        </div>
      );
    }

    return days;
  };

  const currentCalendar = calendarId ? CALENDAR_INFO[calendarId as keyof typeof CALENDAR_INFO] : null;

  return (
    <div className="flex-1 p-1 lg:p-4 overflow-hidden bg-white pb-0 lg:pb-4 flex flex-col max-w-full">
      {/* Header */}
      <div className="mb-2 lg:mb-6 w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="flex flex-col space-y-2 lg:hidden w-full">
          <div className="flex items-center justify-between min-w-0">
            {onBackToList && (
              <Button variant="ghost" size="sm" onClick={onBackToList} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-lg text-center flex-1 min-w-0 truncate px-2 text-[rgba(255,255,255,1)]">{calendarName || '캘린더'}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  const notification = await fetchNotifications();
                  setCurrentNotification(notification);
                  setShowNotification(true);
                } catch (error) {
                  console.error('알림 가져오기 실패:', error);
                }
              }}
              className="h-9 w-9 p-0 text-black hover:bg-gray-100 flex-shrink-0 mt-4 mr-3"
              title="알림 확인"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center space-x-4 w-full mt-4">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')} className="flex-shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center flex-1 min-w-0">
              <div 
                className="flex items-center justify-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                onClick={handleYearDropdownToggle}
                title="연도 선택"
              >
                <span className="text-[45px] text-[rgba(0,0,0,1)] font-bold">{formatYear(effectiveCurrentDate)}</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
              <div 
                className="flex items-center justify-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                onClick={handleMonthDropdownToggle}
                title="월 선택"
              >
                <span className="text-[45px] text-[rgba(0,0,0,1)] font-bold">{formatMonth(effectiveCurrentDate)}</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')} className="flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Year Dropdown Menu for Mobile - Fixed Positioning */}
          {showYearDropdown && (
            <div 
              className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] w-32 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                top: `${yearDropdownPosition.top}px`,
                left: `${yearDropdownPosition.left}px`
              }}
            >
              {getYearOptions(effectiveCurrentDate).map((year) => (
                <div
                  key={year}
                  className={`px-4 py-2 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    year === effectiveCurrentDate.getFullYear() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          {/* Month Dropdown Menu for Mobile - Fixed Positioning */}
          {showMonthDropdown && (
            <div 
              className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] w-32 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                top: `${monthDropdownPosition.top}px`,
                left: `${monthDropdownPosition.left}px`
              }}
            >
              {getMonthOptions().map((month) => (
                <div
                  key={month}
                  className={`px-4 py-2 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    month === effectiveCurrentDate.getMonth() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => handleMonthSelect(month)}
                >
                  {month + 1}월
                </div>
              ))}
            </div>
          )}

          {currentCalendar && (
            <div className="flex items-center justify-center space-x-2 w-full min-w-0">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: currentCalendar.color }}
              />
              <span className="text-sm text-[rgba(0,0,0,1)] min-w-0 truncate">{currentCalendar.name}</span>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {events.length}개 일정
              </Badge>
            </div>
          )}
        </div>
        
        {/* Desktop Header */}
        <div className="hidden lg:flex flex-col space-y-6 w-full overflow-hidden">
          <div className="flex items-center justify-between min-w-0">
            {onBackToList && (
              <Button variant="ghost" size="sm" onClick={onBackToList} className="flex-shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl text-center flex-1 min-w-0 truncate px-4">{calendarName || '캘린더'}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  const notification = await fetchNotifications();
                  setCurrentNotification(notification);
                  setShowNotification(true);
                } catch (error) {
                  console.error('알림 가져오기 실패:', error);
                }
              }}
              title="알림 확인"
              className="h-8 w-8 p-0 text-black hover:bg-gray-100 flex-shrink-0"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Navigation - Dropdown Style */}
          <div className="flex flex-col items-center space-y-2 w-full overflow-visible">
            {/* Year Dropdown */}
            <div className="relative dropdown-container">
              <div 
                className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={handleYearDropdownToggle}
                title="연도 선택"
              >
                <span className="text-3xl text-gray-800 text-[36px] font-bold">{formatYear(effectiveCurrentDate)}</span>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            
            {/* Month Dropdown */}
            <div className="relative dropdown-container">
              <div 
                className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                onClick={handleMonthDropdownToggle}
                title="월 선택"
              >
                <span className="text-4xl text-gray-900 font-bold text-[40px]">{effectiveCurrentDate.getMonth() + 1}</span>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Year Dropdown Menu - Fixed Positioning */}
          {showYearDropdown && (
            <div 
              className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] w-32 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                top: `${yearDropdownPosition.top}px`,
                left: `${yearDropdownPosition.left}px`
              }}
            >
              {getYearOptions(effectiveCurrentDate).map((year) => (
                <div
                  key={year}
                  className={`px-4 py-2 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    year === effectiveCurrentDate.getFullYear() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          {/* Month Dropdown Menu - Fixed Positioning */}
          {showMonthDropdown && (
            <div 
              className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[99999] w-32 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                top: `${monthDropdownPosition.top}px`,
                left: `${monthDropdownPosition.left}px`
              }}
            >
              {getMonthOptions().map((month) => (
                <div
                  key={month}
                  className={`px-4 py-2 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    month === effectiveCurrentDate.getMonth() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => handleMonthSelect(month)}
                >
                  {month + 1}월
                </div>
              ))}
            </div>
          )}

          {currentCalendar && (
            <div className="flex items-center justify-center space-x-3 w-full min-w-0">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: currentCalendar.color }}
              />
              <span className="text-base text-[rgba(9,9,9,1)] min-w-0 truncate">{currentCalendar.name}</span>
              <Badge variant="secondary" className="flex-shrink-0">
                {events.length}개 일정
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full mb-0 flex-1 flex flex-col min-h-[720px] lg:min-h-0 max-w-full overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-0 lg:mb-2 w-full min-w-0">
          {DAY_HEADERS.map((day, index) => (
            <div 
              key={day} 
              className={`py-2 lg:py-4 text-center text-lg lg:text-xl font-bold min-w-0 ${
                index === 0 ? 'text-red-500' : // Sunday
                index === 6 ? 'text-blue-500' : // Saturday
                'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 border-t border-b border-gray-200 bg-white flex-1 w-full max-w-full overflow-hidden">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Floating Action Button */}
      {onDateClick && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg z-50"
          onClick={() => onDateClick(new Date())}
          title="새 일정 추가"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* 알림창 컴포넌트 - YES/NO 동의 시스템 */}
      <NotificationToast
        open={showNotification}
        onOpenChange={setShowNotification}
        variant="consent"
        title={currentNotification?.title || "알림"}
        message={currentNotification?.message || "알림 메시지를 불러오는 중..."}
        badge={currentNotification?.badge || "알림"}
        showYesNo={true}
        onYes={async () => {
          try {
            if (currentNotification?.id) {
              await sendNotificationResponse(currentNotification.id, 'yes');
              console.log('YES 응답이 백엔드로 전송되었습니다.');
            }
          } catch (error) {
            console.error('YES 응답 전송 실패:', error);
          }
          setShowNotification(false);
          setCurrentNotification(null);
        }}
        onNo={async () => {
          try {
            if (currentNotification?.id) {
              await sendNotificationResponse(currentNotification.id, 'no');
              console.log('NO 응답이 백엔드로 전송되었습니다.');
            }
          } catch (error) {
            console.error('NO 응답 전송 실패:', error);
          }
          setShowNotification(false);
          setCurrentNotification(null);
        }}
        yesLabel="참여"
        noLabel="거절"
        autoClose={false}
        position="top"
      />
    </div>
  );
}