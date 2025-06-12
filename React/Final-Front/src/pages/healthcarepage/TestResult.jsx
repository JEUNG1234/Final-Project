import React from 'react';
import {
  MainContent,
  ContentHeader,
  PageTitle,
  SearchInput,
  BottomBar,
  Pagination,
  PageButton,
} from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaSearch, FaPlus, FaSortDown } from 'react-icons/fa';
import { useState } from 'react';
import styled from 'styled-components';

const TestResult = () => {
  const posts = [
    { id: 1, date: '2025-06-12', category: '신체검사', score: '80', comment: '훌륭하게 신체 관리를 하고 계십니다!' },
    { id: 2, date: '2025-06-12', category: '심리검사', score: '70', comment: '훌륭하게 심리 관리를 하고 계십니다!' },
    { id: 3, date: '2025-06-10', category: '신체검사', score: '65', comment: '운동량을 조금 더 늘려보는 건 어떨까요?' },
    { id: 4, date: '2025-06-09', category: '심리검사', score: '85', comment: '정서적 안정 상태가 매우 좋습니다!' },
    { id: 5, date: '2025-06-08', category: '신체검사', score: '90', comment: '아주 건강한 신체 상태입니다!' },
    {
      id: 6,
      date: '2025-06-07',
      category: '심리검사',
      score: '60',
      comment: '스트레스를 조금 줄이는 방법을 찾아보세요.',
    },
    { id: 7, date: '2025-06-05', category: '신체검사', score: '75', comment: '체중 관리에 신경 쓰면 더 좋습니다.' },
    {
      id: 8,
      date: '2025-06-04',
      category: '심리검사',
      score: '78',
      comment: '심리적 안정이 어느 정도 유지되고 있습니다.',
    },
  ];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setselectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setselectedCategory(event.target.value);
  };

  const handleSearch = () => {
    const filtered = posts.filter((post) => {
      const matchDate = selectedDate ? post.date === selectedDate : true;
      const matchCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchDate && matchCategory;
    });
    setFilteredPosts(filtered); // 조회 버튼 클릭 시만 반영
  };

  return (
    <MainContent>
      <PageTitle>
        <FaHeartbeat />
        건강관리 {'>'} 결과기록
      </PageTitle>
      <ContentHeader>
        <h2>건강결과 기록</h2>
        <hr />
      </ContentHeader>
      <BoardActions>
        {/* 날짜 검색 input */}
        <SearchInput type="date" placeholder="날짜검색" value={selectedDate} onChange={handleDateChange} />
        <CategoryInput value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">전체</option>
          <option value="신체검사">신체검사</option>
          <option value="심리검사">심리검사</option>
        </CategoryInput>
        <ActionButton primary onClick={handleSearch}>
          {' '}
          {/* 조회 버튼에 핸들러 연결 */}
          <FaSearch /> 조회
        </ActionButton>
      </BoardActions>

      <CommunityTable>
        <thead>
          <tr>
            <TableHeaderCell>번호</TableHeaderCell>
            <TableHeaderCell>날짜</TableHeaderCell>
            <TableHeaderCell sortable>
              유형 <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>평균 점수</TableHeaderCell>
            <TableHeaderCell sortable>
              요약 <FaSortDown />
            </TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.score}</TableCell>
                <TableCell>{post.comment}</TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <TableCell colSpan={5}>조회된 결과가 없습니다.</TableCell>
            </tr>
          )}
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

const BoardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.primary ? '#007bff' : '#6c757d')};
  color: white;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#5a6268')};
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
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

const CategoryInput = styled.select`
  flex-grow: 1;
  padding: 10px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
  min-width: 180px;
  font-family: 'Pretendard', sans-serif;

  @media (max-width: 768px) {
    width: 100%;
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

export default TestResult;
