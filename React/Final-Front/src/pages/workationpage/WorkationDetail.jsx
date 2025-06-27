import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/MediaQueries';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//달력기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// GoogleMapReact 대신 Leaflet 관련 컴포넌트 임포트 // Leaflet빼고 네이버Maps로 변경
import NaverMapStatic from '../../components/NvaerMapStatic';
// import DOMPurify from 'dompurify';

import { FaSquare, FaRulerCombined, FaHourglassHalf, FaUsers } from 'react-icons/fa';

import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { workationService } from '../../api/workation';
import useUserStore from '../../Store/useStore';
import { useForm } from 'react-hook-form';
// import { workationService } from '../../api/workation';

const WorkationDetail = () => {
  const { user } = useUserStore();

  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

  const [workationInfo, setWorkationInfo] = useState([]);
  //날짜 범위 선택[시작일, 종료일]
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [content, setContent] = useState('');

  //이미지 필터 저장용
  const [placeImage, setPlaceImage] = useState('');
  const [facilityImage, setFacilityImage] = useState('');
  const [precautionImage, setPrecautionImage] = useState('');

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
        console.error('워케이션 정보 불러오기 실패:', error.message);
      }
    };
    workationInfo();
  }, []);

  useEffect(() => {
    if (workationInfo.workationImages && workationInfo.workationImages.length > 0) {
      // PLACE
      const place = workationInfo.workationImages.find((img) => img.tab === 'PLACE');
      setPlaceImage(place ? place.changedName : '');

      // FACILITY
      const facility = workationInfo.workationImages.find((img) => img.tab === 'FACILITY');
      setFacilityImage(facility ? facility.changedName : '');

      // PRECAUTIONS
      const precaution = workationInfo.workationImages.find((img) => img.tab === 'PRECAUTIONS');
      setPrecautionImage(precaution ? precaution.changedName : '');
    }
  }, [workationInfo]);

  //유효성 검사
  const schema = yup.object().shape({
   
    peopleMax: yup.number().typeError('최대 인원을 숫자로 입력해주세요').required('최대 인원을 설정해주세요'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: true,
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const [startDate, endDate] = data.dateRange;
    try {
      const submitBody = {
        peopleMax: data.peopleMax,
        startDate,
        endDate,
        content,
      };
      const requestBody = {
        ...submitBody,
        userId: user.userId,
        location: workationInfo.address,
        workationNo: no,
      };

      console.log(requestBody);

      const response = await workationService.workationSubmit(requestBody);
      navigate('/workationList');
          alert('워케이션 신청되었습니다.');
      console.log(response);
    } catch (error) {
      console.error('워케이션 신청 에러:', error);
      alert('워케이션 신청 중 에러가 발생했습니다.');
    }
    console.log({ data });
    
 
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
              <img src={`https://d1qzqzab49ueo8.cloudfront.net/${placeImage}`} />
            </ImageSection>
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
            <ImageSection>
              <img src={`https://d1qzqzab49ueo8.cloudfront.net/${facilityImage}`} />
            </ImageSection>{' '}
            {/* 실제 이미지 URL로 교체 필요 */}
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
            <ImageSection>
              <img src={`https://d1qzqzab49ueo8.cloudfront.net/${precautionImage}`} />
            </ImageSection>{' '}
            {/* 실제 이미지 URL로 교체 필요 */}
            <RefundPolicy>{workationInfo.precautions}</RefundPolicy>
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
              <RefundPolicy>대중교통: {workationInfo.busInfo}</RefundPolicy>
              <RefundPolicy>주차: {workationInfo.parkingInfo}</RefundPolicy>
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
            onChange={(update) => {
              setDateRange(update);
              setValue('dateRange', update); // 폼에 반영!
            }}
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
          {errors.dateRange && <ErrorMessage>{errors.dateRange.message}</ErrorMessage>}
        </DateMenu>
        <FormContent onSubmit={handleSubmit(onSubmit)}>
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
            <Input type="text" value={workationInfo.address} />
          </FormRow>
          <FormRow>
            <Label>최대 인원</Label>
            <Input type="number" placeholder="최대인원" {...register('peopleMax', { valueAsNumber: true })} />
            {errors.peopleMax && <ErrorMessage>{errors.peopleMax.message}</ErrorMessage>}
          </FormRow>
          <FormRow style={{ alignItems: 'flex-start', flexGrow: 1, marginBottom: '0' }}>
            <Label>사유</Label>
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="사유를 입력하세요" />
          </FormRow>
          <SubmitButton type="submit">워케이션 신청</SubmitButton>
        </FormContent>
      </DateContent>
    </FullWapper>
  );
};

const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px;
  min-height: 80vh;
  margin: 30px auto;
`;

const MainContent = styled.div`
  width: 80%;
  max-width: 1400px;
  min-height: 80vh;
  background: white;
  padding: 30px 30px 0 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const DateContent = styled.div`
  position: relative;
  width: 20%;
  max-width: 1400px;
  height: 92%;
  margin: 0 0 0 30px;
  border-radius: 10px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
`;

const Tabs = styled.div`
  display: flex;
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
    color: #007bff;
  }
  &.active {
    color: #007bff;
    border-bottom: 2px solid #007bff;
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

  margin: 0 auto;
`;

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

  .react-datepicker {
    font-size: 1.6vw;
    .react-datepicker__header,
    .react-datepicker__day,
    .react-datepicker__current-month {
      width: 1vw;
      font-size: 1px;
    }

    .react-datepicker__day-name {
      width: 1.5vw;
    }

    .react-datepicker__day,
    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      width: 100%;
      padding: 0.8vw;
    }

    .react-datepicker__month,
    .react-datepicker__year {
      font-size: 1.6vw;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;

  gap: 1vw;
  margin: 0.5vw;
`;

const ControlButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.6vw 1.2vw;
  border: none;
  border-radius: 1.2vw;
  font-size: 0.9vw;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  height: 100%;

  &:hover {
    background-color: #2563eb;
  }
`;

//신청 영역
const FormContent = styled.form`
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  padding: 15px;
  justify-content: space-between;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  width: 50px;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  background-color: #dbebff;
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
  min-height: 80px;
  resize: vertical;
  outline: none;
  background-color: #dbebff;

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
  margin: 0 8px;
  font-size: 16px;
  color: #555;
`;

const RefundPolicy = styled.div`
  white-space: pre-line;
  font-family: inherit;
  font-size: 16px;
  color: #444;
`;

const SubmitButton = styled.button`
  background-color: #61a5fa;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
  align-self: center;
  width: 160px;
  flex-shrink: 0;

  &:hover {
    background-color: #4a8df1;
  }

  &:active {
    background-color: #3b7ae0;
  }
`;

//에러메시지
const ErrorMessage = styled.p`
  color: red;
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;
export default WorkationDetail;
