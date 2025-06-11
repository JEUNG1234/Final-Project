import styled from 'styled-components';

/* 게시판이나 흰색 배경 부분*/
export const MainContent = styled.div`
  width: 95%;
  max-width: 1400px; /* 너무 넓어지지 않도록 최대 너비 설정 */
  min-height: 80vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
  background: white;
  margin: 30px auto; /* 중앙 정렬 및 상하 마진 */
  padding: 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
`;

export const PageTitle = styled.h2`
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
