import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { MdWork } from 'react-icons/md';
import defaultImage from '../../assets/돌하르방.jpg'; // 미리보기를 위한 기본 이미지

const WorkcationCreate = () => {
  const navigate = useNavigate();

  // 폼 입력 상태 관리
  const [formState, setFormState] = useState({
    name: '',
    address: '',
    introduction: '',
    features: '',
  });

  // 이미지 파일 및 미리보기 URL 상태 관리
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
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
  
  const handleAddressSearch = () => {
    alert('주소 검색 기능 구현 예정입니다.');
  }

  const handleSubmit = () => {
    // API 제출 로직
    console.log('Form State:', formState);
    console.log('Image File:', imageFile);
    alert('새로운 워케이션 장소가 등록되었습니다.');
    navigate('/workcationadmin'); 
  };

  return (
    <MainContent>
      <PageTitle>
        <MdWork /> 워케이션 &gt; 장소 추가
      </PageTitle>

      <CreateContainer>
        {/* 왼쪽 미리보기 섹션 (상세페이지 디자인 적용) */}
        <PreviewSection>
          <PreviewWrapper>
            <PreviewImage src={previewUrl || defaultImage} alt="미리보기" />
            <PreviewTextContainer>
              <PreviewTitle>{formState.name || '제주 애월 스테이'}</PreviewTitle>
              <PreviewLocation>{formState.address || '제주도'}</PreviewLocation>
              <PreviewDescription>
                {formState.introduction.split('\n').map((line, index) => (
                  <span key={index}>{line}<br/></span>
                )) || '제주 서쪽 애월 해안가에 위치한 조용한 워케이션 공간입니다.'}
              </PreviewDescription>
              <PreviewSectionHeading>주요 특징</PreviewSectionHeading>
              <PreviewFeaturesList>
                {formState.features.split('\n').map((feature, index) => (
                  <PreviewFeatureItem key={index}>{feature}</PreviewFeatureItem>
                )) || '오션뷰 개인 작업 공간'}
              </PreviewFeaturesList>
            </PreviewTextContainer>
          </PreviewWrapper>
        </PreviewSection>

        {/* 오른쪽 폼 섹션 */}
        <FormSection>
          <FormGroup>
            <Label>*장소명</Label>
            <Input name="name" value={formState.name} onChange={handleInputChange} placeholder="장소명을 입력하세요." />
          </FormGroup>

          <FormGroup>
            <Label>*이미지</Label>
            <FileWrapper>
              <FileInputDisplay disabled value={imageFile ? imageFile.name : ''} placeholder="이미지를 선택하세요." />
              <FileInputLabel htmlFor="workcation-image">이미지등록</FileInputLabel>
              <input id="workcation-image" type="file" onChange={handleImageChange} style={{ display: 'none' }} />
            </FileWrapper>
          </FormGroup>

          <FormGroup>
            <Label>*주소(위치)</Label>
            <FileWrapper>
              <Input name="address" value={formState.address} onChange={handleInputChange} placeholder="주소를 입력하거나 검색하세요." />
              <AddressButton onClick={handleAddressSearch}>주소검색</AddressButton>
            </FileWrapper>
          </FormGroup>

          <FormGroup>
            <Label>*장소소개</Label>
            <TextArea name="introduction" value={formState.introduction} onChange={handleInputChange} placeholder="장소에 대한 설명을 입력하세요." />
          </FormGroup>

          <FormGroup>
            <Label>*주요특징 (한 줄에 하나씩 입력)</Label>
            <TextArea name="features" value={formState.features} onChange={handleInputChange} placeholder="오션뷰 개인 작업 공간&#10;고속 Wi-Fi" />
          </FormGroup>

          <ButtonContainer>
            <ActionButton variant="cancel" onClick={() => navigate(-1)}>취소하기</ActionButton>
            <ActionButton variant="submit" onClick={handleSubmit}>등록하기</ActionButton>
          </ButtonContainer>
        </FormSection>
      </CreateContainer>
    </MainContent>
  );
};

export default WorkcationCreate;

// --- Styled Components ---

const CreateContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 20px;
`;

const PreviewSection = styled.div`
  flex: 2;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 600px;
`;

// --- 상세페이지 디자인과 동일한 미리보기 스타일 ---
const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 12px;
  margin-bottom: 40px;
  background-color: #e9ecef;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
`;

const PreviewTextContainer = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: left;
`;

const PreviewTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #343a40;
  margin: 0 0 10px 0;
  min-height: 38px;
`;

const PreviewLocation = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: #868e96;
  margin: 0 0 30px 0;
  min-height: 21px;
`;

const PreviewDescription = styled.div`
  font-size: 1rem;
  color: #495057;
  line-height: 1.7;
  margin-bottom: 40px;
  min-height: 54px;
`;

const PreviewSectionHeading = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
`;

const PreviewFeaturesList = styled.div`
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  min-height: 28px;
`;

const PreviewFeatureItem = styled.p`
  margin: 0 0 10px 0;
`;
// --- 여기까지 ---

const FormSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
  line-height: 1.6;
`;

const FileWrapper = styled.div`
  display: flex;
`;

const FileInputDisplay = styled.input`
  flex-grow: 1;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px 0 0 6px;
  background-color: #e9ecef;
  border-right: none;
`;

const FileInputLabel = styled.label`
  padding: 12px 20px;
  background-color: #6c757d;
  color: white;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #5a6268;
  }
`;

const AddressButton = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.variant === 'submit' ? '#007bff' : '#dc3545')};

  &:hover {
    opacity: 0.9;
  }
`;