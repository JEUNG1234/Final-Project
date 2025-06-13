import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle, Pagination, PageButton } from '../../styles/common/MainContentLayout'; // 기존 common/MainContentLayout 활용
import { BsFire } from 'react-icons/bs';
import { IoCameraOutline } from 'react-icons/io5'; // 사진 첨부 아이콘

const ChallengeJoin = () => {
  const navigate = useNavigate();

  // 입력 필드 상태 관리
  const [breadcrumbs, setBreadcrumds] = useState('하루 10000보 걷기');
  const [title, setTitle] = useState('하루 만보 걷기 완료'); // 이미지에 있는 기본값 설정
  const [author, setAuthor] = useState('홍길동'); // 이미지에 있는 기본값 설정
  const [content, setContent] = useState('열심히 했어'); // 이미지에 있는 기본값 설정
  const [attachedPhoto, setAttachedPhoto] = useState(null); // 첨부된 사진 파일 상태

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handlePhotoAttach = (event) => {
    // 실제 파일 첨부 로직 (예: 파일을 서버에 업로드하고 URL을 받아오거나, 미리보기)
    const file = event.target.files[0];
    if (file) {
      setAttachedPhoto(file.name); // 파일 이름만 저장 (실제로는 파일 객체나 URL을 저장)
      alert(`사진 첨부: ${file.name}`);
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} {breadcrumbs} {'>'} 챌린지 참여
      </PageTitle>

      <FormContainer>
        <FormField>
          <Label>제목</Label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>

        <FormField>
          <Label>작성자</Label>
          <AuthorInputGroup>
            <AuthorName>{author}</AuthorName>
            <PhotoAttachContainer>
              {attachedPhoto ? (
                <AttachedPhotoName>{attachedPhoto}</AttachedPhotoName>
              ) : (
                <PlaceholderPhotoText>사진첨부</PlaceholderPhotoText>
              )}
              <PhotoAttachButton htmlFor="photo-upload">
                <IoCameraOutline /> 사진 첨부
              </PhotoAttachButton>
              <FileInput id="photo-upload" type="file" accept="image/*" onChange={handlePhotoAttach} />
            </PhotoAttachContainer>
          </AuthorInputGroup>
        </FormField>

        <FormField wide>
          <Label>내용</Label>
          <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
        </FormField>
      </FormContainer>

      <GoBackButtonContainer>
        <GoBackButton onClick={handleGoBack}>참여신청</GoBackButton>
        <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>
      </GoBackButtonContainer>
    </MainContent>
  );
};

export default ChallengeJoin;

// =========================================================
// Styled Components
// =========================================================

const FormContainer = styled.div`
  background-color: #fff;
  /* border-radius: 15px; */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); */
  padding: 30px 60px;
  margin: 30px 50px;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 768px) {
    padding: 25px 30px;
    margin: 20px 20px;
    gap: 20px;
  }
`;

const FormField = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;

  ${(props) =>
    props.wide &&
    `
    flex-direction: column;
    align-items: flex-start;
  `}

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Label = styled.label`
  font-size: 20px;
  font-weight: bold;
  color: #555;
  min-width: 80px; /* 라벨 너비 고정 */

  @media (max-width: 768px) {
    min-width: unset;
    font-size: 1em;
  }
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4d8eff;
  }
`;

const AuthorInputGroup = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 15px;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
  }
`;

const AuthorName = styled.div`
  padding: 10px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f8f8;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0; /* 내용이 길어져도 줄어들지 않음 */
  min-width: 120px; /* 최소 너비 설정 */
  text-align: center;

  @media (max-width: 480px) {
    width: calc(100% - 30px); /* 패딩 고려하여 100% */
  }
`;

const PhotoAttachContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1; /* 남은 공간을 채우도록 */
  flex-wrap: wrap; /* 요소들이 많아질 때 줄바꿈 */

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PlaceholderPhotoText = styled.div`
  background-color: #f8f8f8;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #999;
  font-size: 1em;
  flex-grow: 1; /* 최대한 공간 차지 */
  text-align: center;
  min-width: 100px; /* 최소 너비 */

  @media (max-width: 480px) {
    flex-grow: 0; /* 작은 화면에서 유연성 줄임 */
    min-width: unset;
    width: calc(60% - 10px); /* 버튼 옆에 적절히 배치 */
    text-align: left;
  }
`;

const AttachedPhotoName = styled.div`
  background-color: #e0e0e0; /* 첨부 완료 시 색상 변경 */
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: #333;
  font-size: 1em;
  flex-grow: 1;
  text-align: center;
  min-width: 100px;
  white-space: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* ... 표시 */

  @media (max-width: 480px) {
    flex-grow: 0;
    min-width: unset;
    width: calc(60% - 10px);
    text-align: left;
  }
`;

const PhotoAttachButton = styled.label`
  background-color: #4d8eff;
  color: white;
  padding: 10px 15px;
  right-top-radius: 15px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  flex-shrink: 0; /* 버튼이 줄어들지 않도록 */

  &:hover {
    background-color: #3c75e0;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9em;
  }
`;

const FileInput = styled.input`
  display: none; /* 실제 파일 입력 필드를 숨김 */
`;

const TextArea = styled.textarea`
  width: calc(100% - 20px); /* 양쪽 패딩 고려 */
  height: 300px; /* 이미지와 유사하게 높이 설정 */
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  outline: none;
  resize: vertical; /* 세로로만 크기 조절 가능 */
  transition: border-color 0.2s;

  &:focus {
    border-color: #4d8eff;
  }

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서 꽉 채우도록 */
    height: 200px;
    padding: 12px;
  }
`;

const GoBackButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  /* padding: 20px 0 40px 0; */
`;

const GoBackButton = styled.button`
  height: 50px;
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
