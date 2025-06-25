import api from './axios';
import { API_ENDPOINTS } from './config';

export const challengeService = {
  createChallenge: async (payload) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHALLENGE.BASE, payload);
      return response.data;
    } catch (error) {
      console.error('챌린지 생성 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};