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
        sessionStorage.setItem('userId', user.token); // 로그인 성공시 새 토큰을 sessionStorage 에 저장
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
  checkUserIdDuplicate: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.CHECK_USER_ID}?userId=${userId}`);
      return response.data; // 예: { isDuplicate: true } 또는 false
    } catch (error) {
      console.log('아이디 중복 검사중 오류 발생', error);
      throw new Error('아이디 중복 검사 중 오류가 발생했습니다.');
    }
  },

  // 이메일 중복 검사
  checkEmailDuplicate: async (email) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.CHECK_EMAIL}?email=${email}`);
      return response.data; // 예: { isDuplicate: true } 또는 false
    } catch (error) {
      console.log('이메일 중복 검사중 오류 발생', error);
      throw new Error('이메일 중복 검사 중 오류가 발생했습니다.');
    }
  },

  // 비밀번호 유효성 검사 (규칙: 영문+숫자 조합 8~20자 등)
  validatePassword: (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return regex.test(password);
  },

  getUserInfo: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.BASE);
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
  EnrollAdmin: async ({ userId, password, checkPassword, userName, email, companyCode, jobCode }) => {
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
        jobCode,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  },

  deleteUser: async (userId) => {
    const response = await api.patch(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
    return response;
  },

  updateUser: async (updateInfo) => {
    const response = await api.patch(`${API_ENDPOINTS.USERS.UPDATEUSER}`, updateInfo);
    return response;
  },

  uploadProfileImage: async (userId, { imgUrl, size, originalName, changeName }) => {
    const response = await api.patch(`${API_ENDPOINTS.USERS.BASE}/${userId}${API_ENDPOINTS.USERS.UPLOADPROFILEIMAGE}`, {
      imgUrl,
      size,
      originalName,
      changeName,
    });
    return response.data;
  },

  convertPointsToVacation: async (userId) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.CONVERT_POINTS(userId));
      return response.data;
    } catch (error) {
      console.error('포인트 전환 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  getVacationCount: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.GET_VACATION_COUNT(userId));
      return response.data;
    } catch (error) {
      console.error('휴가 수 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};
