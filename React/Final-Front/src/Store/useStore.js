import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        console.log('login userData:', userData);
        set({
          user: {
            userId: userData.userId,
            userName: userData.userName,
            jobCode: userData.jobCode,
            deptCode: userData.deptCode,
            companyCode: userData.companyCode,
          },
          token: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
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
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);

export default useUserStore;
