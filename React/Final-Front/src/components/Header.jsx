// src/components/Header.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 3rem; /* 좌우 패딩을 유지하되, box-sizing 고려 */
  box-sizing: border-box; /* 패딩이 width에 포함되도록 설정 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: transparent;
  color: #fff;
  transition: background-color 0.3s ease;

  &.scrolled {
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem; /* 모바일에서 패딩 조정 */
  }

  /* 가로 스크롤 방지를 위한 추가 설정 */
  overflow-x: hidden;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: inherit;
  text-decoration: none;
  white-space: nowrap; /* 로고 텍스트가 줄바꿈되지 않도록 */

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem; /* 메뉴 아이템 간 간격 */

  @media (max-width: 768px) {
    /* 모바일에서는 메뉴 아이템이 너무 많을 경우 스크롤되거나 다른 형태로 변경 필요 */
    /* 여기서는 단순히 간격만 조정 */
    gap: 1.5rem;
    flex-wrap: wrap; /* 공간이 부족하면 줄바꿈 */
    justify-content: flex-end; /* 오른쪽 정렬 유지 */
  }
`;

const NavLink = styled(Link)`
  font-size: 1.1rem;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap; /* 링크 텍스트가 줄바꿈되지 않도록 */

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Header = ({ className }) => { // className prop을 받도록 수정
  return (
    <HeaderContainer className={className}>
      <Logo to="/">SOWM</Logo> {/* 이미지의 로고명에 맞춰 SOWM으로 변경 */}
      <Nav>
        <NavLink to="/system">시스템 소개</NavLink>
        <NavLink to="/login">로그인</NavLink>
        <NavLink to="/enroll">회원가입</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;