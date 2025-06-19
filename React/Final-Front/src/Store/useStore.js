import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({
          user: {
            userId: userData.userId,
            userName: userData.userName,
            jobCode: userData.jobCode?.jobCode,
            deptCode: userData.deptCode?.deptCode,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'user-storage', // localStorage에 저장될 키 이름
      // storage: localStorage, // 기본은 localStorage (생략해도 됨)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
