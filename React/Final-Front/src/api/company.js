import api from './axios';
import { API_ENDPOINTS } from './config';

export const companyService = {
  // 회사신청에서의 입력창 값들
  enrollCompany: async ({ companyCode, companyName, companyPhone, companyAddress }) => {
    console.log('enrollCompany API URL:', API_ENDPOINTS.COMPANY.ENROLLCOMPANY);
    // 비동기로 응답, 회사신청이므로 post
    const response = await api.post(
      `${API_ENDPOINTS.COMPANY.ENROLLCOMPANY}`,

      {
        companyCode,
        companyName,
        companyPhone,
        companyAddress,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('API URL:', API_ENDPOINTS.COMPANY.ENROLLCOMPANY);
    return response;
  },
};
