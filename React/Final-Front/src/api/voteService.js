// api/voteService.js

import api from './axios';
import { API_ENDPOINTS } from './config';

/**
 * 투표 관련 API 요청을 처리하는 서비스 객체
 */
export const voteService = {
  /**
   * 새로운 투표를 생성합니다.
   * @param {object} voteData - { userId, voteTitle, voteType, voteEndDate, options }
   * @returns {Promise<any>} - 생성된 투표의 ID
   */
  createVote: async (voteData) => {
    try {
      const response = await api.post(API_ENDPOINTS.VOTES.BASE, voteData);
      return response.data;
    } catch (error) {
      console.error('투표 생성 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 모든 투표 목록을 가져옵니다.
   * @param {string} userId - 현재 로그인한 사용자의 ID
   * @returns {Promise<any>} - 투표 목록
   */
  getAllVotes: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.VOTES.BASE, {
        params: {
          userId,
          page,
          size,
          sort: 'voteNo,desc' // 최신순 정렬
        }
      });
      return response.data;
    } catch (error) {
      console.error('투표 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 특정 투표의 상세 정보를 가져옵니다.
   * @param {number} voteId - 조회할 투표의 ID
   * @returns {Promise<any>} - 투표 상세 정보
   */
  getVoteDetails: async (voteId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VOTES.BASE}/${voteId}`);
      console.log('✅ [DEBUG] voteService - API 응답 데이터:', response.data);
      return response.data;
    } catch (error) {
      console.error('투표 상세 정보 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 사용자가 특정 항목에 투표합니다.
   * @param {number} voteId - 참여할 투표의 ID
   * @param {number} voteContentNo - 선택한 항목의 ID
   * @param {string} userId - 투표하는 사용자의 ID
   * @returns {Promise<any>}
   */
  castVote: async (voteId, voteContentNo, userId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.VOTES.BASE}/${voteId}/cast`, {
        voteContentNo,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('투표하기 API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  /**
   * 투표를 삭제합니다. (관리자용)
   * @param {number} voteId - 삭제할 투표의 ID
   * @returns {Promise<any>}
   */
  deleteVote: async (voteId, userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.VOTES.BASE}/${voteId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('투표 삭제 API 호출 중 오류 발생:', error);
      // 서버에서 보낸 구체적인 에러 메시지를 throw합니다.
      throw new Error(error.response?.data?.message || '투표 삭제 중 오류가 발생했습니다.');
    }
  },

  /**
   * 특정 항목에 투표한 사용자 목록을 가져옵니다.
   * @param {number} voteNo - 해당 항목이 속한 투표의 ID
   * @param {number} voteContentNo - 조회할 투표 항목의 ID
   * @returns {Promise<any>} - 투표자 목록
   */
  getVotersForOption: async (voteNo, voteContentNo) => {
    try {
      const url = API_ENDPOINTS.VOTES.GET_VOTERS(voteNo, voteContentNo);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('투표자 목록 조회 API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};