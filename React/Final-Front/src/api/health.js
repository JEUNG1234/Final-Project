import api from './axios';
import { API_ENDPOINTS } from './config';

export const healthService = {
  mentalquestion: async ({ userId, questions, scores }) => {
    try {
      const questionScores = questions.map((question, idx) => ({
        question,
        score: scores[idx],
      }));
      const response = await api.post(API_ENDPOINTS.HEALTH.mentalquestion, {
        userId,
        questionScores,
      });
      return response.data;
    } catch (err) {
      console.error('멘탈 검사 에러:', err);
      throw err;
    }
  },

  mentalresult: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH.mentalresult, {
        params: { userId },
      });
      console.log('심리검사 받아온 데이터 : ', response.data);
      return response.data;
    } catch (err) {
      console.error('검사 결과 조회 실패:', err);
      throw err;
    }
  },
};
