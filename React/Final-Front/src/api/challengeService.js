import api from './axios';
import { API_ENDPOINTS } from './config';

export const challengeService = {
  // ... (createChallenge 함수는 동일)
  createChallenge: async (payload) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHALLENGE.BASE, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('챌린지 생성 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 페이징 처리된 챌린지 목록을 조회하는 함수
   * @param {number} page - 조회할 페이지 번호 (0부터 시작)
   * @param {number} size - 한 페이지에 보여줄 항목 수
   * @returns {Promise<any>} 페이징된 챌린지 목록 데이터
   */
  getAllChallenges: async (page = 0, size = 8) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.BASE, {
        params: {
          page,
          size,
          sort: 'challengeNo,desc', // 최신순 정렬
        },
      });
      return response.data;
    } catch (error) {
      console.error('챌린지 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};