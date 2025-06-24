import api from './axios';
import { API_ENDPOINTS } from './config';

export const adminService = {
  // 직원 관리 함수
  MemberManagement: async ({ createdDate, userName, jobCode, deptCode, email, companyCode }) => {
    const params = {};
    if (createdDate) params.createdDate = createdDate;
    if (userName) params.userName = userName;
    if (jobCode) params.jobCode = jobCode;
    if (deptCode) params.deptCode = deptCode;
    if (email) params.email = email;
    if (companyCode) params.companyCode = companyCode;

    const response = await api.get(API_ENDPOINTS.ADMIN.MemberManagement, {
      params: params,
    });
    return response.data;
  },
  // 직원 승인 페이지
  getUnapprovedEmployees: async ({ companyCode }) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.getUnapprovedEmployees, {
      params: { companyCode },
    });
    return response.data;
  },

  // 직원 승인하는  함수
  approveUser: async (userId, status = 'Y', jobCode = 'J1') => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN.approveUser}${userId}`, {
      status,
      jobCode,
    });
    return response.data;
  },

  // 직원 직급, 부서 변경
  UpdateMemberRole: async (userId, payload) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN.UpdateMemberRole}${userId}`, payload);
    return response.data;
  },

  // 직원 거부하는 함수
  rejectUser: async (userId) => {
    const response = await api.patch(`/api/admin/${userId}`, { status: 'N' });
    return response.data;
  },

  // 회사별로 직원 근태 정보 가져오기
  getAllAttendanceByCompanyCode: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN.getAllAttendanceByCompanyCode}?userId=${userId}`);
      return response.data;
    } catch (err) {
      console.log('에러', err);
    }
  },

  // 당일 회사별 직원 근태 정보 가져오기
  getTodayAttendance: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN.getTodayAttendance}?userId=${userId}`);
      return response.data;
    } catch (err) {
      console.log('에러', err);
    }
  },

  // 근태 정보 수정하기
  updateAttendTime: async (updateData) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.ADMIN.updateAttendTime}`, updateData);
      console.log('현재 출퇴근 데이터', response.data);
      return response.data;
    } catch (err) {
      console.log('에러 발생', err);
    }
  },
};
