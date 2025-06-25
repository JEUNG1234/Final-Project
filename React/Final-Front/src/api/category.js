import api from './axios';
import { API_ENDPOINTS } from './config';

const CategoryAPI = {
  // 전체 카테고리 조회
  getAllCategories: () => api.get(API_ENDPOINTS.CATEGORY.BASE),

  // 특정 카테고리 상세 조회
  getCategoryDetail: (id) => api.get(API_ENDPOINTS.CATEGORY.DETAIL(id)),
};

export default CategoryAPI;
