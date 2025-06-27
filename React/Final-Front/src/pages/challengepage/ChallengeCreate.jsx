import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { FaClipboardList } from 'react-icons/fa';
import defaultChallengeImg from '../../assets/challengeImg.jpg';
import useUserStore from '../../Store/useStore';
import { challengeService } from '../../api/challengeService';
import { fileupload } from '../../api/fileupload';

const ChallengeCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const prefillData = location.state;

  const [formData, setFormData] = useState({
    challengeTitle: prefillData?.title || '',
    author: user?.userName || '관리자',
    challengeStartDate: prefillData?.startDate || '',
    challengeEndDate: prefillData?.endDate || '',
    challengePoint: prefillData?.points || 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultChallengeImg);

  useEffect(() => {
    if (formData.challengeStartDate && prefillData?.voteType) {
      const startDate = new Date(formData.challengeStartDate);
      const daysToAdd = prefillData.voteType === 'LONG' ? 30 : 7;
      startDate.setDate(startDate.getDate() + daysToAdd);

      const newEndDate = startDate.toISOString().split('T')[0];

      setFormData((prev) => ({
        ...prev,
        challengeEndDate: newEndDate,
      }));
    }
  }, [formData.challengeStartDate, prefillData?.voteType]);

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

    if (!imageFile) {
      alert('대표 이미지를 선택해주세요.');
      return;
    }

    try {
      const imageInfo = await fileupload.uploadImageToS3(imageFile, 'challenge-thumbnails/');
      if (!imageInfo || !imageInfo.filename) {
        alert('이미지 업로드에 실패했습니다.');
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
        challengeImageUrl: imageInfo.filename, // 수정: url -> filename
      };

      await challengeService.createChallenge(payload);
      alert('챌린지가 성공적으로 생성되었습니다.');
      // 수정: 챌린지 목록 대신 투표 결과 페이지로 이동
      navigate(`/voteresult/${prefillData.voteNo}`);
    } catch (error) {
      alert('챌린지 생성에 실패했습니다.');
      console.error(error);
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
          <Input name="challengeTitle" value={formData.challengeTitle} readOnly />
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
            <Input type="date" name="challengeEndDate" value={formData.challengeEndDate} readOnly />
          </DateWrapper>
        </FormGroup>

        <FormGroup>
          <Label>포인트</Label>
          <Input name="challengePoint" type="number" value={formData.challengePoint} readOnly />
        </FormGroup>
      </FormGrid>

      <PreviewSection>
        <Label>미리보기</Label>
        <PreviewWrapper>
          {/* --- 미리보기 카드 UI 수정 --- */}
          <ChallengeCard>
            <CardImageArea>
              <CardImage src={previewUrl} alt="미리보기" />
            </CardImageArea>
            <CardContent>
              <CardTitle>챌린지: {formData.challengeTitle}</CardTitle>
              <CardPeriod>
                기간 : {formData.challengeStartDate} ~ {formData.challengeEndDate}
              </CardPeriod>
              <CardCompletion>포인트 : {formData.challengePoint}P</CardCompletion>
              <CardCompletion>참여인원: 0명</CardCompletion>
            </CardContent>
          </ChallengeCard>
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

// ChallengeCard 스타일을 Challenge.jsx와 유사하게 맞춤
const ChallengeCard = styled.div`
  width: 250px;
  padding-bottom: 5px;
  border-radius: 15px;
  border: 1px solid #ececec;
  background-color: #f0f7ff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CardImageArea = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardImage = styled.img`
  width: 90%;
  height: 85%;
  object-fit: contain;
  background-color: #ffffff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const CardContent = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const CardTitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CardPeriod = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin: 0;
`;

// CardCompletion 스타일 추가
const CardCompletion = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin: 0;
`;
  

export default ChallengeCreate;