import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MainHeader = () => { // className prop 제거
  return (
    <HeaderContainer> {/* className prop 전달 제거 */}
      <Logo to="/">SOWM</Logo>
      <Nav>
        <NavLink to="/#system-introduction">시스템 소개</NavLink>
        <NavLink to="/login">로그인</NavLink>
        <NavLink to="/signup">회원가입</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: #ffffff; /* 항상 흰색 배경 */
  color: #000000; /* 항상 검정색 텍스트 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 항상 그림자 표시 (원한다면) */
  transition: none; /* 배경/색상/그림자 변화 없음 */

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }

  overflow-x: hidden;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const NavLink = styled(Link)`
  font-size: 1.1rem;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export default MainHeader;