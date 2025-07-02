import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import useUserStore from '../../Store/useStore';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import BoardAPI from '../../api/board';
import CategoryAPI from '../../api/category';
import { fileupload } from '../../api/fileupload';

const AddBoard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const fileInputRef = useRef(null);

  const boardWriter = user?.userName || '';
  const userId = user?.userId || '';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [, setImageMeta] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const contentRef = useRef(null); // 👈 contentEditable 참조

  // 카테고리 불러오기
  useEffect(() => {
    CategoryAPI.getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('카테고리 불러오기 실패:', err));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }

    // ❌ 여기선 S3 업로드 하지 않음
    setImageMeta(null); // 기존 업로드 정보 초기화
  };

  const resetFileInput = () => {
    setFile(null);
    setImageMeta(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    const text = contentRef.current?.innerText || '';

    if (!title || !category || !text || !userId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    let uploadedImageMeta = null;

    try {
      // ✅ 파일이 있으면 이때 업로드 수행
      if (file) {
        const uploaded = await fileupload.uploadImageToS3(file, 'board/');
        uploadedImageMeta = {
          originalName: uploaded.originalName,
          changedName: uploaded.filename,
          path: uploaded.url,
          size: file.size,
        };
      }

      const postData = {
        boardTitle: title,
        boardContent: text,
        categoryNo: category,
        userId: userId,
        image: uploadedImageMeta,
      };

      await BoardAPI.createBoard(postData);
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
                if (cat.categoryName === '공지사항' && user.jobCode !== 'J2') return null;
                return (
                  <option key={cat.categoryNo} value={cat.categoryNo}>
                    {cat.categoryName}
                  </option>
                );
              })}
            </SelectBox>
          </FlexItem>

          <FlexItem>
            <PageMidTitle>사진첨부</PageMidTitle>
            <FileInputWrapper>
              <HiddenFileInput type="file" id="fileUpload" onChange={handleFileChange} ref={fileInputRef} />
              <FileNameDisplay type="text" readOnly value={file?.name || ''} placeholder="선택된 파일 없음" />
              {!file ? (
                <FileSelectButton htmlFor="fileUpload">파일 선택</FileSelectButton>
              ) : (
                <FileSelectButton as="button" type="button" onClick={resetFileInput}>
                  초기화
                </FileSelectButton>
              )}
            </FileInputWrapper>
          </FlexItem>
        </TwoColumnLayout>

        <PageMidTitle>내용</PageMidTitle>
        <EditorWrapper>
          {previewUrl && (
            <ImagePreviewInEditor>
              <img src={previewUrl} alt="미리보기 이미지" />
            </ImagePreviewInEditor>
          )}
          <EditableDiv
            contentEditable
            suppressContentEditableWarning
            ref={contentRef}
            placeholder="내용을 입력하세요."
            onInput={() => {}} // 내용은 handleSubmit에서만 참조
          />
        </EditorWrapper>
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

// 내용 작성 영역 스타일
const EditorWrapper = styled.div`
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  padding: 10px;
  min-height: 350px;
  font-family: 'Pretendard', sans-serif;
  margin-top: 5px;
`;

// 이미지 미리보기 영역 (내용 상단에 위치)
const ImagePreviewInEditor = styled.div`
  margin-bottom: 10px;
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    object-fit: contain;
    border: 1px solid #ccc;
  }
`;

// contentEditable div 자체
const EditableDiv = styled.div`
  min-height: 200px;
  font-size: 18px;
  line-height: 1.5;
  white-space: pre-wrap;
  outline: none;

  &::before {
    content: attr(placeholder);
    color: #bbb;
    pointer-events: none;
  }

  &:focus::before {
    content: '';
  }
`;

export default AddBoard;
