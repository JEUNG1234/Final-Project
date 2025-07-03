import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('user-storage'); // zustand persist 스토리지도 클리어
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
      name: 'user-storage', // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);

export default useUserStore;
