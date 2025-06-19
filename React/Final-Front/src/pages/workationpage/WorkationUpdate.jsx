// src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/MediaQueries';

import { PageTitle, PageButton } from '../../styles/common/MainContentLayout';

import { MdWork } from 'react-icons/md';

import NaverMapWithGeocoding from '../../components/NaverMapWithGeocoding';

import {
  FaSquare,
  FaRulerCombined,
  FaHourglassHalf,
  FaUsers,
  FaChair,
  FaPlug,
  FaHotTub,
  FaSmokingBan,
  FaWifi,
  FaUtensils,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

import Modal from '../../components/Modal';

const WorkationUpdate = () => {
  const navigate = useNavigate();

  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

  const [showMap] = useState(false); //지도 표시 여부 상태

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  // 선택된 주소와 좌표를 저장할 상태 (NaverMapWithGeocoding에서 받아올 값)
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });

  // ... (기존 날짜, 파일 업로드 관련 상태 및 핸들러) ...

  // '주소등록' 버튼 클릭 시 모달 열기
  const handleOpenMapModal = () => {
    setIsMapModalOpen(true);
  };

  // 모달 닫기
  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  useEffect(() => {
    if (selectedCoords.lat && selectedCoords.lng) {
      console.log('selectedCoords가 바뀜:', selectedCoords);
    }
  }, [selectedCoords]);

  // NaverMapWithGeocoding에서 주소와 좌표를 선택했을 때 호출될 함수
  // 이 함수를 NaverMapWithGeocoding 컴포넌트에 props로 전달할 것임.
  const handleAddressSelect = (address, lat, lng) => {
    setSelectedAddress(address); // 메인 폼의 주소 input에 설정
    setSelectedCoords({ lat, lng }); // 위도/경도 저장
    setIsMapModalOpen(false); // 모달 닫기
    // 필요한 경우, 여기서 address와 lat, lng를 다른 폼 데이터와 함께 관리하는 상태에 업데이트.
    // 예를 들어, 장소 정보 객체에 address와 coords를 추가하는 식으로.]
    console.log(selectedCoords);
  };

  const allDays = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState([]); // 선택된 요일들을 배열로 관리

  const handleDayToggle = (day) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        // 이미 선택된 요일이면 제거
        return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
      } else {
        // 선택되지 않은 요일이면 추가
        return [...prevSelectedDays, day];
      }
    });
  };

  //시설별 이미지 등록
  const [placeImage, setPlaceImage] = useState({ name: '', previewUrl: '' });
  const [facilityImage, setFacilityImage] = useState({ name: '', previewUrl: '' });
  const [precautionImage, setPrecautionImage] = useState({ name: '', previewUrl: '' });

  // 파일 선택 시 동작 (선택된 파일 정보 콘솔에 출력 예시)
  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const imageInfo = { name: file.name, previewUrl };

    if (type === 'place') {
      setPlaceImage(imageInfo);
    } else if (type === 'facility') {
      setFacilityImage(imageInfo);
    } else if (type === 'precaution') {
      setPrecautionImage(imageInfo);
    }
  };

  const handleSubmit = () => {
    console.log({});
    alert('워케이션정보가 등록되었습니다.');
    navigate('/workationList');
  };

  //날짜 초기화

  //날짜 적용후 달력 닫기

  return (
    <FullWapper>
      <MainContent>
        <Tabs>
          <TabButton className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>
            장소 소개
          </TabButton>
          <TabButton className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}>
            시설 안내
          </TabButton>
          <TabButton
            className={activeTab === 'precautions' ? 'active' : ''}
            onClick={() => setActiveTab('precautions')}
          >
            유의 사항
          </TabButton>
          <TabButton className={activeTab === 'refund' ? 'active' : ''} onClick={() => setActiveTab('refund')}>
            오시는 길
          </TabButton>
        </Tabs>
        {/* 장소소개 탭 */}
        {activeTab === 'intro' && (
          <>
            <ImageSection>
              <img src={placeImage.previewUrl} alt="장소 이미지 미리보기" />
            </ImageSection>{' '}
            {/* 실제 이미지 URL로 교체 필요 */}
            <Title>제주 애월 스테이</Title>
            <Subtitle>주소</Subtitle>
            <Description>장소 소개</Description>
            <Subtitle>주요 특징</Subtitle>
            <FeaturesSection>
              <FeatureItem>주요 특징</FeatureItem>
            </FeaturesSection>
          </>
        )}
        {/* 시설안내 탭 */}
        {activeTab === 'facilities' && (
          <>
            <ImageSection>
              <img src={facilityImage.previewUrl} alt="시설 미리보기" />
            </ImageSection>{' '}
            <FacilityContent>
              <FacilityLeftContent>
                <FaciltyLeftFirstInfo>
                  <h2>시설안내</h2>
                  <h3>4인용 테이블 5개</h3>
                </FaciltyLeftFirstInfo>
                <FaciltyLeftSecondInfo>
                  <h2>영업시간 | 휴무일</h2>
                  <h3>8시 ~ 18시 | 없음</h3>
                </FaciltyLeftSecondInfo>
              </FacilityLeftContent>
              <FacilityRightContent>
                <InfoBlock>
                  <InfoIcon as={FaSquare} /> {/* 공간유형 아이콘 (임시) */}
                  <InfoText>공간유형</InfoText>
                  <DetailText>스터디룸</DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaRulerCombined} /> {/* 공간면적 아이콘 (임시) */}
                  <InfoText>공간면적</InfoText>
                  <DetailText>33m²</DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaHourglassHalf} /> {/* 예약시간 아이콘 (임시) */}
                  <InfoText>예약시간</InfoText>
                  <DetailText>최소 1시간 부터</DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaUsers} /> {/* 수용인원 아이콘 (임시) */}
                  <InfoText>수용인원</InfoText>
                  <DetailText>최소 1명 ~ 최대 20명</DetailText>
                </InfoBlock>
              </FacilityRightContent>
            </FacilityContent>
          </>
        )}

        {activeTab === 'precautions' && (
          <>
            <Subtitle>예약시 주의사항</Subtitle>
            <Description>ex)주류를 이용하실 경우 방문인원 전원 신분증 지참 부탁드립니다.</Description>
            <ImageSection>
              <img src={precautionImage.previewUrl} alt="유의사항이미지 미리보기" />
            </ImageSection>{' '}
          </>
        )}

        {/* 위치 정보 탭 */}
        {activeTab === 'refund' && (
          <>
            <Title>오시는 길</Title>
          </>
        )}
      </MainContent>
      <DateContent>
        {/* 장소소개 탭 */}
        {activeTab === 'intro' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 장소소개
            </PageTitle>

            <FormGroup>
              <Label htmlFor="placeName">장소명</Label>
              <Input id="placeName" type="text" placeholder="고유 장소명 입력" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="placeImage">장소 이미지</Label>
              <Input id="placeImage" type="text" value={placeImage.name} readOnly />
              <HiddenFileInput id="placeUpload" type="file" onChange={(e) => handleImageUpload(e, 'place')} />
              <StyledUploadButton htmlFor="placeUpload">이미지등록</StyledUploadButton>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">주소(위치)</Label>
              <Input id="address" type="text" placeholder="주소검색" value={selectedAddress} />
              <StyledUploadButton onClick={handleOpenMapModal}>주소등록</StyledUploadButton>
            </FormGroup>
            {showMap && <NaverMapWithGeocoding />}
            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              {' '}
              {/* 텍스트 영역 상단 정렬 */}
              <Label htmlFor="placeIntro">장소소개</Label>
              <TextArea id="placeIntro" placeholder="장소정보를 상세하게 소개해주세요" />
            </FormTextareaGroup>

            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              {' '}
              {/* 텍스트 영역 상단 정렬 */}
              <Label htmlFor="mainFeatures">주요특징</Label>
              <TextArea id="mainFeatures" placeholder="주요특징을 작성해주세요." />
            </FormTextareaGroup>

            <ActionButtons>
              <DangerButton onClick={() => navigate(-1)}>취소하기</DangerButton>
              <PrimaryButton onClick={() => setActiveTab('facilities')}>다음으로</PrimaryButton>
            </ActionButtons>
          </>
        )}

        {/* 시설안내 탭 */}
        {activeTab === 'facilities' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 시설안내
            </PageTitle>

            <FormGroup>
              <Label htmlFor="facilityImage">이미지</Label>
              <Input id="facilityImage" type="text" value={facilityImage.name} readOnly />
              <HiddenFileInput id="facilityUpload" type="file" onChange={(e) => handleImageUpload(e, 'facility')} />
              <StyledUploadButton htmlFor="facilityUpload">이미지등록</StyledUploadButton>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="placeName">시설안내</Label>
              <Input id="placeName" type="text" placeholder="ex)4인용 테이블 5개" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="placeName">영업시간</Label>
              <Input id="placeName" type="text" placeholder="ex)08시 ~ 18시" />
            </FormGroup>

            <FormGroup>
              <Label>휴무일</Label>
              <DayButtonContainer>
                {allDays.map((day) => (
                  <DayButton key={day} onClick={() => handleDayToggle(day)} isSelected={selectedDays.includes(day)}>
                    {day}
                  </DayButton>
                ))}
              </DayButtonContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="placeName">공간유형</Label>
              <Input id="placeName" type="text" placeholder="ex)스터디움" />
            </FormGroup>

            <SpaceFormGroup>
              <Label htmlFor="placeName">공간면적</Label>
              <SpaceInputGroup>
                <SpaceInput id="placeName" type="text" /> m²
                <SpaceInput />평
              </SpaceInputGroup>
            </SpaceFormGroup>

            <SpaceFormGroup>
              <Label htmlFor="placeName">수용인원</Label>
              <SpaceInputGroup>
                최소 <SpaceInput id="placeName" type="text" />
                최대
                <SpaceInput />
              </SpaceInputGroup>
            </SpaceFormGroup>

            <FormGroup>
              <Label htmlFor="placeName">URL</Label>
              <Input id="placeName" type="text" placeholder="ex)08시 ~ 18시" />
            </FormGroup>

            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('intro')}>이전으로</DangerButton>
              <PrimaryButton onClick={() => setActiveTab('precautions')}>다음으로</PrimaryButton>
            </ActionButtons>
          </>
        )}

        {activeTab === 'precautions' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 유의사항
            </PageTitle>
            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              <Label htmlFor="mainFeatures">주요특징</Label>
              <TextArea id="mainFeatures" placeholder="주요특징을 작성해주세요." />
            </FormTextareaGroup>
            <FormGroup>
              <Label htmlFor="precautionImage">장소 이미지</Label>
              <Input id="placeprecautionImageImage" type="text" value={precautionImage.name} readOnly />
              <HiddenFileInput id="precautionUpload" type="file" onChange={(e) => handleImageUpload(e, 'precaution')} />
              <StyledUploadButton htmlFor="precautionUpload">이미지등록</StyledUploadButton>
            </FormGroup>
            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('facilities')}>이전으로</DangerButton>
              <PrimaryButton onClick={() => setActiveTab('refund')}>다음으로</PrimaryButton>
            </ActionButtons>
          </>
        )}

        {activeTab === 'refund' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 오시는 길
            </PageTitle>
            <FormTextareaGroup style={{ alignItems: 'flex-start', height: '40%' }}>
              <Label htmlFor="mainFeatures">대중교통</Label>
              <TextArea style={{ height: '30%' }} id="mainFeatures" placeholder="ex)애월항에서 도보 5분" />
            </FormTextareaGroup>

            <FormTextareaGroup style={{ alignItems: 'flex-start', height: '40%' }}>
              <Label htmlFor="mainFeatures">주차</Label>
              <TextArea style={{ height: '30%' }} id="mainFeatures" placeholder="ex)건물 내 주차장 이용 가능 (무료)" />
            </FormTextareaGroup>

            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('precautions')}>이전으로</DangerButton>
              <PrimaryButton onClick={handleSubmit}>등록하기</PrimaryButton>
            </ActionButtons>
          </>
        )}
        <Modal isOpen={isMapModalOpen} onClose={handleCloseMapModal} title="장소 주소 검색(정확한 주소를 입력해주세요)">
          <p>ex)서울특별시 강남구 테헤란로 130 남도빌딩</p>
          {/* onAddressSelect 프롭스를 NaverMapWithGeocoding에 전달 */}
          <NaverMapWithGeocoding onAddressSelect={handleAddressSelect} />
        </Modal>
      </DateContent>
    </FullWapper>
  );
};

