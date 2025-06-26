import api from './axios';
import { API_ENDPOINTS } from './config';

export const challengeService = {
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

  getAllChallenges: async (page = 0, size = 8) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.BASE, {
        params: {
          page,
          size,
          sort: 'challengeNo,desc',
        },
      });
      return response.data;
    } catch (error) {
      console.error('챌린지 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  getChallengeDetails: async (challengeNo) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CHALLENGE.BASE}/${challengeNo}`);
      return response.data;
    } catch (error) {
      console.error(`챌린지 상세 정보 조회 실패 (ID: ${challengeNo}):`, error);
      throw error;
    }
  },

  createCompletion: async (challengeNo, payload) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHALLENGE.COMPLETE(challengeNo), payload);
      return response.data;
    } catch (error) {
      console.error('챌린지 참여 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  checkActiveChallenge: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.CHECK_ACTIVE, {
        params: { userId },
      });
      return response.data.hasActiveChallenge;
    } catch (error) {
      console.error('활성 챌린지 상태 확인 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  // 나의 챌린지 목록 조회 함수 추가
  getMyChallenges: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.MY_CHALLENGES, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('나의 챌린지 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};