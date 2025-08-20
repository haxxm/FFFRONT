export type User = {
  userNum: number;
  userId: string;
  userName: string;
  userMail: string;
  userPw: string; // userPw 속성 추가
};

export type CalendarEvent = {
  eventNum: number;
  calendarNum: number;
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  eventContent?: string;
};

// Comment 타입을 한번만 정의하도록 수정
export type Comment = {
  commentNum: number;
  userId: number;
  content: string;
  createdAt: string;
};

export type CommunityPost = {
  postNum: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  author?: User;
  comments?: Comment[];
};

export type Announcement = {
  id: number;
  title: string;
  author: string;
  content: string;
  timestamp: Date;
  isPinned: boolean;
};

export type AuthResponse = {
  message: string;
  accessToken?: string;
  error?: string;
};