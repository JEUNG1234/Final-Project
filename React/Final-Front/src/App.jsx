import React, { useState, useEffect } from 'react';
import theme from './styles/theme';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/mainpage/Home';
import MainHeader from './components/MainHeader'; // 메인 페이지 전용 헤더 (선택 사항)
import Footer from './components/Footer'; // 공통 푸터 또는 각 페이지별 푸터
import Layout from './components/Layout'; //
import Login from './pages/mainpage/Login';
import styled, { ThemeProvider } from 'styled-components';
import VoteList from './pages/VoteList';
import VoteResult from './pages/VoteResult';
import VoteCreate from './pages/VoteCreate';
import SignUp from './pages/mainpage/SignUp';
import MyPage from './pages/MyPage';
import WorkcationList from './pages/workcationpage/WorkcationList';
import MemberDashBoard from './pages/MemberDashBoard';
import CommunityBoard from './pages/communitypage/CommunityBoard';
import AddBoard from './pages/communitypage/AddBoard';
import EditBoard from './pages/communitypage/EditBoard';
import EnrollCompany from './pages/mainpage/EnrollCompany';
import EnrollAdmin from './pages/mainpage/EnrollAdmin';
import WorkcationDetail from './pages/workcationpage/WorkcationDetail';
import Challenge from './pages/challengepage/Challenge';
import CommunityBoardDetail from './pages/communitypage/CommunityBoardDetail';
import MemberAttendance from './pages/attendancePage/MemberAttendance';
import AdminAttendance from './pages/attendancePage/AdminAttendance';
import HealthCareMain from './pages/healthcarepage/HealthCareMain';
import ChallengeCreate from './pages/challengepage/ChallengeCreate';
import EmployeeManagement from './pages/EmployeeManagement';
import EmployeeApproval from './pages/EmployeeApproval';
import WorkcationAdmin from './pages/workcationpage/WorkcationAdmin';
import ChallengeDetail from './pages/challengepage/ChallengeDetail';
import MyCallenge from './pages/challengepage/MyCallenge';
import MentalCareTest from './pages/healthcarepage/MentalCareTest';
import PhysicalCareTest from './pages/healthcarepage/PhysicalCareTest';
import MentalCareResult from './pages/healthcarepage/MentalCareResult';
import PhysicalCareResult from './pages/healthcarepage/PhysicalCareResult';
import TestResult from './pages/healthcarepage/TestResult';

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
    <ThemeProvider theme={theme}>
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
            <Route path="/enrollcompany" element={<EnrollCompany />} />
            <Route path="/enrolladmin" element={<EnrollAdmin />} />

            {/* 4. 그 외 다른 페이지들: Layout 컴포넌트 (Header와 Sidebar 포함) 사용 */}
            {/* 이제 '/*'는 Main, Login, SignUp을 제외한 나머지 모든 경로를 의미합니다. */}
            <Route
              path="/*" // 이 catch-all 라우트는 명시된 위의 라우트들보다 하위에 있어야 합니다.
              element={
                <Layout>
                  <Routes>
                    {/* Layout 안에 포함될 페이지들 */}
                    <Route path="/workcationlist" element={<WorkcationList />} />
                    <Route path="/votelist" element={<VoteList />} />
                    <Route path="/voteresult/:voteId" element={<VoteResult />} />
                    <Route path="/votecreate" element={<VoteCreate />} />
                    <Route path="/employeemanagement" element={<EmployeeManagement />} />
                    <Route path="/employeeapproval" element={<EmployeeApproval />} />
                    {/* 여기에 Sidebar와 Header가 필요한 다른 페이지들을 추가하세요 */}
                    <Route path="/memberdashboard" element={<MemberDashBoard />} />
                    {/* 챌린지 페이지 */}
                    <Route path="/challenge" element={<Challenge />} />
                    <Route path="/challenge/create" element={<ChallengeCreate />} />
                    {/* 상세 챌린지 페이지 */}
                    <Route path="/challenge/:id" element={<ChallengeDetail />} />
                    {/* 내 챌린지 페이지 */}
                    <Route path="/myChallenge" element={<MyCallenge />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/adminattendance" element={<AdminAttendance />} />
                    {/* 직원 커뮤니티 게시판 페이지 */}
                    <Route path="/communityboard" element={<CommunityBoard />} />
                    <Route path="/communityboard/:id" element={<CommunityBoardDetail />} />
                    <Route path="/addboard" element={<AddBoard />} />
                    <Route path="/editboard" element={<EditBoard />} />
                    {/* 직원 근태관리 페이지 */}
                    <Route path="/memberattendance" element={<MemberAttendance />} />
                    {/* 직원 워케이션 페이지 */}
                    <Route path="/WorkcationDetail" element={<WorkcationDetail />} />
                    {/* 관리자 워케이션승인 페이지 */}
                    <Route path="/workcationadmin" element={<WorkcationAdmin />} />
                    {/* 건강 관리 페이지 */}
                    <Route path="healthcaremain" element={<HealthCareMain />} />
                    <Route path="mentaltest" element={<MentalCareTest />} />
                    <Route path="mentalcareresult" element={<MentalCareResult />} />
                    <Route path="physicalcareresult" element={<PhysicalCareResult />} />
                    <Route path="physicaltest" element={<PhysicalCareTest />} />
                    <Route path="testresult" element={<TestResult />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
