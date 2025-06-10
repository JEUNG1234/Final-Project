import styled from 'styled-components';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '../../styles/common/MainContentLayout';

const AddBoard = () => {
  const navigate = useNavigate();
  // 이부분에 로그인 유저랑 게시글 작성자랑 같은지 찾는 코드 작성해야함.
  const loginUser = 'admin';
  const boardWriter = 'admin';

  return (
    <MainContent>
      <PageTitle>
        <FaUsers />
        커뮤니티 게시판 {'>'} 게시글 작성
      </PageTitle>
      <InputGroup>
        <PageMidTitle>제목</PageMidTitle>
        <TitleInput type="text" placeholder="제목을 입력해주세요."></TitleInput>
        <PageMidTitle>작성자</PageMidTitle>
        <WriterInput type="text" readOnly placeholder="임시 작성자 아이디"></WriterInput>
        <PageMidTitle>사진첨부</PageMidTitle>
        <FileInput type="file"></FileInput>
        <PageMidTitle>내용</PageMidTitle>
        <ContentInput type="text" placeholder="내용을 입력하세요."></ContentInput>
      </InputGroup>
      <ButtonGroup>
        <ActionButton onClick={() => navigate('/communityboard')}>게시글 등록</ActionButton>
        <ActionButton onClick={() => navigate('/communityboard')}>뒤로가기</ActionButton>
        {/* 만약 db 의 로그인 유저랑 게시글 작성자랑 같다면 수정하기 버튼 보이게*/}
        {loginUser === boardWriter && <ActionButton onClick={() => navigate('/editboard')}>수정하기</ActionButton>}
      </ButtonGroup>
    </MainContent>
  );
};

const BoardContent = styled.div`
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

const PageTitle = styled.h2`
  font-size: 28px;
  color: #929393;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 30px; /* 아이콘 크기 */
    color: #007bff; /* 아이콘 색상 */
  }
`;

const PageMidTitle = styled.h3`
  font-size: 20px;
  color: #000000;
  display: flex;
  margin: 5px;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px 10px;
  margin: 10px;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 20px 20px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #d0d5dd;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;

const FileInput = styled.input`
  padding: 10px 15px;
  background-color: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #555;

  /* 실제 버튼처럼 보이게 하기 위한 추가 스타일 */
  &::-webkit-file-upload-button {
    visibility: hidden; /* 기본 버튼 숨기기 */
  }
  &::before {
    content: '사진첨부'; /* 버튼 텍스트 */
    display: inline-block;
    background: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px 12px;
    outline: none;
    white-space: nowrap;
    cursor: pointer;
    font-size: 14px;
    color: #555;
    text-align: center;
  }
  &:hover::before {
    background: #d0d0d0;
  }
  &:active::before {
    background: #d0d0d0;
  }
`;

const WriterInput = styled.input`
  width: 100%;
  font-size: 20px 20px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #d0d5dd;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;

const ContentInput = styled.textarea`
  width: 100%;
  height: 350px;
  font-size: 20px 20px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #d0d5dd;
  line-height: 1.5;
  font-family: 'Pretendard', sans-serif;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  background: #96c6fe;
  color: white;
  border: none;

  &:hover {
    background-color: #a3cdfd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;
export default AddBoard;
