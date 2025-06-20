import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/MediaQueries';

//달력기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// GoogleMapReact 대신 Leaflet 관련 컴포넌트 임포트 // Leaflet빼고 네이버Maps로 변경
import NaverMapStatic from '../../components/NvaerMapStatic';
// import DOMPurify from 'dompurify';

import { FaSquare, FaRulerCombined, FaHourglassHalf, FaUsers } from 'react-icons/fa';

import image from '../../assets/돌하르방.jpg';
import { Navigate, useParams } from 'react-router-dom';
import { workationService } from '../../api/workation';
import useUserStore from '../../Store/useStore';
// import { workationService } from '../../api/workation';

const WorkationDetail = () => {
  const { user } = useUserStore();
  console.log(user);
  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

  //날짜 범위 선택[시작일, 종료일]
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [peopleMax , setPeopleMax] = useState('');
  const [content, setContent] = useState('');


  //날짜 초기화
  const resetDates = () => setDateRange([null, null]);

  //워케이션 정보 가져오기
  const { no } = useParams();

  useEffect(() => {
    const workationInfo = async () => {
      try {
        const data = await workationService.workationInfo(no);
        console.log('워케이션 정보: ', data);
        setWorkationInfo(data);
      } catch (error) {
        console.error('워케이션 리스트 불러오기 실패:', error.message);
      }
    };
    workationInfo();
  }, []);

  const [workationInfo, setWorkationInfo] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitBody = {
        peopleMax,
        startDate,
        endDate,
        content,
      }
      const requestBody = {
        ...submitBody,
        userId: user.userId,
        location: workationInfo.address,
        workationNo: no
      }

      console.log(requestBody);

      const response = await workationService.workationSubmit(requestBody);
      
      console.log(response);

    } catch(error) {
      console.error('워케이션 신청 에러:', error);
      alert('워케이션 신청 중 에러가 발생했습니다.');
    }
    console.log({e});
    alert('워케이션 신청되었습니다.');
    Navigate('/workationList');
  };



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
            <Title>{workationInfo.workationTitle}</Title>
            <Subtitle>{workationInfo.address}</Subtitle>
            <Description>{workationInfo.placeInfo}</Description>
            <Subtitle>주요 특징</Subtitle>
            <FeaturesSection>
              <RefundPolicy>{workationInfo.feature}</RefundPolicy>
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
                  <h3>{workationInfo.facilityInfo}</h3>
                </FaciltyLeftFirstInfo>
                <FaciltyLeftSecondInfo>
                  <h2>영업시간 | 휴무일</h2>
                  <h3>{workationInfo.openHours}</h3>
                </FaciltyLeftSecondInfo>
              </FacilityLeftContent>
              <FacilityRightContent>
                <InfoBlock>
                  <InfoIcon as={FaSquare} /> {/* 공간유형 아이콘 (임시) */}
                  <InfoText>공간유형</InfoText>
                  <DetailText>{workationInfo.spaceType}</DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaRulerCombined} /> {/* 공간면적 아이콘 (임시) */}
                  <InfoText>공간면적</InfoText>
                  <DetailText>{workationInfo.area}m²</DetailText>
                </InfoBlock>

                <InfoBlock>
                  <InfoIcon as={FaUsers} /> {/* 수용인원 아이콘 (임시) */}
                  <InfoText>수용인원</InfoText>
                  <DetailText>
                    {workationInfo.peopleMin}명 ~ 최대{workationInfo.peopleMax}
                  </DetailText>
                </InfoBlock>
              </FacilityRightContent>
            </FacilityContent>
          </>
        )}

        {activeTab === 'precautions' && (
          <>
            <Title>유의 사항</Title>
            <PrecautionContent>{workationInfo.precautions}</PrecautionContent>
          </>
        )}

        {/* 위치 정보 탭 */}
        {activeTab === 'location' && (
          <>
            <Title>오시는 길</Title>
            <MapContainerStyled>
              <NaverMapStatic
                address={workationInfo.address}
                latitude={workationInfo.latitude}
                longitude={workationInfo.longitude}
              />
            </MapContainerStyled>

            {/* 추가적인 위치 정보 (주소, 교통편 등) */}
            <Description style={{ marginTop: '20px' }}>
              <p>주소: {workationInfo.address}</p>
              <p>대중교통: {workationInfo.busInfo}</p>
              <p>주차: {workationInfo.parkingInfo}</p>
            </Description>
          </>
        )}
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
            <Input type="text" value={workationInfo.address} placeholder="장소를 입력하세요" />
          </FormRow>

          <FormRow>
            <Label>최대 인원</Label>
            <Input type="text" value={peopleMax} onChange={(e) => setPeopleMax(e.target.value)} placeholder="최대인원" />
          </FormRow>

          <FormRow style={{ alignItems: 'flex-start', flexGrow: 1, marginBottom: '0' }}>
            <Label>사유</Label>
            <TextArea value={content} onChange={(e) => setContent(e.target.value)}  placeholder="사유를 입력하세요" />
          </FormRow>

          <SubmitButton onClick={handleSubmit}>워케이션 신청</SubmitButton>
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

  
`;

const FacilityRightContent = styled.div`
  width: 50%;
  height: 100%;
  ${media.md`
    width:50%;
    font-size: ${({ theme }) => theme.fontSizes.sm};
      display: flex;
  flex-direction: column;
  justify-content: center;
  `}
  @media (max-width: 1800px) {
    width: 50%;
      display: flex;
  flex-direction: column;
  justify-content: center;
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
// const MAP_CENTER = [{}}]; // 위도, 경도
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

const RefundPolicy = styled.div`
  white-space: pre-line; /* 엔터(줄바꿈)는 살리고, 연속 공백은 무시 */
  font-family: inherit; /* 폰트는 상속 */
  font-size: 16px;
  color: #444;
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
