
export interface Calendar {
  id: string;
  name: string;
  description?: string;
  color: string;
  isVisible: boolean;
  isDefault?: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date; // 기간 일정의 종료일
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  color: string;
  isAllDay: boolean;
  isMultiDay?: boolean; // 여러 날에 걸친 일정인지 여부
  reminder?: number; // minutes before
  calendarId: string; // 어느 캘린더에 속하는지
}



export type EventCategory = 'personal' | 'work' | 'important' | 'family' | 'health';

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarState {
  calendars: Calendar[];
  currentCalendarId: string | null;
  events: Event[];
  selectedDate: Date | null;
  currentDate: Date;
  viewMode: ViewMode;
  isDarkMode: boolean;
  searchQuery: string;
  selectedCategory: EventCategory | 'all';
}
