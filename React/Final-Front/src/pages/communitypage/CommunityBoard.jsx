import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaComments, FaSearch, FaPlus, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import {
  MainContent,
  Pagination,
  PageButton,
  BottomBar,
  SearchInput,
  PageTitle,
} from '../../styles/common/MainContentLayout';
import dayjs from 'dayjs';
import { API_CONFIG, API_ENDPOINTS } from '../../api/config';

const CommunityBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 0,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [categories, setCategories] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchWriter, setSearchWriter] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  // fetchPosts 함수를 useCallback으로 감싸서 함수 재생성을 최적화합니다.
  // 이 함수는 항상 최신 상태 값을 파라미터로 명시적으로 받아 사용하도록 합니다.
  const fetchPosts = useCallback(
    async (page, title, writer, categoryNo) => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.BOARD.BASE}`, {
          params: {
            page: page,
            size: 10,
            sort: 'createdDate,desc',
            title: title,
            writer: writer,
            categoryNo: categoryNo,
          },
        });
        console.log('불러온 게시글:', response.data);
        const { content, currentPage, totalCount, hasNext, hasPrevious, totalPage } = response.data;
        setPosts(content);
        setPageInfo({
          currentPage: currentPage,
          totalPage: totalPage,
          totalCount: totalCount,
          hasNext: hasNext,
          hasPrevious: hasPrevious,
        });
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    },
    [setPosts, setPageInfo] // fetchPosts는 setPosts, setPageInfo setter 함수에만 의존합니다.
  );

  // 게시글 데이터를 불러오는 useEffect:
  // pageInfo.currentPage, searchTitle, searchWriter, searchCategory, fetchPosts가 변경될 때마다 실행
  useEffect(() => {
    // fetchPosts의 인자로 현재의 상태값을 전달합니다.
    fetchPosts(pageInfo.currentPage, searchTitle, searchWriter, searchCategory);
  }, [fetchPosts, pageInfo.currentPage, searchTitle, searchWriter, searchCategory, location.state?.refreshBoardList]);

  // 카테고리 데이터 가져오기 (컴포넌트 마운트 시 1회만)
  useEffect(() => {
    axios
      .get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORY.BASE}`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('카테고리 불러오기 실패:', err));
  }, []);

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    // currentPage를 0으로 설정하면 위의 useEffect가 변경을 감지하여 fetchPosts를 호출합니다.
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
    // ⚠️ 이전 코드: fetchPosts(0, searchTitle, searchWriter, searchCategory); // 이 줄을 제거했습니다.
  };

  // 페이지 버튼 클릭 핸들러
  const handlePageChange = (page) => {
    // currentPage를 변경하면 위의 useEffect가 변경을 감지하여 fetchPosts를 호출합니다.
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
    // ⚠️ 이전 코드: fetchPosts(page, searchTitle, searchWriter, searchCategory); // 이 줄을 제거했습니다.
  };

  return (
    <MainContent>
      <PageTitle>
        <FaComments />
        커뮤니티 게시판
      </PageTitle>

      <BoardActions>
        <CategorySelect value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
          <option value="">전체</option>
          {categories.map((cat) => (
            <option key={cat.categoryNo} value={cat.categoryNo}>
              {cat.categoryName}
            </option>
          ))}
        </CategorySelect>
        <SearchInput placeholder="제목" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
        <SearchInput placeholder="작성자" value={searchWriter} onChange={(e) => setSearchWriter(e.target.value)} />

        <ActionButton primary onClick={handleSearch}>
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
            <TableHeaderCell>
              제목 <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>작성자</TableHeaderCell>
            <TableHeaderCell>
              작성일자 <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>조회수</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <TableRow key={post.boardNo} onClick={() => navigate(`/communityboard/${post.boardNo}`)}>
              <TableCell tag={post.categoryName === '공지사항'}>{post.categoryName}</TableCell>
              <TableCell>{post.boardTitle}</TableCell>
              <TableCell>{post.userName}</TableCell>
              <TableCell>
                {post.createdDate === post.updatedDate
                  ? dayjs(post.createdDate).format('YYYY년 MM월 DD일')
                  : dayjs(post.updatedDate).format('YYYY년 MM월 DD일') + ' (수정됨)'}
              </TableCell>
              <TableCell>{post.views}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </CommunityTable>

      <BottomBar>
        <Pagination>
          <PageButton disabled={!pageInfo.hasPrevious} onClick={() => handlePageChange(pageInfo.currentPage - 1)}>
            &lt;
          </PageButton>
          {/* totalPage를 사용하여 페이지 버튼을 렌더링합니다. */}
          {[...Array(pageInfo.totalPage)].map((_, i) => (
            <PageButton
              key={i}
              className={pageInfo.currentPage === i ? 'active' : ''}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton disabled={!pageInfo.hasNext} onClick={() => handlePageChange(pageInfo.currentPage + 1)}>
            &gt;
          </PageButton>
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
  background-color: ${(props) => (props.primary ? '#4e94fd' : '#6c757d')}; /* 파란색 또는 회색 */
  color: white;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap; /* 버튼 텍스트 줄바꿈 방지 */

  &:hover {
    background-color: ${(props) => (props.primary ? '#4984dd' : '#5a6268')};
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
  padding: 12px 0;
  border-bottom: 1px solid #ffffff;
  font-size: 14px;
  color: #555;
  align-items: center;
  transition: background-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #ebebeb;
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

const CategorySelect = styled.select`
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

export default CommunityBoard;
