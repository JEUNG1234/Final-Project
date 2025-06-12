import styled from 'styled-components';

/* 게시판이나 흰색 배경 부분*/
export const MainContent = styled.div`
  width: 95%;
  max-width: 1400px; /* 너무 넓어지지 않도록 최대 너비 설정 */
  min-height: 84vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
  background: white;
  margin: 25px auto; /* 중앙 정렬 및 상하 마진 */
  padding: 25px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
`;

export const PageTitle = styled.h2`
  font-size: 26px;
  color: #929393;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;

  /* React Icons는 SVG로 렌더링되므로, 직접적으로 스타일을 적용할 수 있습니다. */
  svg {
    /* i 태그 대신 svg 태그에 스타일 적용 */
    font-size: 30px; /* 아이콘 크기 */
    color: #007bff; /* 아이콘 색상 */
  }
`;

/* 페이징 바 영역 */
export const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #3b82f6;
  color: white;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #2563eb;
  }
`;

// 검색창
export const SearchInput = styled.input`
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

export const PageHeader = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
`;

// 심리검사 페이지의 헤더부분 양식
// 중제목은 h2 태그로 통일하시면 됩니다.
export const ContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  hr {
    width: 700px;
    border-top: 2px solid #267eff;
    margin: 10px 20px;
  }
`;

// 중제목
export const Subtitle = styled.h4``;
