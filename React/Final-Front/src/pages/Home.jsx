import React from 'react'; // useState, useEffect는 이미지 슬라이더 제거로 인해 필요 없어졌습니다.
import styled from 'styled-components';

const mainPromotionalImage = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80';


const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f9f9f9; /* 배경색 */
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const TopImageSection = styled.div`
  width: 100%;
  height: 700px; /* 이미지 섹션 높이 조정 (원하는 만큼 조절) */
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${props => props.bgImage});
  background-size: cover; /* 이미지가 섹션을 꽉 채우도록 */
  background-position: center; /* 이미지가 중앙에 오도록 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* 그림자 추가 */

  @media (max-width: 768px) {
    height: 40vh; /* 작은 화면에서 높이 조정 */
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* 약간 어두운 오버레이 */
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem; /* 제목 크기 조정 */
  color: #fff; /* 흰색으로 변경 */
  text-align: center;
  font-weight: bold;
  position: relative; /* 오버레이 위로 올라오도록 */
  z-index: 10;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.8); /* 그림자 진하게 */
  padding: 0 20px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 2rem; /* 작은 화면에서 폰트 크기 조정 */
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 3rem 1.5rem; /* 상단 패딩 추가 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubSectionTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
  font-weight: bold;
`;

const FeatureGrid = styled.div`
  display: flex; /* Flexbox로 변경 */
  flex-wrap: wrap; /* 요소가 넘치면 다음 줄로 */
  justify-content: center;
  gap: 2rem; /* 카드 사이 간격 */
  width: 100%;
`;

const FeatureCard = styled.div`
  flex: 1 1 45%; /* 두 개의 카드가 대략 절반씩 차지하도록 (반응형) */
  max-width: 1000px; /* 카드 최대 너비 */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 2.5rem; /* 패딩 증가 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  }

  h3 {
    font-size: 1.6rem; /* 제목 크기 증가 */
    color: #007bff; /* 포인트 색상 변경 (예: 블루 계열) */
    margin-bottom: 1rem;
    font-weight: 600; /* 폰트 굵기 조정 */
  }

  p {
    font-size: 1.1rem; /* 텍스트 크기 증가 */
    color: #555;
    line-height: 1.7; /* 줄 간격 조정 */
  }

  @media (max-width: 900px) {
    flex: 1 1 100%; /* 화면이 작아지면 한 줄에 하나씩 */
    max-width: 100%;
  }
`;

const Home = () => {
  return (
    <PageContainer>
      <TopImageSection bgImage={mainPromotionalImage}>
        <ImageOverlay />
        <SectionTitle>
          직원의 건강과 행복, <br />
          더 나은 기업 문화를 위한 선택! <br />
          스마트한 사내 복지 ERP 시스템 | SOWM
        </SectionTitle>
      </TopImageSection>

      <ContentContainer>
        <SubSectionTitle>저희 시스템을 소개합니다.</SubSectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <h3>클라우드 기반 맞춤형 건강 관리</h3>
            <p>구글 폼을 통해 주간 건강 및 업무 피드백을 자동으로 전송하고, 직원의 스트레스 지수, 수면 시간, 운동량 등 건강 데이터를 손쉽게 입력 및 관리할 수 있습니다. AI 기반의 맞춤형 건강 가이드와 과로 방지 알림으로 직원의 건강을 세심하게 케어합니다.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>복지 포인트 & 유연 근무 시스템</h3>
            <p>건강 설문 정기 응답 및 운동 목표 달성 시 복지 포인트를 지급하여 워케이션 우선 신청권, 건강 용품 교환 등 다양한 혜택을 제공합니다. 워케이션 장소 추천 및 건강 관리 팁 제공으로 직원의 워라밸과 업무 효율성을 동시에 향상시킵니다.</p>
          </FeatureCard>
            <FeatureCard>
            <h3>개인/팀/전체 건강 통계 대시보드</h3>
            <p>직원들이 입력한 건강 데이터를 바탕으로 개인, 팀, 전체 조직의 건강 상태를 한눈에 볼 수 있는 통계 시각화 대시보드를 제공합니다. 이를 통해 기업은 직원의 건강 트렌드를 파악하고 필요한 복지 정책을 수립할 수 있습니다.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>참여 유도 & 건강 챌린지 기능</h3>
            <p>사내 건강 커뮤니티 게시판을 통해 운동 인증샷, 식단 공유, 스트레스 해소법 등을 자유롭게 공유할 수 있습니다. "1일 8000보 걷기" 등 투표 기반의 건강 챌린지 기능으로 직원들의 자발적인 참여를 유도하고, 복지 포인트 등의 보상으로 동기 부여를 높입니다.</p>
          </FeatureCard>
    
        </FeatureGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default Home;