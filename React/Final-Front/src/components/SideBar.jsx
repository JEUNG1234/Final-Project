import React from 'react';
import logoImg from '../assets/로고 이미지.png';
import styled from 'styled-components';
import { FaClipboardCheck, FaPoll, FaCalendarAlt, FaComments, FaHeartbeat } from 'react-icons/fa';
import { MdPeople } from 'react-icons/md';
import { BsFire } from 'react-icons/bs';
import { MdDashboard, MdWork } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={logoImg} onClick={() => navigate('/memberdashboard')} alt="SOWM 캐릭터" />{' '}
        {/* 해당 경로는 적절히 변경 필요 */}
      </LogoContainer>

      <MenuList>
        <MenuItem onClick={() => navigate('/memberdashboard')}>
          <MdDashboard /> 대시보드
        </MenuItem>
        <MenuItem onClick={() => navigate('/challenge')}>
          <BsFire /> 챌린지
        </MenuItem>
        <MenuItem onClick={() => navigate('/VoteList')}>
          <FaPoll /> 투표
        </MenuItem>
        <MenuItem onClick={() => navigate('/workcationlist')}>
          <MdWork /> 워케이션
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (user?.role === 'admin') {
              navigate('/adminattendance');
            } else if (user?.role === 'member') {
              navigate('/memberattendance');
            } else {
              alert('로그인 후 이용해주세요.');
              navigate('/login');
            }
          }}
        >
          <FaCalendarAlt /> 근태관리
        </MenuItem>
        <MenuItem onClick={() => navigate('/communityboard')}>
          <FaComments /> 커뮤니티 게시판
        </MenuItem>
        {/* 관리자는 안 보이게 */}
        {user && user.role !== 'admin' && (
          <>
            <MenuItem onClick={() => navigate('/healthcaremain')}>
              <FaHeartbeat /> 건강관리
            </MenuItem>
          </>
        )}
        {/* 관리자 전용 메뉴 */}
        {user && user.role === 'admin' && (
          <>
            <MenuItem onClick={() => navigate('/workcationadmin')}>
              <FaClipboardCheck /> 워케이션승인
            </MenuItem>
            <MenuItem onClick={() => navigate('/employeemanagement')}>
              <MdPeople /> 직원관리
            </MenuItem>
          </>
        )}
      </MenuList>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #ffffff;
  padding: 20px 16px;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  border-right: 1px solid #cecccc;
  font-family: 'Pretendard', sans-serif;
  position: fixed;
  top: 0; /* 추가 */
  left: 0; /* 추가 */
  z-index: 100; /* 콘텐츠 위에 오도록 */
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  cursor: pointer;

  img {
    width: 150px;
    height: 150px;
    margin-bottom: 8px;
  }

  span {
    font-size: 18px;
    font-weight: 700;
    color: #4d8eff;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px;
  padding-left: 40px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #929393;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e4f0ff;
    color: #4d8eff;
  }

  svg {
    font-size: 22px;
    margin-right: 20px;
    color: #4d8eff;
  }
`;

export default Sidebar;
