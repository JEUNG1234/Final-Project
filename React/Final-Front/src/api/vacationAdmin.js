import api from './axios';
import { API_ENDPOINTS } from './config';

export const vacationAdminService = {
  getvactionlist: async (companyCode) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VACATIONADMIN.getvacationlist}`, {
        params: { companyCode },
      });
      return response.data;
    } catch (error) {
      console.error('휴가 정보를 가져오지 못했습니다. ', error);
      throw error;
    }
  },

  updateVacationStatus: async (data) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.VACATIONADMIN.updateVacationStatus}`, data);
      return response.data;
    } catch (err) {
      console.log('휴가 승인을 실패했습니다. ', err);
    }
  },

  getAllVacationList: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VACATIONADMIN.getAllVacationList}`);
      return response.data;
    } catch (err) {
      console.log('전체 휴가 리스트 불러오기 실패', err);
    }
  },
};