const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh;
  margin: 30px auto;
`;

const MainContent = styled.div`
  width: 50%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/

  min-height: 80vh;

  background: white;

  padding: 30px 30px 0 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const DayButton = styled(PageButton)`
  padding: 0;
  width: 3vw;
  height: 4vh;
  max-width: 45px;
`;

const DateContent = styled.form`
  position: relative; /* ActionButtons가 이 요소를 기준으로 위치하게 함 */
  width: 50%;
  max-width: 1400px;
  min-height: 80vh;
  background: white;
  padding: 30px;
  padding-bottom: 100px; /* 하단 버튼을 위한 공간 확보 (버튼 높이 + 여백) */
  margin: 0 0 0 30px;
  border-radius: 10px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤이 생기도록 추가 */
`;

const Tabs = styled.div`
  display: flex;
  /* 탭 스타일 */
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  background: none;
  border-radius: 0;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  &:hover {
    color: #007bff; /* 예시 색상 */
  }
  &.active {
    color: #007bff; /* 예시 색상 */
    border-bottom: 2px solid #007bff; /* 예시 색상 */
    font-weight: bold;
  }
`;

//이미지 영역
const ImageSection = styled.div`
  width: 70%;
  max-height: 300px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #267eff;
`;

const Subtitle = styled.h3`
  font-size: 22px;
  color: #555;
  height: 6%;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 5px;
  height: 10%;
`;


