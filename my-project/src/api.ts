import axios from 'axios';

import type { Event } from './types/calendar';

const apiClient = axios.create({
  baseURL: '/api', // API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for error handling
const handleApiError = (error: any) => {
  console.error('API Error:', error.response ? error.response.data : error.message);
  throw error;
};

// --- Auth ---

export const registerUser = async (userData: any) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- Calendar ---

export const getSchedules = async (startDate: string, endDate: string) => {
  try {
    const response = await apiClient.get('/calendar/schedules', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const response = await apiClient.get(`/calendar/schedules/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addSchedule = async (scheduleData: Partial<Event>) => {
  try {
    const response = await apiClient.post('/calendar/schedules', scheduleData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateSchedule = async (id: string, scheduleData: Partial<Event>) => {
  try {
    const response = await apiClient.put(`/calendar/schedules/${id}`, scheduleData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    const response = await apiClient.delete(`/calendar/schedules/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const shareCalendar = async (id: string, targetUserId: string) => {
  try {
    const response = await apiClient.post(`/calendar/share/${id}`, { targetUserId });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- AI Agent ---

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/ai/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const chatWithAI = async (message: string) => {
  try {
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAISuggestion = async () => {
  try {
    const response = await apiClient.get('/ai/suggestion');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const planAlarms = async (planData: any) => {
  try {
    const response = await apiClient.post('/ai/alarms/plan', planData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const suggestAlarms = async (scheduleId: number) => {
  try {
    const response = await apiClient.post('/ai/alarms/suggest', { scheduleId });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const applyAlarms = async (scheduleId: number, choices: any[]) => {
  try {
    const response = await apiClient.post('/ai/alarms/apply', { scheduleId, choices });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAlarms = async (scheduleId?: number) => {
  try {
    const response = await apiClient.get('/ai/alarms', {
      params: { scheduleId },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteAlarm = async (id: string) => {
  try {
    const response = await apiClient.delete(`/ai/alarms/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- Additional Features ---

/**
 * Add a friend
 * POST /api/friends
 * @param friendId The ID of the friend to add
 */
export const addFriend = async (friendId: string) => {
  try {
    const response = await apiClient.post('/friends', { friendId });
    return response.data; // { message: "친구 추가 완료" }
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get community posts
 * GET /api/community/posts
 */
export const getCommunityPosts = async () => {
  try {
    const response = await apiClient.get('/community/posts');
    return response.data; // [{ id: 1, title: "게시글 제목", ... }]
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Create a community post
 * POST /api/community/posts
 * @param postData The data for the new post
 */
export const createCommunityPost = async (postData: { title: string; content: string; }) => {
  try {
    const response = await apiClient.post('/community/posts', postData);
    // The spec says the response is a stringified JSON, axios might parse it automatically.
    // If not, we might need to do JSON.parse(response.data)
    return response.data; // { id: 7001, message: "작성 완료" }
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Create a comment on a community post
 * POST /api/community/posts/{id}/comments
 * @param postId The ID of the post to comment on
 * @param content The content of the comment
 */
export const createCommunityComment = async (postId: string, content: string) => {
  try {
    const response = await apiClient.post(`/community/posts/${postId}/comments`, { content });
    return response.data; // { comment_id: 8101, message: "댓글 등록 완료" }
  } catch (error) {
    handleApiError(error);
  }
};