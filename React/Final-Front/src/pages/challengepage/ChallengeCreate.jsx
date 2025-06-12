import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { FaClipboardList } from 'react-icons/fa';
import defaultChallengeImg from '../../assets/challengeImg.jpg';

const ChallengeCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state;
  const isPrefilled = !!prefillData;

  const [formData, setFormData] = useState({
    title: prefillData?.title || '',
    author: 'admin',
    startDate: prefillData?.startDate || '',
    endDate: prefillData?.endDate || '',
    type: prefillData?.type || '장기',
    points: prefillData?.points || '',
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

  const handleSubmit = () => {
    console.log({ ...formData, imageFile });
    alert('챌린지가 생성되었습니다.');
    navigate('/chellenge');
  };

  return (
    <MainContent>
      <PageTitle>
        <FaClipboardList /> 챌린지 생성
      </PageTitle>

      {/* --- FormGrid 레이아웃 수정 --- */}
      <FormGrid>
        {/* 제목 필드가 한 줄을 모두 차지하도록 수정 */}
        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label>제목</Label>
          <Input name="title" value={formData.title} onChange={handleInputChange} />
        </FormGroup>

        {/* 작성자 필드 */}
        <FormGroup>
          <Label>작성자</Label>
          <Input name="author" value={formData.author} readOnly />
        </FormGroup>
        
        {/* 이미지 첨부 필드가 나머지 공간을 차지하도록 수정 */}
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
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} readOnly={isPrefilled} />
            <span>–</span>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} readOnly={isPrefilled} />
          </DateWrapper>
        </FormGroup>

        <FormGroup>
          <Label>유형</Label>
          <RadioWrapper>
            <RadioLabel disabled={isPrefilled}>
              <input type="radio" name="type" value="장기" checked={formData.type === '장기'} onChange={handleInputChange} disabled={isPrefilled} /> 장기
            </RadioLabel>
            <RadioLabel disabled={isPrefilled}>
              <input type="radio" name="type" value="단기" checked={formData.type === '단기'} onChange={handleInputChange} disabled={isPrefilled} /> 단기
            </RadioLabel>
          </RadioWrapper>
        </FormGroup>

        <FormGroup>
          <Label>포인트</Label>
          <Input name="points" value={formData.points} onChange={handleInputChange} readOnly={isPrefilled} />
        </FormGroup>
      </FormGrid>

      <PreviewSection>
        <Label>미리보기</Label>
        <PreviewWrapper>
          <ChellengeCard>
            <CardImage src={previewUrl} alt="미리보기" />
            <CardContent>
              <CardTitle>이름: {formData.title}</CardTitle>
              <CardPeriod>기간: {formData.startDate?.replaceAll('-', '.')} - {formData.endDate?.replaceAll('-', '.')}</CardPeriod>
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
        <CancelButton onClick={() => navigate('/chellenge')}>뒤로가기</CancelButton>
      </ActionButtons>
    </MainContent>
  );
};


// --- Styled Components (변경 없음) ---
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
const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 41px;
`;
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${(props) => (props.disabled ? '#aaa' : 'inherit')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
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