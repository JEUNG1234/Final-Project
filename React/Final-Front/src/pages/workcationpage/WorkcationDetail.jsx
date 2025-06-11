// src/components/MainContent.jsx
import React from 'react';
import styled from 'styled-components';
import {
  FaSquare,
  FaRulerCombined,
  FaHourglassHalf,
  FaUsers,
  FaChair,
  FaPlug,
  FaHotTub, // FaMirror 대신 FaHotTub 사용
  FaSmokingBan,
  FaWifi,
  FaUtensils,
  FaSyncAlt,
} from 'react-icons/fa';
const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh;
  margin: 60px auto;
  height: 80%;
`;

const MainContent = styled.div`
  width: 80%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  height: 600px;
  min-height: 80vh;
  background: white;
  /* margin: 60px 0 60px 90px; 중앙 정렬 및 상하 마진 */
  padding: 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const MainContent1 = styled.div`
  width: 20%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
  background: white;
  margin: 0 0 0 30px;
  padding: 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
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
  border: none;
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
  height: 250px; /* 예시 높이 */
  background-image: url('your_image_url_here.jpg'); /* 실제 이미지 URL로 교체 */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: 1px solid black;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.h3`
  font-size: 22px;
  color: #555;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 30px;
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.p`
  font-size: 15px;
  color: #444;
  /* 아이콘이 있다면 여기에 아이콘 스타일 추가 */
`;

//시설안내 정보 영역
const FacilityContent = styled.div`
  border: 1px solid black;
  width: 60%;
  height: 50%;

  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const FacilityLeftContent = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid black;
`;

const FacilityRightContent = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid black;
`;
const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* 각 정보 블록 간 간격 */
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

const ConvertButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #555;
  &:hover {
    background: #e0e0e0;
  }
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
    font-size: 2.5rem; /* 아이콘 크기 */
    color: #666;
    margin-bottom: 8px; /* 아이콘과 텍스트 간 간격 */
  }
`;

const FaciltyLeftFirstInfo = styled.div`
  border: 1px solid red;
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
  border: 1px solid red;
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

const WorkcationDetail = () => {
  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

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
            위치 정보
          </TabButton>
        </Tabs>

        {activeTab === 'intro' && (
          <>
            <ImageSection /> {/* 실제 이미지 URL로 교체 필요 */}
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
                  <ConvertButton>
                    <FaSyncAlt style={{ marginRight: '5px' }} />평
                  </ConvertButton>
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

                <IconGrid>
                  <IconItem>
                    <FaChair />
                    의자/테이블
                  </IconItem>
                  <IconItem>
                    <FaPlug />
                    전기
                  </IconItem>
                  <IconItem>
                    <FaHotTub /> {/* FaMirror 대신 FaHotTub 사용 */}
                    전신거울
                  </IconItem>
                  <IconItem>
                    <FaUtensils />
                    음식물 반입가능
                  </IconItem>
                  <IconItem>
                    <FaSmokingBan />
                    금연
                  </IconItem>
                  <IconItem>
                    <FaWifi />
                    인터넷/WIFI
                  </IconItem>
                </IconGrid>
              </FacilityRightContent>
            </FacilityContent>
          </>
        )}

        {/* 다른 탭 콘텐츠는 activeTab 값에 따라 조건부 렌더링 */}
        {/* <ContentForFacilities /> */}
        {/* <ContentForPrecautions /> */}
        {/* <ContentForLocation /> */}
      </MainContent>
      <MainContent1></MainContent1>
    </FullWapper>
  );
};

export default WorkcationDetail;
