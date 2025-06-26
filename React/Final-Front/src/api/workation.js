import api from './axios';
import { API_ENDPOINTS } from './config';

export const workationService = {
  create: async (requestBody) => {
    try {
      const response = await api.post(API_ENDPOINTS.WORKATION.CREATE, requestBody);
      return response.data;
    } catch (error) {
      console.error('워크케이션 등록 실패:', error);
      throw error;
    }
  },
  update: async (requestBody) => {
    try {
      const response = await api.patch(API_ENDPOINTS.WORKATION.UPDATE, requestBody);
      return response.data;
    } catch (error) {
      console.error('워케이션 수정 실패', error);
      throw error;
    }
  },
  delete: async (workationNo) => {
    try {
      const response = await api.patch(API_ENDPOINTS.WORKATION.DELETE, { workationNo });
      return response.data;
    } catch (error) {
      console.error('워케이션 삭제 실패', error);
      throw error;
    }
  },
  workationList: async (companyCode) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.WORKATION.LIST}?companyCode=${companyCode}`);
      return response.data;
    } catch (error) {
      console.error(' 워케이션 리스트 조회 실패:', error);
      throw error;
    }
  },
  workationInfo: async (locationNo) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.WORKATION.INFO}?locationNo=${locationNo}`);
      return response.data;
    } catch (error) {
      console.error('워케이션 정보를 불러오는데 실패했습니다.', error);
      throw error;
    }
  },
  workationSubmit: async (requestBody) => {
    try {
      const response = await api.post(API_ENDPOINTS.WORKATION.SUBMIT, requestBody);
      return response.data;
    } catch (error) {
      console.error('워케이션 신청에 실패했습니다.', error);
      throw error;
    }
  },

  workationSubList: async (companyCode) => {
    try {
      console.log('2');
      const response = await api.get(`${API_ENDPOINTS.WORKATION.SUBLIST}?companyCode=${companyCode}`);
      return response.data;
    } catch (error) {
      console.error(' 워케이션 리스트 조회 실패:', error);
      throw error;
    }
  },

  workationApprovedUpdate: async (workationSubNo) => {
    try {
      console.log(workationSubNo);
      const response = await api.patch(API_ENDPOINTS.WORKATION.SUBUPDATE, workationSubNo);
      return response.data;
    } catch (error) {
      console.error('워케이션 승인에 실패했습니다.', error);
      throw error;
    }
  },
  handleReturnAction: async (workationSubNo) => {
    try {
      console.log('여기까지 옴', workationSubNo);
      const response = await api.patch(API_ENDPOINTS.WORKATION.RETURNUPDATE, workationSubNo);
      return response.data;
    } catch (error) {
      console.error('워케이션 승인에 실패했습니다.', error);
      throw error;
    }
  },
  workationMySubList: async (userId) => {
    try {
      console.log('여기까지 옴', userId);
      const response = await api.get(`${API_ENDPOINTS.WORKATION.MYLIST}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('워케이션 신청 목록을 불러오는데 실패했습니다.', error);
      throw error;
    }
  },
};
