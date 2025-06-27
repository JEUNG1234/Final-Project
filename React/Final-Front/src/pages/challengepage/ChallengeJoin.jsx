import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import { IoCameraOutline } from 'react-icons/io5';
import useUserStore from '../../Store/useStore';
import { challengeService } from '../../api/challengeService';
import { fileupload } from '../../api/fileupload'; // 💡 fileupload 모듈 임포트

const ChallengeJoin = () => {
  const navigate = useNavigate();
  const { id: challengeNo } = useParams();
  const { user } = useUserStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // 💡 업로드할 파일 상태
  const [previewUrl, setPreviewUrl] = useState(''); // 💡 미리보기 URL 상태

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePhotoAttach = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!imageFile) {
        alert('인증 사진을 첨부해주세요.');
        return;
    }
    if (!user || !user.userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 1. S3에 이미지 업로드
      const imageInfo = await fileupload.uploadImageToS3(imageFile, 'challenge-completions/');
      if (!imageInfo || !imageInfo.url) {
        alert('이미지 업로드에 실패했습니다.');
        return;
      }
      
      // 2. 백엔드에 데이터 전송
      const payload = {
        userId: user.userId,
        completeTitle: title,
        completeContent: content,
        completeImageUrl: imageInfo.url, // 💡 업로드된 이미지 URL 포함
      };
      
      await challengeService.createCompletion(challengeNo, payload);

      alert('챌린지 참여가 완료되었습니다!');
      navigate(`/challenge/${challengeNo}`);
    } catch (error) {
      console.error('챌린지 참여 실패:', error);
      alert('챌린지 참여에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} 챌린지 참여
      </PageTitle>

      <FormContainer>
        <FormField>
          <Label>제목</Label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>

        <FormField>
          <Label>작성자</Label>
          <AuthorInputGroup>
            <AuthorName>{user?.userName || '로그인 필요'}</AuthorName>
            <PhotoAttachContainer>
              {previewUrl ? (
                <PreviewImage src={previewUrl} alt="첨부 이미지 미리보기" />
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
        <GoBackButton onClick={handleSubmit}>참여신청</GoBackButton>
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
  min-width: 80px;

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
  flex-wrap: wrap;

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
  flex-shrink: 0;
  min-width: 120px;
  text-align: center;

  @media (max-width: 480px) {
    width: calc(100% - 30px);
  }
`;

const PhotoAttachContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
  flex-wrap: wrap;

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
  flex-grow: 1;
  text-align: center;
  min-width: 100px;

  @media (max-width: 480px) {
    flex-grow: 0;
    min-width: unset;
    width: calc(60% - 10px);
    text-align: left;
  }
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const PhotoAttachButton = styled.label`
  background-color: #4d8eff;
  color: white;
  padding: 10px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: #3c75e0;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9em;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  width: calc(100% - 20px);
  height: 300px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4d8eff;
  }

  @media (max-width: 768px) {
    width: 100%;
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