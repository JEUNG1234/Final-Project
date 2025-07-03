import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBriefcase, FaSuitcase, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { MdAccessTime } from 'react-icons/md';
import useUserStore from '../Store/useStore';
import { attendanceService } from '../api/attendance';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Header = ({ onLogout }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { user } = useUserStore();
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (!user?.userId) {
        setAttendanceStatus(null);
        return;
      }
      try {
        const status = await attendanceService.checkTodayStatus(user.userId);
        setAttendanceStatus(status); // 서버 상태로 초기 세팅
      } catch (error) {
        console.error(error);
      }
    };
    fetchAttendanceStatus();
  }, [user]);

  const handleMyPageClick = () => {
    if (!user) {
      console.log(user);
      toast.warning('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }
    navigate('/mypage');
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // App.js에서 전달받은 로그아웃 함수 호출
      toast.info('로그아웃 되었습니다.');
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    }
  };

  const handleAttendanceClick = async () => {
    const userId = user?.userId;

    if (!userId) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    try {
      if (!attendanceStatus) {
        // 출근 기록이 없으면 출근 처리
        await attendanceService.clockIn(userId);
        toast.success('출근 완료!');
        setAttendanceStatus('w');
      } else if (attendanceStatus === 'w') {
        // 이미 출근했으면 퇴근 처리
        await attendanceService.clockOut(userId);
        toast.success('퇴근 완료!');
        setAttendanceStatus('l');
      } else if (attendanceStatus === 'l') {
        toast.info('이미 퇴근하셨습니다.');
      }
    } catch (error) {
      toast.error(error.message || '오류가 발생했습니다.');
    }
  };

  return (
    <HeaderContainer>
      <IconGroup>
        <MdAccessTime title="출근하기" onClick={handleAttendanceClick} />
        <FaSignOutAlt title="로그아웃" onClick={handleLogoutClick} />
        <FaUserCircle
          title="마이페이지"
          onClick={handleMyPageClick} // 클릭 이벤트 추가
          style={{ cursor: 'pointer' }}
        />

        {user ? (
          <WelcomeMessage>{user.userName}님, 환영합니다!</WelcomeMessage>
        ) : (
          <WelcomeMessage>로그인해 주세요.</WelcomeMessage>
        )}
      </IconGroup>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100%;
  height: 100px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  position: fixed;
  top: 0; /* 추가 */
  left: 0; /* 추가 */
  right: 0; /* 추가 */
  z-index: 99;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: #2378ff;
    font-size: 22px;
    cursor: pointer;
  }
`;

const WelcomeMessage = styled.span`
  color: #929393;
  font-size: 18px;
  font-weight: 500;
  margin-left: 12px;
`;

export default Header;
