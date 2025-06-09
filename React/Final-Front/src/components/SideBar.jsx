import React from 'react';
import logoImg from '../assets/로고 이미지.png';
import styled from 'styled-components';
import { FaClipboardList, FaPoll, FaCalendarAlt, FaComments, FaHeartbeat } from 'react-icons/fa';
import { MdDashboard, MdWork } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

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

const Sidebar = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={logoImg} onClick={() => navigate('/memberdashboard')} alt="SOWM 캐릭터" /> {/* 해당 경로는 적절히 변경 필요 */}
      </LogoContainer>

      <MenuList>        
        <MenuItem onClick={() => navigate('/memberdashboard')}><MdDashboard /> 대시보드</MenuItem>
        <MenuItem><FaClipboardList /> 챌린지</MenuItem>
        <MenuItem onClick={() => navigate('/VoteList')}><FaPoll /> 투표</MenuItem>
        <MenuItem onClick={() => navigate('/workcation')}><MdWork /> 워케이션</MenuItem>
        <MenuItem><FaCalendarAlt /> 근태관리</MenuItem>
        <MenuItem onClick={() => navigate('/communityboard')}><FaComments /> 커뮤니티 게시판</MenuItem>
        <MenuItem><FaHeartbeat /> 건강관리</MenuItem>
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
