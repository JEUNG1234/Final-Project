// src/components/MainContent.jsx
import React from 'react';
import styled from 'styled-components';
// import { Main } from '../../styles/common/MainContentLayout';

// import image from '../../assets/돌하르방.jpg';

const WorkcationDetail = () => {
    const [activeTab, setActiveTab] = React.useState('intro');
  return (
    <FullWapper>
      <MainContent>
            <Tabs>
        <TabButton className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>장소 소개</TabButton>
        <TabButton className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}>시설 안내</TabButton>
        <TabButton className={activeTab === 'precautions' ? 'active' : ''} onClick={() => setActiveTab('precautions')}>유의 사항</TabButton>
        <TabButton className={activeTab === 'location' ? 'active' : ''} onClick={() => setActiveTab('location')}>위치 정보</TabButton>
      </Tabs>

      {activeTab === 'intro' && (
        <>
          <ImageSection /> {/* 실제 이미지 URL로 교체 필요 */}
          <Title>제주 애월 스테이</Title>
          <Subtitle>제주도</Subtitle>
          <Description>
            제주 서쪽 애월 해안가에 위치한 조용한 워케이션 공간입니다.<br />
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

      {/* 다른 탭 콘텐츠는 activeTab 값에 따라 조건부 렌더링 */}
      {/* <ContentForFacilities /> */}
      {/* <ContentForPrecautions /> */}
      {/* <ContentForLocation /> */}
      </MainContent>
      <MainContent1></MainContent1>
    </FullWapper>
  );
};

const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
  margin: 60px auto;
  
  
`;

const MainContent = styled.div`
  width: 80%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh; /* 최소 높이 설정 (스크롤 영역에 맞춰 유동적으로) */
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

const ImageSection = styled.div`
  width: 100%;
  height: 300px; /* 예시 높이 */
  background-image: url('../../assets/돌하르방.jpg'); /* 실제 이미지 URL로 교체 */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #267EFF;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.h3`
  font-size: 22px;
  color: #555;
  margin-bottom: 20px;
  color: #267EFF;
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


export default WorkcationDetail;
