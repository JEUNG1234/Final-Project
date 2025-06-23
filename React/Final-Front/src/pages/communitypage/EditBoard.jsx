import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import dayjs from 'dayjs';
import useUserStore from '../../Store/useStore';
import { BounceLoader } from 'react-spinners';

const EditBoard = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const MIN_LOADING_TIME = 500; // 500ms (0.5초) 최소 로딩 시간 설정

  useEffect(() => {
    setLoading(true); // 데이터 요청 시작 시 로딩 상태 true
    const startTime = Date.now(); // 요청 시작 시간 기록

    axios
      .get(`http://localhost:8888/api/boards/${id}`)
      .then((res) => {
        setPost(res.data);
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);
        setCategory(res.data.categoryNo);
        console.log(res.data);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러오는 데 실패했습니다.');
        navigate('/communityboard');
      })
      .finally(() => {
        const elapsedTime = Date.now() - startTime; // 경과 시간 계산
        const remainingTime = MIN_LOADING_TIME - elapsedTime; // 남은 시간 계산

        if (remainingTime > 0) {
          // 최소 로딩 시간보다 적게 걸렸다면 남은 시간만큼 대기
          setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        } else {
          // 최소 로딩 시간을 초과했다면 바로 로딩 상태 false
          setLoading(false);
        }
      });
  }, [id, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:8888/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('카테고리 불러오기 실패:', err));
  }, []);

  const handleUpdate = () => {
    const updatedPost = {
      boardTitle: boardTitle,
      boardContent: boardContent,
      categoryNo: category,
    };

    axios
      .patch(`http://localhost:8888/api/boards/${id}`, updatedPost)
      .then((res) => {
        setPost(res.data);
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);
        setCategory(res.data.categoryNo);
        console.log(res.data);
        alert('게시글이 성공적으로 수정되었습니다!');
        navigate(`/communityboard`);
      })
      .catch((err) => {
        console.error('게시글 수정 실패:', err);
        alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      });
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
        <FaComments />
        커뮤니티 게시판 {'>'} 게시글 수정
      </PageTitle>
      <InputGroup>
        <PageMidTitle>제목</PageMidTitle>
        <TitleInput type="text" value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} />
        <PageMidTitle>작성자</PageMidTitle>
        <WriterInput type="text" value={post.userName} readOnly />
        <FlexItem>
          <div>
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
          </div>
          <div>
            <PageMidTitle>태그</PageMidTitle>
            <SelectBox value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => {
                if (cat.categoryName === '공지사항' && user.jobCode !== 'J2') {
                  return null;
                }
                return (
                  <option key={cat.categoryNo} value={cat.categoryNo}>
                    {cat.categoryName}
                  </option>
                );
              })}
            </SelectBox>
          </div>
        </FlexItem>
        <PageMidTitle>내용</PageMidTitle>
        <ContentInput as="textarea" value={boardContent} onChange={(e) => setBoardContent(e.target.value)} />
      </InputGroup>
      <ButtonGroup>
        <ActionButton onClick={handleUpdate}>수정완료</ActionButton>
        <ActionButton onClick={() => navigate(-1)}>뒤로가기</ActionButton>
      </ButtonGroup>
    </MainContent>
  );
};
const PageMidTitle = styled.h3`
  display: flex;
  font-size: 18px;
  color: #000000;
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

const SelectBox = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;

const FlexItem = styled.div`
  display: flex; /* 자식 요소들을 가로로 정렬 */
  justify-content: space-between;
`;

const LoaderArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-weight: 500;
`;
export default EditBoard;
