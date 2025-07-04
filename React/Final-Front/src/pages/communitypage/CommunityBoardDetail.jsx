import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import useUserStore from '../../Store/useStore';
import { BounceLoader } from 'react-spinners';
import dayjs from 'dayjs';
import BoardAPI from '../../api/board';

const CommunityBoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /communityboard/:id → 게시글 ID
  const [post, setPost] = useState(null);
  const { user } = useUserStore(); // Zustand에서 로그인 유저 정보 가져오기
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const MIN_LOADING_TIME = 500; // 500ms (0.5초) 최소 로딩 시간 설정
  // 게시글 가져오기 및 조회수 증가
  useEffect(() => {
    const startTime = Date.now();
    setLoading(true);
    // 게시글 정보 가져오기
    BoardAPI.getBoardDetail(id)
      .then((res) => setPost(res.data))

      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
        navigate('/communityboard');
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const wait = MIN_LOADING_TIME - elapsed;
        wait > 0 ? setTimeout(() => setLoading(false), wait) : setLoading(false);
      });

    // 수정페이지에서 되돌아온 경우 조회수 증가 생략
    if (location.state?.fromEdit) {
      console.log('수정 후 복귀 - 조회수 증가 생략');
      return;
    }

    // 최초 진입 또는 새로고침인 경우 조회수 증가
    BoardAPI.increaseView(id)
      .then(() => console.log(`게시글 ${id} 조회수 1 증가`))
      .catch((err) => console.error(`조회수 증가 실패:`, err));
  }, [id, navigate, location.state]);

  // --- 게시글 삭제 함수 ---
  const handleDelete = () => {
    if (window.confirm('정말 삭제할까요?')) {
      BoardAPI.deleteBoard(id)
        .then(() => {
          alert('삭제 성공');
          navigate('/communityboard');
        })
        .catch((err) => {
          console.error('삭제 실패:', err);
          alert('삭제 실패, 다시 시도하세요');
        });
    }
  };

  if (loading) {
    return (
      <MainContent>
        <LoaderArea>
          <BounceLoader color="#4d8eff" />
          Loading.. {/* 폰트 색상 변경경 */}
        </LoaderArea>
      </MainContent>
    );
  }

  if (!post) {
    return <MainContent>게시글을 찾을 수 없습니다.</MainContent>;
  }

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
        <ContentDisplay>
          {post.image?.path && (
            <ImagePreviewContainer>
              <PreviewImage src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${post.image.changedName}`} alt="첨부 이미지" />
            </ImagePreviewContainer>
          )}
          {post.boardContent}
        </ContentDisplay>
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
  width: 65%;
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

const LoaderArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-weight: 500;
  color: #4d8eff;
`;

const ContentDisplay = styled.div`
  width: 100%;
  min-height: 200px;
  font-size: 18px;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #d0d5dd;
  background-color: #fdfdfd;
  line-height: 1.6;
  white-space: pre-wrap;
  font-family: 'Pretendard', sans-serif;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
`;

const PreviewImage = styled.img`
  width: 300px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export default CommunityBoardDetail;
