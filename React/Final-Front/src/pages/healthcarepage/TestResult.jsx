import React, { useEffect, useState } from 'react';
import {
  MainContent,
  ContentHeader,
  PageTitle,
  SearchInput,
  BottomBar,
  Pagination,
  PageButton,
} from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaSearch, FaSortDown } from 'react-icons/fa';
import styled from 'styled-components';
import { healthService } from '../../api/health';

const TestResult = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 1,
  });

  const fetchData = async (page = 0) => {
    try {
      const res = await healthService.getAllResultList({
        page,
        size: 10,
        createDate: selectedDate || undefined,
        type: selectedCategory === '신체검사' ? 'PHYSICAL' : selectedCategory === '심리검사' ? 'PSYCHOLOGY' : undefined,
      });
      setResults(res.content);
      setPageInfo({
        currentPage: res.currentPage,
        totalPage: res.totalPage,
      });
    } catch (err) {
      console.error('결과 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData(); // 초기 로딩
  }, []);

  const handleSearch = () => {
    fetchData(0); // 필터 조건으로 0페이지부터 다시 요청
  };

  const handlePageChange = (page) => {
    fetchData(page);
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
        <SearchInput type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <CategoryInput value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">전체</option>
          <option value="신체검사">신체검사</option>
          <option value="심리검사">심리검사</option>
        </CategoryInput>
        <ActionButton primary onClick={handleSearch}>
          <FaSearch /> 조회
        </ActionButton>
      </BoardActions>

      <CommunityTable>
        <thead>
          <tr>
            <TableHeaderCell>번호</TableHeaderCell>
            <TableHeaderCell>날짜</TableHeaderCell>
            <TableHeaderCell>
              유형 <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>총 점수</TableHeaderCell>
            <TableHeaderCell>
              요약 <FaSortDown />
            </TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result, index) => (
              <TableRow key={result.medicalCheckResultNo}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{result.medicalCheckCreateDate}</TableCell>
                <TableCell>{result.medicalCheckType}</TableCell>
                <TableCell>{result.medicalCheckTotalScore}</TableCell>
                <TableCell>{result.guideMessage}</TableCell>
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
          {Array.from({ length: pageInfo.totalPage }, (_, i) => (
            <PageButton
              key={i}
              className={pageInfo.currentPage === i ? 'active' : ''}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageButton>
          ))}
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
