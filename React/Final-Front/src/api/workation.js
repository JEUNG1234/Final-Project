
import api from './axios';
import { API_ENDPOINTS } from './config';

export const workationService = {
  create: async (requestBody) => {
    try {
      const response = await api.post(API_ENDPOINTS.WORKATION.CREATE, requestBody);
      return response.data; // ✅ 이걸 꼭 반환해야 사용 가능
    } catch (error) {
      console.error('워크케이션 등록 실패:', error);
      throw error;
    }
  },
  workationList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.WORKATION.LIST);
      return response.data;
    } catch (error) {
      console.error(' 워케이션 리스트 조회 실패:', error);
      throw error;
    }
  }
};
