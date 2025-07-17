import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      attendanceStatus: null,
      isLoggingOut: false, // 로그아웃 진행 상태 추가

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
          isLoggingOut: false, // 로그인 시에는 플래그를 false로 설정
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
          isLoggingOut: true, // 로그아웃 시 플래그를 true로 설정
        });
      },

      finishLogout: () => {
        set({ isLoggingOut: false }); // 로그인 페이지에서 플래그를 리셋하는 함수
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      setAttendanceStatus: (status) => set({ attendanceStatus: status }),
    }),

    {
      name: 'user-storage', // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        attendanceStatus: state.attendanceStatus,
        isLoggingOut: state.isLoggingOut, // 플래그도 세션스토리지에 저장
      }),
    }
  )
);

export default useUserStore;
