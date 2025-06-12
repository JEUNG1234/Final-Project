import React from 'react';
import styled from 'styled-components';
import { FaBriefcase, FaSuitcase, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

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

const HeaderBar = ({ user, onLogout }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const isAdmin = user && user.role === 'admin';

  const handleMyPageClick = () => {
    if (!user) {
      alert('로그인 후 마이페이지를 이용해주세요.');
      navigate('/login');
      return;
    }
    navigate('/mypage');
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // App.js에서 전달받은 로그아웃 함수 호출
    }
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <HeaderContainer>
      <IconGroup>
        <FaBriefcase title="출근/근태 현황" />
        <FaSuitcase title="퇴근/근태 현황" />
        <FaSignOutAlt title="로그아웃" onClick={handleLogoutClick} />
        <FaUserCircle
          title="마이페이지"
          onClick={handleMyPageClick} // 클릭 이벤트 추가
          style={{ cursor: 'pointer' }}
        />
        {user ? (
          <WelcomeMessage>
            {user.user_name}님, 환영합니다! ({isAdmin ? '관리자' : '직원'})
          </WelcomeMessage>
        ) : (
          <WelcomeMessage>로그인해 주세요.</WelcomeMessage>
        )}
      </IconGroup>
    </HeaderContainer>
  );
};

export default HeaderBar;
