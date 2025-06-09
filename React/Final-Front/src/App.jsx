import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainHeader from './components/MainHeader'; // 메인 페이지 전용 헤더 (선택 사항)
import Footer from './components/Footer'; // 공통 푸터 또는 각 페이지별 푸터
import Layout from './components/Layout'; // 헤더와 사이드바가 있는 페이지들을 위한 레이아웃
import Login from './pages/Login';
import styled from 'styled-components';
import VoteList from './pages/VoteList';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import AdminAttendance from './pages/AdminAttendance';
import Workcation from './pages/Workcation';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  const [setScrolled] = useState(false); // setScrolled를 사용하지 않는다면 제거해도 됩니다.

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
        <Routes>
          {/* 1. 홈 페이지: MainHeader와 Footer만 있고 Sidebar 없음 */}
          <Route
            path="/"
            element={
              <>
                <MainHeader />
                <Home />
              </>
            }
          />

          {/* 2. 로그인 페이지: 헤더/사이드바 없음 (Login 컴포넌트 자체에 이미지 포함) */}
          <Route path="/login" element={<Login />} />

          {/* 3. 회원가입 페이지: 헤더/사이드바 없음 */}
          <Route path="/signup" element={<SignUp />} />

          {/* 4. 그 외 다른 페이지들: Layout 컴포넌트 (Header와 Sidebar 포함) 사용 */}
          {/* 이제 '/*'는 Main, Login, SignUp을 제외한 나머지 모든 경로를 의미합니다. */}
          <Route
            path="/*" // 이 catch-all 라우트는 명시된 위의 라우트들보다 하위에 있어야 합니다.
            element={
              <Layout>
                <Routes>
                  {/* Layout 안에 포함될 페이지들 */}
                  <Route path="/Workcation" element={<Workcation />} />
                  <Route path="/votelist" element={<VoteList />} />
                  
                  {/* 여기에 Sidebar와 Header가 필요한 다른 페이지들을 추가하세요 */}
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/adminattendance" element={<AdminAttendance />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>

      </AppContainer>
    </Router>
  );
}

export default App;