import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { FaClipboardList } from 'react-icons/fa';
import defaultChallengeImg from '../../assets/challengeImg.jpg';
import useUserStore from '../../Store/useStore';
import { challengeService } from '../../api/challengeService';

const ChallengeCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const prefillData = location.state;
  // const isPrefilled = !!prefillData; // ✅ 이 라인을 삭제합니다.

  const [formData, setFormData] = useState({
    challengeTitle: prefillData?.title || '',
    author: user?.userName || '관리자',
    challengeStartDate: prefillData?.startDate || '',
    challengeEndDate: prefillData?.endDate || '',
    challengePoint: prefillData?.points || 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultChallengeImg);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
    if (!user?.userId) {
      alert('관리자 로그인이 필요합니다.');
      return;
    }

    const payload = {
      userId: user.userId,
      voteNo: prefillData.voteNo,
      voteContentNo: prefillData.voteContentNo,
      challengeTitle: formData.challengeTitle,
      challengeStartDate: formData.challengeStartDate,
      challengeEndDate: formData.challengeEndDate,
      challengePoint: parseInt(formData.challengePoint, 10),
    };
    
    try {
      await challengeService.createChallenge(payload);
      alert('챌린지가 성공적으로 생성되었습니다.');
      navigate('/challenge');
    } catch (error) {
      alert('챌린지 생성에 실패했습니다.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <MainContent>
      <PageTitle>
        <FaClipboardList /> 챌린지 생성
      </PageTitle>

      <FormGrid>
        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label>제목</Label>
          <Input name="challengeTitle" value={formData.challengeTitle} onChange={handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label>작성자</Label>
          <Input name="author" value={formData.author} readOnly />
        </FormGroup>

        <FormGroup style={{ gridColumn: '2 / 4' }}>
          <Label>대표 이미지</Label>
          <FileWrapper>
            <FileInputDisplay disabled value={imageFile ? imageFile.name : '기본 이미지.JPG'} />
            <FileInputLabel htmlFor="challenge-image">파일첨부</FileInputLabel>
            <input id="challenge-image" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </FileWrapper>
        </FormGroup>

        <FormGroup>
          <Label>기간</Label>
          <DateWrapper>
            <Input
              type="date"
              name="challengeStartDate"
              value={formData.challengeStartDate}
              onChange={handleInputChange}
            />
            <span>–</span>
            <Input
              type="date"
              name="challengeEndDate"
              value={formData.challengeEndDate}
              onChange={handleInputChange}
            />
          </DateWrapper>
        </FormGroup>

        <FormGroup>
          <Label>포인트</Label>
          <Input name="challengePoint" type="number" value={formData.challengePoint} onChange={handleInputChange} />
        </FormGroup>
      </FormGrid>

      <PreviewSection>
        <Label>미리보기</Label>
        <PreviewWrapper>
          <ChellengeCard>
            <CardImage src={previewUrl} alt="미리보기" />
            <CardContent>
              <CardTitle>이름: {formData.challengeTitle}</CardTitle>
              <CardPeriod>
                기간: {formData.challengeStartDate?.replaceAll('-', '.')} - {formData.challengeEndDate?.replaceAll('-', '.')}
              </CardPeriod>
              <CardCompletion>완료: 0</CardCompletion>
              <ProgressBarContainer>
                <ProgressBarFill percentage={0} />
              </ProgressBarContainer>
              <CardAchievement>달성률: 0%</CardAchievement>
            </CardContent>
          </ChellengeCard>
        </PreviewWrapper>
      </PreviewSection>

      <ActionButtons>
        <SubmitButton onClick={handleSubmit}>챌린지 생성</SubmitButton>
        <CancelButton onClick={handleGoBack}>뒤로가기</CancelButton>
      </ActionButtons>
    </MainContent>
  );
};

// --- Styled Components ---
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 30px;
  margin-top: 20px;
`;
const FormGroup = styled.div``;
const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f8f9fa;
  &:read-only {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;
const FileWrapper = styled.div`
  display: flex;
`;
const FileInputDisplay = styled.input`
  flex-grow: 1;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px 0 0 6px;
  background-color: #e9ecef;
  border-right: none;
`;
const FileInputLabel = styled.label`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
`;
const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PreviewSection = styled.div`
  margin-top: 40px;
`;
const PreviewWrapper = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
`;
const BaseButton = styled.button`
  padding: 12px 35px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;
const SubmitButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;
`;
const CancelButton = styled(BaseButton)`
  background-color: #6c757d;
  color: white;
`;
const ChellengeCard = styled.div`
  width: 250px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  background-color: #f0f7ff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const CardImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  background-color: #ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const CardContent = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const CardTitle = styled.p`
  font-size: 13px;
  font-weight: bold;
`;
const CardPeriod = styled.p`
  font-size: 11px;
`;
const CardCompletion = styled.p`
  font-size: 11px;
`;
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 7px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 4px;
  overflow: hidden;
`;
const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.percentage || 0}%;
  background-color: #4d8eff;
  border-radius: 4px;
`;
const CardAchievement = styled.p`
  font-size: 11px;
  text-align: right;
  margin: 4px 0 0 0;
`;

export default ChallengeCreate;