import api from './axios';
import { API_ENDPOINTS } from './config';

export const challengeService = {
  // ... (createChallenge는 기존과 동일)
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

  getAllChallenges: async (page = 0, size = 8, userId) => { // userId 파라미터 추가
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.BASE, {
        params: {
          page,
          size,
          sort: 'challengeNo,desc',
          userId, // userId 전달
        },
      });
      return response.data;
    } catch (error) {
      console.error('챌린지 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
  
  // ... (이하 기존 코드와 동일)
  getChallengeDetails: async (challengeNo) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.DETAIL(challengeNo));
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
  
  getCompletions: async (challengeNo, page = 0, size = 5) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.COMPLETIONS(challengeNo), {
        params: { page, size, sort: 'createdDate,desc' },
      });
      return response.data;
    } catch (error) {
      console.error(`인증글 목록 조회 실패 (챌린지 ID: ${challengeNo}):`, error);
      throw error;
    }
  },

  getMyCompletions: async (challengeNo, userId, page = 0, size = 5) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.MY_COMPLETIONS(challengeNo), {
        params: { userId, page, size, sort: 'createdDate,desc' },
      });
      return response.data;
    } catch (error) {
      console.error(`나의 인증글 목록 조회 실패 (챌린지 ID: ${challengeNo}):`, error);
      throw error;
    }
  },
  
  getCompletionDetail: async (completionNo) => {
    try {
      const response = await api.get(API_ENDPOINTS.CHALLENGE.COMPLETION_DETAIL(completionNo));
      return response.data;
    } catch (error) {
      console.error(`인증글 상세 정보 조회 실패 (ID: ${completionNo}):`, error);
      throw error;
    }
  },
};