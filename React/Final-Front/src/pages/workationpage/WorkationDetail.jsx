// src/components/MainContent.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/MediaQueries';
import MyLeafletMap from '../../components/MyLeafletMap';

//달력기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// GoogleMapReact 대신 Leaflet 관련 컴포넌트 임포트
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS 임포트
import L from 'leaflet'; // Leaflet 자체 임포트 (마커 아이콘 깨짐 방지용)

// Leaflet 기본 마커 아이콘 깨짐 방지 설정 (이거 꼭 있어야 해요!)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

import { FaSquare, FaRulerCombined, FaHourglassHalf, FaUsers } from 'react-icons/fa';

import image from '../../assets/돌하르방.jpg';
import { useParams } from 'react-router-dom';
import { workationService } from '../../api/workation';
import useUserStore from '../../Store/useStore';
// import { workationService } from '../../api/workation';

const WorkationDetail = () => {
  const {user} = useUserStore();
  console.log(user)
  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

  //날짜 범위 선택[시작일, 종료일]
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  console.log(startDate, endDate);
  //날짜 초기화
  const resetDates = () => setDateRange([null, null]);

  //워케이션 정보 가져오기
  const { no } = useParams();
console.log(no)
  useEffect(() => {
    
    const workationInfo = async () => {
      try {
        console.log(no)
        const data = await workationService.workationInfo(no);
        console.log('워케이션 정보: ', data);
      } catch (error) {
        console.error('워케이션 리스트 불러오기 실패:', error.message);
      }
    };
     workationInfo(); // ✅ 함수 호출
}, [no]); // 
 

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
          <TabButton className={activeTab === 'location' ? 'active' : ''} onClick={() => setActiveTab('location')}>
            오시는 길
          </TabButton>
        </Tabs>

        {activeTab === 'intro' && (
          <>
            <ImageSection>
              <img src={image} alt="" />
            </ImageSection>{' '}
            {/* 실제 이미지 URL로 교체 필요 */}
            <Title>제주 애월 스테이</Title>
            <Subtitle>제주도</Subtitle>
            <Description>
              제주 서쪽 애월 해안가에 위치한 조용한 워케이션 공간입니다.
              <br />
              바다를 보며 영감을 얻고 싶은 분들께 추천합니다.
            </Description>
            <Subtitle>주요 특징</Subtitle>
            <FeaturesSection>
              <FeatureItem>오션뷰 개인 작업 공간</FeatureItem>
              <FeatureItem>고속 Wi-Fi</FeatureItem>
              <FeatureItem>공용 라운지 및 주방</FeatureItem>
              <FeatureItem>주변 산책로 및 카페 다수</FeatureItem>
            </FeaturesSection>
          </>
        )}
        {/* 시설안내 탭 */}
        {activeTab === 'facilities' && (
          <>
            <ImageSection /> {/* 실제 이미지 URL로 교체 필요 */}
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
            <Title>유의 사항</Title>
            <PrecautionContent></PrecautionContent>
          </>
        )}

        {/* 위치 정보 탭 */}
        {activeTab === 'location' && (
          <>
            <Title>오시는 길</Title>
            <MapContainerStyled>
              {' '}
              {/* 지도 컨테이너 */}
              <MapContainer
                center={MAP_CENTER} // 지도의 초기 중심점
                zoom={MAP_ZOOM} // 초기 확대 레벨
                scrollWheelZoom={true} // 마우스 휠로 확대/축소 가능
                style={{ height: '100%', width: '100%' }} // 부모 컨테이너(MapContainerStyled) 크기 사용
              >
                {/* 맵 타일 레이어 (배경 지도) */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 마커 추가 */}
                <Marker position={MAP_CENTER}>
                  {' '}
                  {/* 워케이션 장소 마커 */}
                  <Popup>
                    제주 애월 스테이 <br /> (워케이션 장소)
                  </Popup>
                </Marker>

                {/* 필요하다면 다른 마커 추가 가능 */}
                {/* <Marker position={[33.465, 126.590]}>
                  <Popup>
                    근처 카페
                  </Popup>
                </Marker> */}
              </MapContainer>
            </MapContainerStyled>

            {/* 추가적인 위치 정보 (주소, 교통편 등) */}
            <Description style={{ marginTop: '20px' }}>
              <p>주소: 제주특별자치도 제주시 애월읍 애월로 1234</p>
              <p>대중교통: 애월항에서 도보 5분</p>
              <p>주차: 건물 내 주차장 이용 가능 (무료)</p>
            </Description>
          </>
        )}

        {/* 다른 탭 콘텐츠는 activeTab 값에 따라 조건부 렌더링 */}
        {/* <ContentForFacilities /> */}
        {/* <ContentForPrecautions /> */}
        {/* <ContentForLocation /> */}
      </MainContent>
      <DateContent>
        <DateMenu>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            inline
            calendarContainer={({ children }) => (
              <CalendarWrapper>
                {children}
                <ButtonWrapper>
                  <ControlButton onClick={resetDates}>초기화</ControlButton>
                  <ControlButton>날짜 적용</ControlButton>
                </ButtonWrapper>
              </CalendarWrapper>
            )}
          />
        </DateMenu>
        <FormContent>
          <FormRow>
            <Label>일정</Label>
            <DateRangeWrapper>
              <Input
                type="text"
                placeholder="시작일"
                readOnly
                value={startDate ? startDate.toLocaleDateString() : ''}
              />
              <Tilde>~</Tilde>
              <Input type="text" placeholder="종료일" readOnly value={endDate ? endDate.toLocaleDateString() : ''} />
            </DateRangeWrapper>
          </FormRow>

          <FormRow>
            <Label>장소</Label>
            <Input type="text" placeholder="장소를 입력하세요" />
          </FormRow>

          <FormRow>
            <Label>최대 인원</Label>
            <Input type="text" placeholder="최대인원" />
          </FormRow>

          {/* For textarea, align label to top, and ensure it doesn't push button out */}
          <FormRow style={{ alignItems: 'flex-start', flexGrow: 1, marginBottom: '0' }}>
            <Label>사유</Label>
            <TextArea placeholder="사유를 입력하세요" />
          </FormRow>

          <SubmitButton type="sumbit">워케이션 신청</SubmitButton>
        </FormContent>
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
  width: 80%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  /* height: 100%; */
  min-height: 80vh;

  background: white;
  /* margin: 60px 0 60px 90px; 중앙 정렬 및 상하 마진 */
  padding: 30px 30px 0 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const DateContent = styled.div`
  position: relative;
  width: 20%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/

  height: 92%;

  margin: 0 0 0 30px;

  border-radius: 10px;
  max-height: 80vh;
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
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
  width: 100%;
  min-height: 300px;
  img {
    width: 500px;
    height: 100%;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
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
  width: 60%;
  height: 50%;

  margin: 0 auto;
  display: flex;
  flex-direction: row;

  ${media.md`
    width:100%;
  `}

  ${media['2xl']`
    width: 60%;
  `}
`;

const FacilityLeftContent = styled.div`
  width: 50%;
  height: 100%;

  ${media.md`
    width:30%;
  `}
  @media (max-width: 1800px) {
    width: 50%;
  }
`;

const FacilityRightContent = styled.div`
  width: 50%;
  height: 100%;
  ${media.md`
    width:70%;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  @media (max-width: 1800px) {
    width: 50%;
  }
`;
const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* 각 정보 블록 간 간격 */
  margin-top: 15px;
  font-size: 1rem;
  color: #333;
  ${media.md`
  margin-bottom: 0;
  margin-top: 0;
    `}
  ${media.xl`
  font-size: ${({ theme }) => theme.fontSizes.base};
  gap: 10px;
  margin-top: 0;
  margin-bottom: 15px; /* 각 정보 블록 간 간격 */
  margin-top: 15px;
    `}
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
  ${media.md`
      font-size: ${({ theme }) => theme.fontSizes.xs};
      gap: 10px;
    `}

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
  ${media.xl`
      font-size: ${({ theme }) => theme.fontSizes.base};
      gap: 10px;
      margin-top: 0;
      
      
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
  height: 80%;
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

//날짜 선택 영역
const DateMenu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding-bottom: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 100%;
  min-height: 320px;
  margin-bottom: 9%;
  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 1.75vw;
  }
  // react-datepicker의 주요 요소들에 vw 단위 적용
  .react-datepicker {
    // 기본 폰트 크기 설정. 예를 들어, 100vw가 1000px일 때 16px이 되도록.
    // 1.6vw는 뷰포트 너비 1000px 기준 16px, 500px 기준 8px
    font-size: 1.6vw; // 뷰포트 너비에 비례하여 폰트 크기 조절

    // 최소 폰트 크기 설정 (너무 작아지지 않도록)
    /* min-font-size: 12px; // 이 속성은 표준 CSS가 아니므로, 미디어 쿼리나 clamp() 사용을 권장 */

    // 다른 내부 요소들도 vw로 조절 가능
    .react-datepicker__header,
    .react-datepicker__day,
    .react-datepicker__current-month {
      width: 1vw;
      font-size: 1px; // 상위 .react-datepicker의 font-size를 상속받거나 개별 설정
      // 직접 설정하거나, 상위의 min-font-size를 따르게 할 수 있습니다.
    }

    .react-datepicker__day-name {
      width: 1.5vw;
    }

    // 달력의 요일이나 날짜 셀의 padding 등을 vw나 %로 조절
    .react-datepicker__day,
    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      width: 100%;
      padding: 0.8vw; // 요일/날짜 셀의 패딩도 vw로 조절
    }

    // Month picker, year picker 등도 조절 가능
    .react-datepicker__month,
    .react-datepicker__year {
      font-size: 1.6vw;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  // gap을 vw로 조절
  gap: 1vw; // 뷰포트 너비에 비례하여 버튼 간격 조절
  margin: 0.5vw; // 뷰포트 너비에 비례하여 상단 마진 조절
`;

const ControlButton = styled.button`
  background-color: #3b82f6;
  color: white;
  // padding을 vw로 조절
  padding: 0.6vw 1.2vw;
  border: none;
  border-radius: 1.2vw; // border-radius도 vw로 조절하여 비율 유지
  font-size: 0.9vw; // 폰트 크기를 vw로 조절
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  height: 100%;

  &:hover {
    background-color: #2563eb;
  }
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
  padding: 15px; /* Added padding to give some space from the edges */
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
  width: 50px; /* Adjust label width as needed for fixed container */
  flex-shrink: 0; /* Prevent label from shrinking */
`;

// Styled input fields
const Input = styled.input`
  flex-grow: 1; /* Allow input to take remaining space */
  padding: 8px 12px; /* Slightly smaller padding */
  border: none;
  border-radius: 8px;
  font-size: 15px; /* Slightly smaller font size */
  outline: none;
  background-color: #dbebff; /* Light blue background for inputs */
  width: 100%;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
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
  background-color: #dbebff; /* Light blue background for textarea */

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

const DateRangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;

const Tilde = styled.span`
  margin: 0 8px; /* Slightly reduced margin for tilde */
  font-size: 16px;
  color: #555;
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

export default WorkationDetail;