const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.p`
  font-size: 15px;
  color: #444;
  height: 15%;
  /* 아이콘이 있다면 여기에 아이콘 스타일 추가 */
`;

//시설안내 정보 영역
const FacilityContent = styled.div`
  width: 100%;
  height: 50%;

  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const FacilityLeftContent = styled.div`
  width: 50%;
  height: 100%;
  ${media.md`
      
      font-size: ${({ theme }) => theme.fontSizes.sm};
    `}
`;

const FacilityRightContent = styled.div`
  width: 50%;
  height: 100%;
`;
const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* 각 정보 블록 간 간격 */
  margin-top: 15px;
  font-size: 1rem;
  color: #333;
`;

const InfoIcon = styled(FaSquare)`
  /* FaSquare를 기본 아이콘으로 사용. 실제는 다른 아이콘 필요 */
  color: #333; /* 아이콘 색상 */
  font-size: 0.8rem;
  margin-right: 10px; /* 아이콘과 텍스트 간 간격 */
`;

const InfoText = styled.span`
  font-weight: 500;
  color: #333;
`;

const DetailText = styled.span`
  color: #929393;
  margin-left: 10px;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 그리드 */
  gap: 20px; /* 아이콘 항목 간 간격 */
  margin-top: 30px; /* 정보 블록과의 간격 */
  padding-left: 10px; /* InfoBlock과 정렬 */
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #555;
  text-align: center;

  svg {
    font-size: 20px; /* 아이콘 크기 */
    color: #666;
    margin-bottom: 8px; /* 아이콘과 텍스트 간 간격 */
  }

  ${media.md`
      
        gap: 10px;
        margin-top: 0;
        font-size: 0px;
      `}
`;

