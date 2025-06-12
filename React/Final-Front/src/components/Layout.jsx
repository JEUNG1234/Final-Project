import React from 'react';
import styled from 'styled-components';
import Header from './Header'; // HeaderContainer를 사용하는 컴포넌트
import Sidebar from './SideBar'; // SidebarContainer를 사용하는 컴포넌트

const Layout = ({ children, user, onLogout }) => {
  return (
    <LayoutContainer>
      <Sidebar user={user} />
      <Header user={user} onLogout={onLogout} />{' '}
      <MainContentWrapper>
        <Content>{children}</Content>
      </MainContentWrapper>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh; /* 전체 뷰포트 높이 사용 */
  overflow: hidden; /* 페이지 전체 스크롤 방지, 내부 콘텐츠에만 스크롤 허용 */
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  padding-top: 100px; /* 헤더 높이만큼 상단 패딩 */
  padding-left: 300px; /* 사이드바 너비만큼 왼쪽 패딩 */

  height: 100vh; /* 이 높이가 설정되어야 overflow-y: auto가 작동 */
  overflow-y: auto; /* 세로 스크롤 허용 */

  background-color: #f0f7ff; /* 콘텐츠 영역의 배경색 */

  /* 스크롤바 스타일링 (선택 사항) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

const Content = styled.main`
  flex-grow: 1;
`;

export default Layout;
