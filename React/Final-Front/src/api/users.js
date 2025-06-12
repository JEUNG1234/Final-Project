import api from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
  login: async (userId, password) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS.LOGIN(userId, password));
      const user = data[0];
      if (user) {
        localStorage.setItem('userId', user.user_id); // 로그인 성공 시 userId 저장
      }
      return user;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        console.log(userId, password);
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },
  getUserInfo: async (userId) => {
    const response = await api.get(`${API_ENDPOINTS.USERS.BASE}?user_id=${userId}`);
    return response.data[0];
  },
};