const FaciltyLeftFirstInfo = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;

  h2 {
    margin-bottom: 0;
    text-align: left;
  }
  h3 {
    color: #929393;
    margin-bottom: 0;
    text-align: left;
  }
`;
const FaciltyLeftSecondInfo = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;

  h2 {
    margin-bottom: 0;
    text-align: left;
  }
  h3 {
    color: #929393;
    margin-bottom: 0;
    text-align: left;
  }
`;

const PrecautionContent = styled.div`
  width: 80%;
  height: 50%;
  border: 1px solid black;
  margin: 0 auto;
`;

// 지도의 기본 중심 좌표 (예: 제주 애월)
const MAP_CENTER = [33.4507, 126.5706]; // 위도, 경도
const MAP_ZOOM = 12; // 확대 레벨

//지도 컨테이너 스타일
const MapContainerStyled = styled.div`
  width: 90%; /* MainContent 너비에 맞추기 */
  height: 400px; /* 지도 높이 설정 */
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden; /* 모서리 둥글게 처리 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

//신청 영역
const FormContent = styled.div`
  width: 100%;
  /* height: 400px; */
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  padding: 30px; /* Added padding to give some space from the edges */
  justify-content: space-between; /* Distribute space between items */
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* Slightly reduced margin for fixed height */

  &:last-of-type {
    margin-bottom: 0; /* No margin bottom for the last row (textarea) */
  }
