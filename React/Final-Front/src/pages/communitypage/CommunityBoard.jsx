import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaComments, FaSearch, FaPlus, FaSortDown } from 'react-icons/fa';
import BoardAPI from '../../api/board';
import CategoryAPI from '../../api/category';
import {
  MainContent,
  Pagination,
  PageButton,
  BottomBar,
  SearchInput,
  PageTitle,
} from '../../styles/common/MainContentLayout';
import dayjs from 'dayjs';
import useUserStore from '../../Store/useStore';

const CommunityBoard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const location = useLocation();

  // 실제 게시글 리스트
  const [posts, setPosts] = useState([]);

  // 페이징 정보
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 0,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // 카테고리 목록
  const [categories, setCategories] = useState([]);

  // **입력용 상태 (검색 input과 바인딩)**
  const [inputTitle, setInputTitle] = useState('');
  const [inputWriter, setInputWriter] = useState('');
  const [inputCategory, setInputCategory] = useState('');

  // **실제 검색 조건 상태 (API 호출용)**
  const [searchTitle, setSearchTitle] = useState('');
  const [searchWriter, setSearchWriter] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const fetchPosts = useCallback(
    async (page, title, writer, categoryNo) => {
      try {
        const response = await BoardAPI.getBoardList({
          page: page,
          size: 10,
          sort: 'createdDate,desc',
          title: title,
          writer: writer,
          categoryNo: categoryNo,
          companyCode: user.companyCode,
        });
        const { content, currentPage, totalCount, hasNext, hasPrevious, totalPage } = response.data;
        setPosts(content);
        setPageInfo({
          currentPage,
          totalPage,
          totalCount,
          hasNext,
          hasPrevious,
        });
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    },
    [user.companyCode]
  );

  // 검색 조건, 페이지 변경 시 게시글 재조회
  useEffect(() => {
    fetchPosts(pageInfo.currentPage, searchTitle, searchWriter, searchCategory);
  }, [fetchPosts, pageInfo.currentPage, searchTitle, searchWriter, searchCategory, location.state?.refreshBoardList]);

  // 카테고리 목록 1회 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryAPI.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('카테고리 불러오기 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // 검색 버튼 클릭 시 실제 검색 조건을 업데이트하여 검색 실행
  const handleSearch = () => {
    setSearchTitle(inputTitle);
    setSearchWriter(inputWriter);
    setSearchCategory(inputCategory);
    setPageInfo((prev) => ({ ...prev, currentPage: 0 }));
  };

  // 페이지 버튼 클릭 시 페이지 변경
  const handlePageChange = (page) => {
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <MainContent>
      <PageTitle>
        <FaComments />
        커뮤니티 게시판
      </PageTitle>

      <BoardActions>
        <CategorySelect value={inputCategory} onChange={(e) => setInputCategory(e.target.value)}>
          <option value="">전체</option>
          {categories.map((cat) => (
            <option key={cat.categoryNo} value={cat.categoryNo}>
              {cat.categoryName}
            </option>
          ))}
        </CategorySelect>

        <SearchInput placeholder="제목" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />

        <SearchInput placeholder="작성자" value={inputWriter} onChange={(e) => setInputWriter(e.target.value)} />

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
          {posts.length === 0 ? (
            <EmptyRow>
              <td colSpan="5">게시글이 존재하지 않습니다.</td>
            </EmptyRow>
          ) : (
            posts.map((post) => (
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
            ))
          )}
        </tbody>
      </CommunityTable>

      <BottomBar>
        <Pagination>
          <PageButton disabled={!pageInfo.hasPrevious} onClick={() => handlePageChange(pageInfo.currentPage - 1)}>
            &lt;
          </PageButton>
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

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 2rem 1rem;
    font-size: 1.1rem;
    color: #999;
    font-weight: 500;
  }
`;

export default CommunityBoard;
