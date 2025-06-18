import api from './axios';
import { API_ENDPOINTS } from './config';

export const attendanceService = {
  // 출근 요청
  clockIn: async (userId) => {
    try {
      const response = await api.post(API_ENDPOINTS.ATTENDANCE.CLOCK_IN, { userId });
      return response.data; // 예: "출근 완료"
    } catch (error) {
      console.error('출근 실패:', error);
      throw new Error('출근 처리 중 오류가 발생했습니다.');
    }
  },

  // 퇴근 요청
  clockOut: async (userId) => {
    try {
      const response = await api.put(API_ENDPOINTS.ATTENDANCE.CLOCK_OUT, { userId });
      return response.data; // 예: "퇴근 완료"
    } catch (error) {
      console.error('퇴근 실패:', error);
      throw new Error('퇴근 처리 중 오류가 발생했습니다.');
    }
  },

  // 오늘 출근 여부 확인
  checkTodayStatus: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ATTENDANCE.STATUS}/${userId}`);
      return response.data.status; // 예: "w" or "l" or null
    } catch (error) {
      console.error('근태 상태 조회 실패:', error);
      throw new Error('근태 상태 조회 중 오류가 발생했습니다.');
    }
  },

  // 유저 아이디별 전체 출근 리스트
  attendanceList: async (userId, userName) => {
    try {
      const response = await api.get(API_ENDPOINTS.ATTENDANCE.LIST, {
        params: {
          userId: userId,
          userName: userName,
        },
      });
      return response.data;
    } catch (error) {
      console.error('전체 출근 리스트 조회 실패', error);
    }
  },
};
