import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaSearch, FaPlus, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import { MainContent, Pagination, PageButton, BottomBar, SearchInput } from '../../styles/common/MainContentLayout';

const CommunityBoard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 게시글 데이터 가져오기
  useEffect(() => {
    axios
      .get('http://localhost:8888/api/boards') // ✅ 실제 API 주소 사용
      .then((response) => {
        console.log('불러온 게시글:', response.data); // 🔍 데이터 확인
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('게시글 불러오기 실패:', error);
      });
  }, []);

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>
          <FaComments />
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
              제목 <FaSortDown />
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
            <TableRow key={post.boardNo} onClick={() => navigate(`/communityboard/${post.boardNo}`)}>
              <TableCell tag={post.categoryName === '공지사항'}>{post.categoryName}</TableCell>
              <TableCell title>{post.boardTitle}</TableCell>
              <TableCell>{post.userName}</TableCell>
              <TableCell>{post.createdDate}</TableCell>
              <TableCell>{post.views ?? 0}</TableCell> {/* 조회수 없으면 0 */}
            </TableRow>
          ))}
        </tbody>
      </CommunityTable>

      <BottomBar>
        <Pagination>
          <PageButton>&lt;</PageButton>
          <PageButton className="active">1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>&gt;</PageButton>
        </Pagination>
      </BottomBar>
    </MainContent>
  );
};

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

export default CommunityBoard;
