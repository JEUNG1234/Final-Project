import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MainContent } from '../../styles/common/MainContentLayout';
import useUserStore from '../../Store/useStore';

const CommunityBoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /communityboard/:id → 게시글 ID
  const [post, setPost] = useState(null);
  const { user } = useUserStore(); // Zustand에서 로그인 유저 정보 가져오기

  // 게시글 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8888/api/boards/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
      });
  }, [id]);

  if (!post) return <MainContent>Loading...</MainContent>;

  return (
    <MainContent>
      <PageTitle>
        <FaComments /> 커뮤니티 게시판 {'>'} 게시글 상세보기
      </PageTitle>

      <InputGroup>
        <PageMidTitle>제목</PageMidTitle>
        <TitleInput type="text" value={post.boardTitle} readOnly />

        <PageMidTitle>작성자</PageMidTitle>
        <WriterInput type="text" value={post.userName} readOnly />

        <PageMidTitle>작성일</PageMidTitle>
        <WriterInput type="text" value={post.createdDate} readOnly />

        <PageMidTitle>내용</PageMidTitle>
        <ContentInput as="textarea" value={post.boardContent} readOnly />
      </InputGroup>

      <ButtonGroup>
        <ActionButton onClick={() => navigate('/communityboard')}>목록으로</ActionButton>

        {user?.userId === post.userId && (
          <ActionButton onClick={() => navigate(`/editboard/${post.boardNo}`)}>수정하기</ActionButton>
        )}
      </ButtonGroup>
    </MainContent>
  );
};

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
  font-size: 18px;
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
  font-size: 16px;
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
  font-size: 16px;
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
  font-size: 16px;
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
  height: 45px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3c75e0;
  }
`;
export default CommunityBoardDetail;
