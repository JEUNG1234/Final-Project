import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import dayjs from 'dayjs';

const EditBoard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /communityboard/:id → 게시글 ID
  const [post, setPost] = useState(null);
  // **[변경]** 수정 가능한 필드를 위한 상태 추가
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8888/api/boards/${id}`)
      .then((res) => {
        setPost(res.data);
        // **[변경]** 불러온 데이터로 수정 가능한 상태들을 초기화
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
        navigate('/communityboard'); // 실패 시 게시판 목록으로 리다이렉트
      });
  }, [id]);

  // **[추가]** 게시글 수정 처리 함수
  const handleUpdate = () => {
    // PATCH 요청으로 보낼 데이터 객체
    const updatedPost = {
      boardTitle: boardTitle,
      boardContent: boardContent,
      // 필요한 경우, 백엔드에서 필요한 다른 필드 (예: id)도 추가할 수 있습니다.
      // id: id,
    };

    axios
      .patch(`http://localhost:8888/api/boards/${id}`, updatedPost)
      .then((res) => {
        alert('게시글이 성공적으로 수정되었습니다!');
        navigate(`/communityboard/${id}`); // 수정된 게시글 상세 페이지로 이동
      })
      .catch((err) => {
        console.error('게시글 수정 실패:', err);
        alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      });
  };

  if (!post) return <MainContent>Loading...</MainContent>;

  return (
    <MainContent>
      <PageTitle>
        <FaComments />
        커뮤니티 게시판 {'>'} 게시글 수정
      </PageTitle>
      <InputGroup>
        <PageMidTitle>제목</PageMidTitle>
        <TitleInput
          type="text"
          value={boardTitle} // **[변경]** boardTitle 상태 사용
          onChange={(e) => setBoardTitle(e.target.value)} // **[변경]** 입력 시 boardTitle 상태 업데이트
        />
        <PageMidTitle>작성자</PageMidTitle>
        <WriterInput type="text" value={post.userName} readOnly /> {/* **[변경]** 읽기 전용 */}
        <PageMidTitle>작성일</PageMidTitle>
        <WriterInput
          type="text"
          value={
            post.createdDate === post.updatedDate
              ? dayjs(post.createdDate).format('YYYY년 MM월 DD일')
              : dayjs(post.updatedDate).format('YYYY년 MM월 DD일')
          }
          readOnly
        />{' '}
        {/* **[변경]** 읽기 전용 */}
        <PageMidTitle>내용</PageMidTitle>
        <ContentInput
          as="textarea"
          value={boardContent} // **[변경]** boardContent 상태 사용
          onChange={(e) => setBoardContent(e.target.value)} // **[변경]** 입력 시 boardContent 상태 업데이트
        />
      </InputGroup>
      <ButtonGroup>
        {/* **[변경]** "수정 완료" 버튼 클릭 시 handleUpdate 함수 호출 */}
        <ActionButton onClick={handleUpdate}>수정 완료</ActionButton>
        <ActionButton onClick={() => navigate('/communityboard')}>게시판으로</ActionButton>
      </ButtonGroup>
    </MainContent>
  );
};

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
export default EditBoard;
