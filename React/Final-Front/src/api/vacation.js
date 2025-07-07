import api from './axios';
import { API_ENDPOINTS } from './config';

export const vacationService = {
  vacationSubmit: async (requestBody) => {
    try {
      const response = await api.post(API_ENDPOINTS.VACATION.SUBMIT, requestBody);
      return response.data;
    } catch (error) {
      console.error('휴가 신청 실패:', error);
      throw error;
    }
  },
  vacationList: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VACATION.LIST}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('워케이션 수정 실패', error);
      throw error;
    }
  },
};