`;

const Label = styled.span`
  font-size: 16px; /* Slightly smaller font size for compactness */
  font-weight: bold;
  color: #333;
  width: 80px; /* Adjust label width as needed for fixed container */
  flex-shrink: 0; /* Prevent label from shrinking */
`;

// Styled input fields
const Input = styled.input`
  padding: 8px 12px; /* Slightly smaller padding */
  border: none;
  border-radius: 8px;
  font-size: 15px; /* Slightly smaller font size */
  outline: none;
  background-color: #ededed; /* Light blue background for inputs */
  width: calc(60% - 80px);

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

//공간 면적 전용 영역
const SpaceFormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
`;

const SpaceInput = styled.input`
  padding: 8px 12px; /* Slightly smaller padding */
  border: none;
  border-radius: 8px;
  font-size: 15px; /* Slightly smaller font size */
  outline: none;
  background-color: #ededed; /* Light blue background for inputs */
  width: calc(30% - 80px);

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

const SpaceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3%; /* Input과 "m²", "평" 텍스트 사이에 간격 적용 */
  flex-grow: 1; /* 남은 공간을 차지하여 오른쪽에 정렬 */
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  min-height: 80px; /* Adjusted min-height to fit 400px container */
  resize: vertical; /* Allow vertical resizing */
  outline: none;
  background-color: #ededed; /* Light blue background for textarea */

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

// Styled button
const SubmitButton = styled.button`
  background-color: #61a5fa;
  color: white;
  padding: 10px 20px; /* Slightly smaller padding for button */
  border: none;
  border-radius: 8px;
  font-size: 16px; /* Slightly smaller font size */
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px; /* Adjusted margin-top to fit container */
  transition: background-color 0.3s ease;
  align-self: center; /* Center the button */
  width: 160px; /* Adjusted width */
  flex-shrink: 0; /* Prevent button from shrinking if content is too large */

  &:hover {
    background-color: #4a8df1;
  }

  &:active {
    background-color: #3b7ae0;
  }
`;

//우측 정보 입력 영역
const FormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
`;

const FormTextareaGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 15%;
`;

const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
`;

// 파일 업로드 버튼 스타일 (label 태그를 사용)
const StyledUploadButton = styled.label`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto; /* 오른쪽 벽에 붙이기 */
  background-color: #1890ff;
  color: white;
  width: 40%;
  max-width: 120px;
  text-align: center; /* 텍스트 중앙 정렬 */
  line-height: 1; /* 텍스트 세로 중앙 정렬 */
  display: flex; /* flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */

  &:hover {
    background-color: #40a9ff;
  }
`;

// 실제 input type="file"을 숨기기 위한 스타일
const HiddenFileInput = styled.input`
  display: none; /* 화면에서 숨김 */
`;

const PrimaryButton = styled(Button)`
  background-color: #1890ff;
  color: white;

  &:hover {
    background-color: #40a9ff;
  }
`;

const DangerButton = styled(Button)`
  background-color: #ff4d4f;
  color: white;

  &:hover {
    background-color: #ff7875;
  }
`;
const ActionButtons = styled.div`
  position: absolute; /* DateContent를 기준으로 절대 위치 */
  bottom: 30px; /* 바닥에서 30px 위로 */
  left: 0;
  right: 0;
  width: 100%; /* 부모 DateContent의 전체 너비 */
  display: flex;
  justify-content: center;
  /* margin-top: 40px; 제거: absolute 포지셔닝에서는 margin-top이 의미 없음 */

  ${Button} {
    margin: 0 10px;
    width: 150px;
    padding: 15px;
  }
`;

// 요일 버튼 컨테이너
const DayButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* 요일 버튼 간 간격 */
  flex-wrap: wrap; /* 내용이 넘칠 경우 다음 줄로 넘어가도록 */
  flex-grow: 1; /* 가능한 공간을 차지하도록 */
  justify-content: center;
  width: 80%;
`;
export default WorkationUpdate;
