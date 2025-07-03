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
        console.log('--- Logout function initiated ---');
        console.log('Before removal, sessionStorage token:', sessionStorage.getItem('token'));
        console.log('Before removal, sessionStorage userId:', sessionStorage.getItem('userId'));

        // 세션 스토리지에서 직접 관리하는 항목들도 제거
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('user-storage'); // zustand persist 스토리지도 클리어

        console.log('After removal, sessionStorage token:', sessionStorage.getItem('token'));
        console.log('After removal, sessionStorage userId:', sessionStorage.getItem('userId'));
        console.log('--- Logout function finished ---');

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
