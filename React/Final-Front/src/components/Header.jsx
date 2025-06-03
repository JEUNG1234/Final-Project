import React from 'react';
import styled from 'styled-components';
import { FaBriefcase, FaSuitcase, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const HeaderContainer = styled.div`
  width: 70%;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: #2378ff;
    font-size: 18px;
    cursor: pointer;
  }
`;

const WelcomeMessage = styled.span`
  color: #666;
  font-size: 14px;
  margin-left: 12px;
`;

const HeaderBar = () => {
  return (
    <HeaderContainer>
      <IconGroup>
        <FaBriefcase title="가방1" />
        <FaSuitcase title="가방2" />
        <FaSignOutAlt title="로그아웃" />
        <FaUserCircle title="사용자" />
        <WelcomeMessage>사용자님, 환영합니다!</WelcomeMessage>
      </IconGroup>
    </HeaderContainer>
  );
};

export default HeaderBar;
