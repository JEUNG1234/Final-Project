import EnrollAdmin from '../pages/mainpage/EnrollAdmin';
import api from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
 
  login: async (userId, password) => {
    try {
      console.log(API_ENDPOINTS.USERS.LOGIN);
      const { data } = await api.post(API_ENDPOINTS.USERS.LOGIN, { userId, userPwd: password });
      const user = data;
      if (user) {
        localStorage.setItem('userId', user.userId); // 로그인 성공 시 userId 저장
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
    const response = await api.get(`${API_ENDPOINTS.USERS.BASE}?userId=${userId}`);
    return response.data;
  },
  // 회원가입에서의 입력창 값들
  signUp: async ({ userId, password, checkPassword, userName, email, companyCode }) => {
    // 비동기로 응답, 회원가입이므로 post
    const response = await api.post(
      `${API_ENDPOINTS.USERS.SIGNUP}`,
      {
        userId,
        password,
        checkPassword,
        userName,
        email,
        companyCode,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  },
  EnrollAdmin: async ({ userId, password, checkPassword, userName, email, companyCode }) => {
    // 비동기로 응답, 회원가입이므로 post
    const response = await api.post(
      `${API_ENDPOINTS.USERS.ENROLLADMIN}`,
      {
        userId,
        password,
        checkPassword,
        userName,
        email,
        companyCode,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  },
};
