import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import useUserStore from '../../Store/useStore';
import dayjs from 'dayjs';
import { API_CONFIG, API_ENDPOINTS } from '../../api/config';

const CommunityBoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /communityboard/:id → 게시글 ID
  const [post, setPost] = useState(null);
  const { user } = useUserStore(); // Zustand에서 로그인 유저 정보 가져오기

  // 게시글 가져오기 및 조회수 증가
  useEffect(() => {
    // 1. 게시글 상세 정보 불러오기
    axios
      .get(`http://localhost:8888/api/boards/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
        navigate('/communityboard'); // 게시글 로드 실패 시 목록으로 이동
      });

    // 2. ✨ 게시글 조회수 증가 API 호출 ✨
    // 이 요청은 게시글 상세 페이지에 처음 진입할 때만 발생합니다.
    // 백엔드에서 /api/boards/{id}/views 라는 PATCH 엔드포인트를 구현했다고 가정합니다.
    axios
      .patch(`http://localhost:8888/api/boards/${id}/views`)
      .then(() => {
        console.log(`게시글 ${id}의 조회수가 성공적으로 1 증가했습니다.`);
        // 필요하다면, 프론트엔드에서 즉시 조회수를 업데이트하여 화면에 반영할 수 있습니다.
        // setPost(prevPost => ({
        //   ...prevPost,
        //   viewCount: (prevPost ? prevPost.viewCount : 0) + 1
        // }));
      })
      .catch((err) => {
        console.error(`게시글 ${id}의 조회수 증가 실패:`, err);
        // 조회수 증가 실패는 사용자에게 직접 알릴 필요는 없을 수 있습니다. (백그라운드 작업)
      });
  }, [id, navigate]); // id가 변경될 때마다(즉, 다른 게시글로 이동할 때마다) 다시 실행

  // --- 게시글 삭제 함수 ---
  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      axios
        .delete(`http://localhost:8888/api/boards/${id}`)
        .then(() => {
          alert('게시글이 성공적으로 삭제되었습니다.');
          navigate('/communityboard'); // 삭제 후 게시판 목록으로 이동
        })
        .catch((err) => {
          console.error('게시글 삭제 실패:', err);
          alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
        });
    }
  };

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
        <WriterInput
          type="text"
          value={
            post.createdDate === post.updatedDate
              ? dayjs(post.createdDate).format('YYYY년 MM월 DD일')
              : dayjs(post.updatedDate).format('YYYY년 MM월 DD일')
          }
          readOnly
        />

        <PageMidTitle>내용</PageMidTitle>
        <ContentInput as="textarea" value={post.boardContent} readOnly />
      </InputGroup>

      <ButtonGroup>
        <ActionButton onClick={() => navigate('/communityboard')}>뒤로가기</ActionButton>

        {user?.userId === post.userId && (
          <ActionButton onClick={() => navigate(`/editboard/${post.boardNo}`)}>수정하기</ActionButton>
        )}
        {user?.userId === post.userId && <Deletebutton onClick={handleDelete}>삭제하기</Deletebutton>}
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

const Deletebutton = styled.button`
  height: 45px;
  background-color: #f15c5c;
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
    background-color: #f14141;
  }
`;
export default CommunityBoardDetail;
