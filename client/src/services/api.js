import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on auth pages
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// API Helper Functions
// ============================================

/**
 * Authentication API
 */
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  
  // Email verification
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: () => api.post('/auth/resend-otp'),
  
  // Password reset
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  
  // Account deletion
  deleteAccount: (data) => api.delete('/auth/delete-account', { data }),
};

/**
 * Users API (Admin)
 */
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

/**
 * AI Tools API
 */
export const toolsAPI = {
  getAll: (params) => api.get('/tools', { params }),
  getOne: (id) => api.get(`/tools/${id}`),
  create: (data) => api.post('/tools', data),
  update: (id, data) => api.put(`/tools/${id}`, data),
  delete: (id) => api.delete(`/tools/${id}`),
  bookmark: (id) => api.post(`/tools/${id}/bookmark`),
  getBookmarks: () => api.get('/tools/bookmarks/me'),
};

/**
 * AI Chat API
 */
export const chatsAPI = {
  getAll: (params) => api.get('/chats', { params }),
  getOne: (id) => api.get(`/chats/${id}`),
  create: (data) => api.post('/chats', data),
  sendMessage: (id, data) => api.post(`/chats/${id}/message`, data),
  quickChat: (data) => api.post('/chats/quick', data),
  delete: (id) => api.delete(`/chats/${id}`),
  updateTitle: (id, title) => api.put(`/chats/${id}`, { title }),
};

/**
 * Courses API
 */
export const coursesAPI = {
  // Course CRUD
  getAll: (params) => api.get('/courses', { params }),
  getOne: (id) => api.get(`/courses/${id}`),
  getFeatured: () => api.get('/courses/featured'),
  getCategories: () => api.get('/courses/categories'),
  getMyCourses: () => api.get('/courses/my-courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  
  // Enrollment
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  
  // Lessons
  addLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  updateLesson: (courseId, lessonId, data) => api.put(`/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
  completeLesson: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  
  // Quiz
  addQuiz: (id, data) => api.post(`/courses/${id}/quiz`, data),
  submitQuiz: (id, answers) => api.post(`/courses/${id}/quiz/submit`, { answers }),
};

/**
 * Upload API (Cloudinary)
 */
export const uploadAPI = {
  // Upload avatar - returns { url, user }
  avatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload course thumbnail - returns { url, course }
  courseThumbnail: (courseId, file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return api.post(`/upload/course-thumbnail/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload tool icon - returns { url, tool }
  toolIcon: (toolId, file) => {
    const formData = new FormData();
    formData.append('icon', file);
    return api.post(`/upload/tool-icon/${toolId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload general image - returns { url, filename, size }
  image: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Delete image
  delete: (url) => api.delete('/upload/delete', { data: { url } }),
};

/**
 * Prompts API
 */
export const promptsAPI = {
  getAll: (params) => api.get('/prompts', { params }),
  getOne: (id) => api.get(`/prompts/${id}`),
  create: (data) => api.post('/prompts', data),
  update: (id, data) => api.put(`/prompts/${id}`, data),
  delete: (id) => api.delete(`/prompts/${id}`),
  favorite: (id) => api.post(`/prompts/${id}/favorite`),
  unfavorite: (id) => api.delete(`/prompts/${id}/favorite`),
  getFavorites: () => api.get('/prompts/favorites/me'),
};

/**
 * Support API
 */
export const supportAPI = {
  // User endpoints
  create: (data) => api.post('/support', data),
  
  // Admin endpoints
  getAll: (params) => api.get('/support', { params }),
  getOne: (id) => api.get(`/support/${id}`),
  updateStatus: (id, data) => api.put(`/support/${id}/status`, data),
  delete: (id) => api.delete(`/support/${id}`),
};
