import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 기본 폰트 설정 */
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    line-height: 1.5;
  }

  /* 링크 스타일 초기화 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 버튼 스타일 초기화 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  /* 리스트 스타일 초기화 */
  ul, ol {
    list-style: none;
  }

  /* 이미지 최적화 */
  img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
  }

  /* 입력 필드 스타일 초기화 */
  input, textarea {
    font: inherit;
    border: none;
    outline: none;
  }

  /* 테이블 스타일 초기화 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  /* 선택 영역 스타일링 */
  ::selection {
    background: #007bff;
    color: white;
  }

  /* 기본 포커스 스타일 */
  :focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* 기본 애니메이션 */
  * {
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
`;

export default GlobalStyle;
