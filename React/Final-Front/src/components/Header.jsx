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

const HeaderBar = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleMyPageClick = () => {
    navigate('/mypage'); // '/mypage' 경로로 이동
  };

  const handleChulClick = () => {
    navigate('/adminattendance');
  };
  return (
    <HeaderContainer>
      <IconGroup>
        <FaBriefcase title="출근" />
        <FaSuitcase onClick={handleChulClick} title="퇴근" />
        <FaSignOutAlt title="로그아웃" onClick={() => navigate('/')} />
        <FaUserCircle
          title="마이페이지"
          onClick={handleMyPageClick} // 클릭 이벤트 추가
          style={{ cursor: 'pointer' }}
        />
        <WelcomeMessage>사용자님, 환영합니다!</WelcomeMessage>
      </IconGroup>
    </HeaderContainer>
  );
};

export default HeaderBar;
