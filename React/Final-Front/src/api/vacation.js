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
      console.error('휴가 목록 불러오기 실패', error);
      throw error;
    }
  },

  vacationWaitList: async(userId) => {
        try {
      const response = await api.get(`${API_ENDPOINTS.VACATION.WAITLIST}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('휴가 목록 불러오기 실패', error);
      throw error;
    }
  },

  cancelVacations: async(vacationNos) => {
    try{
        console.log(vacationNos);
        const response = await api.delete(API_ENDPOINTS.VACATION.VADELETE, {data: vacationNos});
        return response.data;
    }catch(error) {
        console.error('휴가 신청 취소에 실패했습니다.', error);
        throw error;
    }
  },
  vacationAmount: async(userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VACATION.AMOUNT}?userId=${userId}`);
      return response.data;
    }catch(error) {
      console.error('보유 휴가일 수 불러오기 실패', error);
      throw error;
    }
  }
  
};
