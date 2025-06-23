
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
       console.log("::worationNo",workationNo);
      const response = await api.patch(API_ENDPOINTS.WORKATION.DELETE,{ workationNo } )
      return response.data;
    } catch (error) {
      console.error('워케이션 삭제 실패', error)
      throw error;
    }
  },
  workationList: async (companyCode) => {
    try {
      console.log(companyCode);
      const response = await api.get(`${API_ENDPOINTS.WORKATION.LIST}?companyCode=${companyCode}`);
      return response.data;
    } catch (error) {
      console.error(' 워케이션 리스트 조회 실패:', error);
      throw error;
    }
  },
  workationInfo: async(locationNo) =>{
    try{
      const response = await api.get(`${API_ENDPOINTS.WORKATION.INFO}?locationNo=${locationNo}`)
      return response.data;
    }catch (error) {
      console.error('워케이션 정보를 불러오는데 실패했습니다.', error);
      throw error;
    }
  },
  workationSubmit: async(requestBody) =>{
    try{
      const response = await api.post(API_ENDPOINTS.WORKATION.SUBMIT, requestBody);
      return response.data;
    }catch(error) {
      console.error('워케이션 신청에 실패했습니다.', error);
      throw error;
    }
  },
};
