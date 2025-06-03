import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainHeader from './components/MainHeader';
import Footer from './components/Footer';
import Sidebar from './components/SideBar';
import Layout from './components/Layout';

import styled from 'styled-components';
import VoteList from './pages/VoteList';

// 푸쉬 시험중입니다
// 전체 페이지 레이아웃을 위한 스타일 (Footer가 하단에 붙도록)
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 뷰포트 전체 높이를 최소로 유지*/
`;

function App() {
  const [ setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // 50px 이상 스크롤되면
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <AppContainer>
        
        <Layout>
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
        </Layout>
      </AppContainer>
    </Router>
  );
}

export default App;