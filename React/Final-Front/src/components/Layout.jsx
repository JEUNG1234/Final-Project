import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './SideBar';

const Layout = ({ children }) => {
  return (
    <>
     <div style={{ display: 'flex' }}>
    <Sidebar/>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Content>{children}</Content>
    
      </div>
      </div>
    </>
  );
};

const Content = styled.main`
  min-height: calc(100vh - 68px);
`;

export default Layout;