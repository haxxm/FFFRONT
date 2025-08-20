import axios, { type AxiosRequestHeaders } from 'axios';
import type { User, CalendarEvent, CommunityPost, AuthResponse } from './types';

// 1. 원하시는 백엔드 주소를 상수로 지정합니다.
const API_BASE_URL = 'http://192.168.18.120:5000/api';

const apiInstance = axios.create({ baseURL: API_BASE_URL, headers:{'Content-Type':'application/json'} });

// 2. 모든 API 함수들을 하나의 객체에 담습니다.
const api = {
  // --- Auth ---
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiInstance.post('/auth/login', { userId: username, userPw: password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },
  // ... registerUser, logout 등 다른 Auth 함수들

  // --- Calendar ---
  fetchEvents: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    const response = await apiInstance.get('/calendar/schedules', { params: { startDate, endDate } });
    return response.data;
  },
  addEvent: async (eventData: Omit<CalendarEvent, 'eventNum'>): Promise<CalendarEvent> => {
    const response = await apiInstance.post('/calendar/schedules', eventData);
    return response.data;
  },
  updateEvent: async (id: number, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const response = await apiInstance.put(`/calendar/schedules/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id: number): Promise<void> => {
    await apiInstance.delete(`/calendar/schedules/${id}`);
  },

  // --- Community ---
  fetchPosts: async (): Promise<CommunityPost[]> => {
    const response = await apiInstance.get('/community/posts');
    return response.data;
  },
  // ... createPost 등 다른 Community 함수들
};

// Axios 인터셉터 설정 (토큰 추가)
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // 이전 헤더 타입 오류를 해결한 코드
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
  }
  return config;
});


// 3. 완성된 api 객체를 default로 export 합니다.
export default api;