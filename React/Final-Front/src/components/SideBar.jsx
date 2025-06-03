import React from 'react';
import logoImg from '../assets/로고 이미지.png'
import styled from 'styled-components';
import { FaClipboardList, FaPoll, FaCalendarAlt, FaComments, FaHeartbeat } from 'react-icons/fa';
import { MdDashboard, MdWork } from 'react-icons/md';

const SidebarContainer = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #ffffff;
  padding: 20px 16px;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  border-right: 1px solid #cecccc;
  font-family: 'Pretendard', sans-serif;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;

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
  }

  svg {
   font-size: 22px;
    margin-right: 20px;
    color: #4d8eff;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={logoImg} alt="SOWM 캐릭터" /> {/* 해당 경로는 적절히 변경 필요 */}
        
      </LogoContainer>

      <MenuList>
        <MenuItem><MdDashboard /> 대시보드</MenuItem>
        <MenuItem><FaClipboardList /> 설문조사</MenuItem>
        <MenuItem><FaPoll /> 투표</MenuItem>
        <MenuItem><MdWork /> 워케이션</MenuItem>
        <MenuItem><FaCalendarAlt /> 일정관리</MenuItem>
        <MenuItem><FaComments /> 커뮤니티 게시판</MenuItem>
        <MenuItem><FaHeartbeat /> 건강관리</MenuItem>
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
