import api from './axios';
import { API_ENDPOINTS } from './config';

/**
 * 투표 관련 API 요청을 처리하는 서비스 객체
 */
export const voteService = {
  /**
   * 새로운 투표를 생성합니다.
   * @param {object} voteData - 투표 생성에 필요한 데이터
   * @returns {Promise<any>} - API 응답 데이터
   */
  createVote: async (voteData) => {
    try {
      // API_ENDPOINTS.VOTES.BASE 경로로 POST 요청을 보냅니다.
      const response = await api.post(API_ENDPOINTS.VOTES.BASE, voteData);
      return response.data;
    } catch (error) {
      console.error('투표 생성 API 호출 중 오류 발생:', error);
      // 에러를 상위로 전파하여 컴포넌트에서 처리할 수 있도록 합니다.
      throw error;
    }
  },

  /**
   * 모든 투표 목록을 가져옵니다.
   * @returns {Promise<any>} - API 응답 데이터 (투표 목록)
   */
  getAllVotes: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VOTES.BASE);
      return response.data;
    } catch (error) {
      console.error('투표 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 특정 투표의 상세 정보를 가져옵니다.
   * @param {number} voteId - 조회할 투표의 ID
   * @returns {Promise<any>} - API 응답 데이터 (투표 상세 정보)
   */
  getVoteDetails: async (voteId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VOTES.BASE}/${voteId}`);
      return response.data;
    } catch (error) {
      console.error('투표 상세 정보 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};