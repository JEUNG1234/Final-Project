import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBriefcase, FaSuitcase, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { MdAccessTime } from 'react-icons/md';
import useUserStore from '../Store/useStore';
import { attendanceService } from '../api/attendance';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { user, attendanceStatus, setAttendanceStatus, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (!user?.userId) {
        setAttendanceStatus(null);
        setLoading(false);
        return;
      }
      try {
        const status = await attendanceService.checkTodayStatus(user.userId);
        setAttendanceStatus(status);
        console.log('서버에서 받아온 출퇴근 상태:', status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, [user?.userId]); // userId 기준으로 호출

  const handleMyPageClick = () => {
    if (!user) {
      console.log(user);
      navigate('/login');
      return;
    }
    navigate('/mypage');
  };

  const handleLogoutClick = () => {
    logout();
    toast.info('로그아웃 되었습니다.');
  };

  const handleAttendanceClick = async () => {
    if (loading) {
      toast.info('출퇴근 상태를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!user?.userId) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    try {
      if (!attendanceStatus) {
        await attendanceService.clockIn(user.userId);
        toast.success('출근 완료!');
        setAttendanceStatus('w');
      } else if (attendanceStatus.toLowerCase() === 'w') {
        await attendanceService.clockOut(user.userId);
        toast.success('퇴근 완료!');
        setAttendanceStatus('l');
      } else if (attendanceStatus.toLowerCase() === 'l') {
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
