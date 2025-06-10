import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaSearch, FaPlus, FaSortDown } from 'react-icons/fa'; // Font Awesome 아이콘 (fa) 사용 예시
import { MainContent } from '../../styles/common/MainContentLayout';

const CommunityBoard = () => {
  const navigate = useNavigate();

  // 예시 데이터 (실제로는 API에서 받아옴)
  const posts = [
    { id: 1, tag: '공지사항', title: '안녕하세요', author: '홍길동', date: '2025/03/01', views: 400 },
    { id: 2, tag: '일반', title: '안녕하세요', author: '김철수', date: '2025/03/01', views: 200 },
    { id: 3, tag: '일반', title: '안녕하세요', author: '이영구', date: '2025/03/01', views: 100 },
    { id: 4, tag: '일반', title: '안녕하세요', author: '최지원', date: '2025/02/01', views: 32 },
    { id: 5, tag: '일반', title: '안녕하세요', author: '박지원', date: '2025/02/01', views: 14 },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>
          <FaUsers /> {/* React Icons 컴포넌트 사용 */}
          커뮤니티 게시판
        </PageTitle>
      </PageHeader>

      <BoardActions>
        <SearchInput placeholder="제목" />
        <ActionButton primary>
          <FaSearch /> 조회
        </ActionButton>
        <ActionButton onClick={() => navigate('/addboard')}>
          <FaPlus /> 게시글 작성
        </ActionButton>
      </BoardActions>

      <CommunityTable>
        <thead>
          <tr>
            <TableHeaderCell>게시글 태그</TableHeaderCell>
            <TableHeaderCell sortable>
              제목 <FaSortDown /> {/* 정렬 아이콘 예시 */}
            </TableHeaderCell>
            <TableHeaderCell>작성자</TableHeaderCell>
            <TableHeaderCell sortable>
              작성일자 <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>조회수</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell tag={post.tag === '공지사항'}>{post.tag}</TableCell>
              <TableCell title>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>{post.views}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </CommunityTable>

      {/* 이미지에는 없지만 일반적인 게시판에는 페이지네이션이 있으므로 추가 */}
      <Pagination>
        <PageButton>&lt;</PageButton>
        <PageButton className="active">1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
        <PageButton>&gt;</PageButton>
      </Pagination>
    </MainContent>
  );
};

// =========================================================
// 스타일 정의 (styled-components)
// =========================================================

const CommunityContent = styled.div`
  width: 90%;
  max-width: 1200px; /* 너무 넓어지지 않도록 최대 너비 설정 */
  min-height: 80vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
  background: white;
  margin: 60px auto; /* 중앙 정렬 및 상하 마진 */
  padding: 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  color: #929393;
  display: flex;
  align-items: center;
  gap: 10px;

  /* React Icons는 SVG로 렌더링되므로, 직접적으로 스타일을 적용할 수 있습니다. */
  svg {
    /* i 태그 대신 svg 태그에 스타일 적용 */
    font-size: 30px; /* 아이콘 크기 */
    color: #007bff; /* 아이콘 색상 */
  }
`;

const BoardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap; /* 작은 화면에서 요소들이 줄바꿈되도록 */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1; /* 남은 공간을 차지하도록 */
  padding: 10px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
  min-width: 180px; /* 최소 너비 지정 */

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서 전체 너비 차지 */
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.primary ? '#007bff' : '#6c757d')}; /* 파란색 또는 회색 */
  color: white;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap; /* 버튼 텍스트 줄바꿈 방지 */

  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#5a6268')};
  }

  /* React Icons는 SVG로 렌더링되므로, svg 태그에 스타일 적용 */
  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서 전체 너비 차지 */
    justify-content: center;
  }
`;

const CommunityTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* 셀 경계선을 겹치게 */
  margin-bottom: 30px; /* 테이블 아래 여백 */
  font-size: 15px;
  text-align: left; /* 기본 텍스트 정렬 */

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
`;

const TableHeaderCell = styled.th`
  background-color: #f8f9fa; /* 헤더 배경색 */
  color: #555;
  font-weight: 600;
  white-space: nowrap; /* 줄바꿈 방지 */

  ${(props) =>
    props.sortable &&
    `
    cursor: pointer;
    &:hover {
      background-color: #e9ecef;
    }
  `}

  svg {
    margin-left: 5px;
    font-size: 12px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #fefefe; /* 마우스 오버 시 배경색 */
  }
`;

const TableCell = styled.td`
  color: ${(props) => (props.tag ? '#007bff' : '#333')}; /* 태그는 파란색 */
  font-weight: ${(props) => (props.tag ? 'bold' : 'normal')};

  ${(props) =>
    props.title &&
    `
    cursor: pointer;
    color: #000000;
    &:hover {
      text-decoration: underline;
    }
  `}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px; /* 버튼 간 간격 */
  margin-top: 20px;

  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  min-width: 35px; /* 버튼 최소 너비 */

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    font-weight: bold;
  }

  &:hover:not(.active) {
    background-color: #f0f0f0;
  }
`;

export default CommunityBoard;
