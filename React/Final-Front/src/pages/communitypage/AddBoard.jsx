import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import axios from 'axios';
import useUserStore from '../../Store/useStore';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { API_CONFIG, API_ENDPOINTS } from '../../api/config';

const AddBoard = () => {
  const navigate = useNavigate();

  const { user } = useUserStore();
  console.log(user);
  const boardWriter = user?.userName || '';
  const userId = user?.userId || '';

  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]); // 🔹 카테고리 목록 상태

  // 🔹 카테고리 목록 로딩
  useEffect(() => {
    axios
      .get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORY.BASE}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error('카테고리 불러오기 실패:', err);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !content || !userId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('boardTitle', title);
    formData.append('boardContent', content);
    formData.append('categoryNo', category);
    formData.append('userId', userId);
    // 파일 업로드도 추가하려면 아래 주석 해제
    // if (file) formData.append('file', file);

    try {
      await axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.BOARD.CREATE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('게시글 등록 성공!');
      navigate('/communityboard');
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <FaComments />
        커뮤니티 게시판 {'>'} 게시글 작성
      </PageTitle>

      <InputGroup>
        <PageMidTitle>제목</PageMidTitle>
        <TitleInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
        />

        <PageMidTitle>작성자</PageMidTitle>
        <WriterInput type="text" readOnly value={boardWriter} placeholder="로그인 필요" />

        <TwoColumnLayout>
          <FlexItem>
            <PageMidTitle>게시글 유형</PageMidTitle>
            <SelectBox value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">게시글 유형을 선택해주세요.</option>
              {categories.map((cat) => {
                if (cat.categoryName === '공지사항' && user.jobCode !== 'J2') {
                  return null; // 🔒 j2가 아니면 "공지사항" 표시 안 함
                }
                return (
                  <option key={cat.categoryNo} value={cat.categoryNo}>
                    {cat.categoryName}
                  </option>
                );
              })}
            </SelectBox>
          </FlexItem>

          {/* 파일 업로드 활성화 시 사용 */}
          {/* 
          <FlexItem>
            <PageMidTitle>사진첨부</PageMidTitle>
            <FileInputWrapper>
              <HiddenFileInput type="file" id="fileUpload" onChange={handleFileChange} />
              <FileNameDisplay type="text" value={fileName} readOnly placeholder="선택된 파일 없음" />
              <FileSelectButton htmlFor="fileUpload">파일 선택</FileSelectButton>
            </FileInputWrapper>
          </FlexItem>
          */}
        </TwoColumnLayout>

        <PageMidTitle>내용</PageMidTitle>
        <ContentInput
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요."
        />
      </InputGroup>

      <ButtonGroup>
        <ActionButton onClick={handleSubmit}>게시글 등록</ActionButton>
        <ActionButton onClick={() => navigate('/communityboard')}>뒤로가기</ActionButton>
      </ButtonGroup>
    </MainContent>
  );
};

// --- Styled Components ---

const PageMidTitle = styled.h3`
  font-size: 18px;
  color: #000000;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 18px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #d0d5dd;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(150, 198, 254, 0.5);
  }
`;

const WriterInput = styled.input`
  width: 100%;
  font-size: 18px;
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
  font-size: 18px;
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

const TwoColumnLayout = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FlexItem = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
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

const FileInputWrapper = styled.div`
  display: flex;
  gap: 10px; /* 파일 이름 표시창과 버튼 사이의 간격 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
`;

const HiddenFileInput = styled.input`
  /* 실제 파일 입력 필드는 시각적으로 숨김 */
  display: none;
`;

const FileNameDisplay = styled.input`
  flex: 1; /* 남은 공간을 모두 차지하여 파일 이름이 길어도 잘 보이도록 */
  padding: 10px;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  background-color: #f8f8f8; /* 읽기 전용임을 나타내기 위한 배경색 */
  color: #555;
  font-size: 16px;
  cursor: default; /* 클릭해도 활성화되지 않도록 */
  min-width: 0; /* flex 아이템이 내용물보다 커지는 것을 방지 */
`;

const FileSelectButton = styled.label`
  padding: 10px 15px;
  background-color: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */
  display: inline-flex; /* 텍스트 정렬을 위해 flexbox 사용 */
  align-items: center;
  justify-content: center;
  height: 41px; /* FileNameDisplay와 높이 맞추기 */

  &:hover {
    background-color: #f0f0f0;
  }
  &:active {
    background-color: #e0e0e0;
  }
`;

export default AddBoard;
