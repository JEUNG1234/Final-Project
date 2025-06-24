import api from './axios';
import { API_ENDPOINTS } from './config';

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get(API_ENDPOINTS.DEPARTMENT.getDepartments);
    return response.data;
  },
};
