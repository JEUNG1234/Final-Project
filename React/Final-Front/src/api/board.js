import api from './axios';
import { API_ENDPOINTS } from './config';

const BoardAPI = {
  // ✅ 게시글 목록 조회 (params: page, title, writer, categoryNo, companyCode 등)
  getBoardList: (params) => api.get(API_ENDPOINTS.BOARD.BASE, { params }),

  getBoardDetail: (id) => api.get(API_ENDPOINTS.BOARD.DETAIL(id)),
  createBoard: (boardData) => api.post(API_ENDPOINTS.BOARD.CREATE, boardData),
  updateBoard: (id, boardData) => api.patch(API_ENDPOINTS.BOARD.UPDATE(id), boardData),
  deleteBoard: (id) => api.delete(API_ENDPOINTS.BOARD.DELETE(id)),
  increaseView: (id) => api.patch(API_ENDPOINTS.BOARD.INCREASE_VIEW(id)),
};

export default BoardAPI;
