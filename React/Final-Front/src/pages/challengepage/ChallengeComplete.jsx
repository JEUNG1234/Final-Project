import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import { challengeService } from '../../api/challengeService';

const ChallengeComplete = () => {
  const navigate = useNavigate();
  const { id: completionNo } = useParams();
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        setLoading(true);
        const data = await challengeService.getCompletionDetail(completionNo);
        setCompletion(data);
      } catch (error) {
        alert('인증글을 불러오는 데 실패했습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletion();
  }, [completionNo, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return <MainContent>로딩 중...</MainContent>;
  }

  if (!completion) {
    return <MainContent>인증글 정보를 찾을 수 없습니다.</MainContent>;
  }
  
  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} 인증글 상세보기
      </PageTitle>

      <FormContainer>
        <FormField>
          <Label>제목</Label>
          <Input type="text" value={completion.completeTitle} readOnly />
        </FormField>

        <FormField>
          <Label>작성자</Label>
          <AuthorInputGroup>
            <AuthorName>{completion.userName}</AuthorName>
          </AuthorInputGroup>
        </FormField>
        
        {completion.completeImageUrl && (
            <FormField wide>
                <Label>인증 사진</Label>
                <ImagePreview src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${completion.completeImageUrl}`} alt="인증 사진" />
            </FormField>
        )}

        <FormField wide>
          <Label>내용</Label>
          <TextArea value={completion.completeContent} readOnly />
        </FormField>
      </FormContainer>

      <GoBackButtonContainer>
        <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>
      </GoBackButtonContainer>
    </MainContent>
  );
};

export default ChallengeComplete;

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
  background-color: #f8f8f8;
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

const TextArea = styled.textarea`
  width: calc(100% - 20px); /* 양쪽 패딩 고려 */
  height: 300px; /* 이미지와 유사하게 높이 설정 */
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f8f8f8;
  resize: vertical; /* 세로로만 크기 조절 가능 */

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서 꽉 채우도록 */
    height: 200px;
    padding: 12px;
  }
`;

const ImagePreview = styled.img`
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-top: 10px;
`;

const GoBackButtonContainer = styled.div`
  display: flex;
  justify-content: center;
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