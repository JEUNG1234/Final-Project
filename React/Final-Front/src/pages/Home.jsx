import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import mainImage1 from '../assets/메인페이지사진1.jpg'; // 메인페이지사진1.png
import mainImage2 from '../assets/메인페이지사진2.jpg'; // 메인페이지사진2.jpg
import mainImage3 from '../assets/메인페이지사진3.png'; // 메인페이지사진3.jpg
import mainImage4 from '../assets/메인페이지사진4.jpg'; // 메인페이지사진4.jpg

const Home = () => {
  const location = useLocation();

  // 슬라이드쇼에 사용할 이미지 목록
  const images = [mainImage1, mainImage2, mainImage3, mainImage4];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        const headerHeight = 80; // 실제 헤더 높이에 맞게 조절
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [location.hash]);

  // 슬라이드쇼 자동 전환 로직
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5초마다 이미지 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, [images.length]);

  return (
    <PageWrapper>
      <MainHeader />
      <MainContent>
        {/* currentImageIndex에 따라 배경 이미지 변경 */}
        <TopImageSection bgImage={images[currentImageIndex]}>
          <ImageOverlay />
          <SectionTitle>
            직원의 건강과 행복, <br />
            더 나은 기업 문화를 위한 선택! <br />
            스마트한 사내 복지 ERP 시스템 | SOWM
          </SectionTitle>
        </TopImageSection>

        <ContentContainer id="system-introduction">
          <SubSectionTitle>저희 시스템을 소개합니다.</SubSectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <h3>클라우드 기반 맞춤형 건강 관리</h3>
              <p>
                구글 폼을 통해 주간 건강 및 업무 피드백을 자동으로 전송하고, 직원의 스트레스 지수, 수면 시간, 운동량 등
                건강 데이터를 손쉽게 입력 및 관리할 수 있습니다. AI 기반의 맞춤형 건강 가이드와 과로 방지 알림으로
                직원의 건강을 세심하게 케어합니다.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>복지 포인트 & 유연 근무 시스템</h3>
              <p>
                건강 설문 정기 응답 및 운동 목표 달성 시 복지 포인트를 지급하여 워케이션 우선 신청권, 건강 용품 교환 등
                다양한 혜택을 제공합니다. 워케이션 장소 추천 및 건강 관리 팁 제공으로 직원의 워라밸과 업무 효율성을
                동시에 향상시킵니다.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>개인/팀/전체 건강 통계 대시보드</h3>
              <p>
                직원들이 입력한 건강 데이터를 바탕으로 개인, 팀, 전체 조직의 건강 상태를 한눈에 볼 수 있는 통계 시각화
                대시보드를 제공합니다. 이를 통해 기업은 직원의 건강 트렌드를 파악하고 필요한 복지 정책을 수립할 수
                있습니다.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>참여 유도 & 건강 챌린지 기능</h3>
              <p>
                사내 건강 커뮤니티 게시판을 통해 운동 인증샷, 식단 공유, 스트레스 해소법 등을 자유롭게 공유할 수
                있습니다. "1일 8000보 걷기" 등 투표 기반의 건강 챌린지 기능으로 직원들의 자발적인 참여를 유도하고, 복지
                포인트 등의 보상으로 동기 부여를 높입니다.
              </p>
            </FeatureCard>
          </FeatureGrid>
        </ContentContainer>

        <FAQSection>
          <SubSectionTitle>자주 묻는 질문 | FAQ</SubSectionTitle>
          <FAQList>
            <FAQItem>
              <Question>SOWM 시스템은 어떤 회사에 적합한가요?</Question>
              <Answer>
                직원의 건강과 복지에 관심이 많고, 데이터 기반으로 효율적인 사내 복지 시스템을 구축하고자 하는 모든
                규모의 기업에 적합합니다.
              </Answer>
            </FAQItem>
            <FAQItem>
              <Question>개인 건강 데이터는 어떻게 관리되나요?</Question>
              <Answer>
                모든 개인 건강 데이터는 엄격한 보안을 통해 암호화되어 관리됩니다. 기업 관리자는 직원의 개별 건강
                데이터를 직접 열람할 수 없으며, 오직 익명화된 통계 데이터만을 확인할 수 있습니다.
              </Answer>
            </FAQItem>
            <FAQItem>
              <Question>복지 포인트는 어떻게 활용할 수 있나요?</Question>
              <Answer>
                복지 포인트는 워케이션 우선 신청권, 제휴된 건강 용품 교환, 사내 이벤트 참여 등 다양한 형태로 활용
                가능합니다. 자세한 혜택은 기업 설정에 따라 달라질 수 있습니다.
              </Answer>
            </FAQItem>
            <FAQItem>
              <Question>시스템 도입 절차가 궁금합니다.</Question>
              <Answer>
                데모 신청 후 담당자와 상담을 통해 기업 맞춤형 설정이 진행됩니다. 이후 직원 온보딩을 위한 안내와 시스템
                사용 교육이 제공되며, 바로 시스템을 활용하실 수 있습니다.
              </Answer>
            </FAQItem>
            <FAQItem>
              <Question>모바일에서도 사용 가능한가요?</Question>
              <Answer>
                네, SOWM 시스템은 반응형 웹으로 개발되어 PC, 태블릿, 모바일 등 모든 기기에서 최적화된 환경으로 이용하실
                수 있습니다.
              </Answer>
            </FAQItem>
          </FAQList>
        </FAQSection>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

// 이미지 전환 효과를 위한 keyframes 정의
const fadeIn = keyframes`
  from { opacity: 0.7; }
  to { opacity: 1; }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding-top: 80px; /* Header의 높이만큼 패딩 (Header 높이에 맞게 조절) */
  box-sizing: border-box;
  background: #f9f9f9;
`;

const TopImageSection = styled.div`
  width: 100%;
  height: 700px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: background-image 1s ease-in-out; /* 이미지 전환 시 부드러운 효과 */
  animation: ${fadeIn} 1s ease-in-out; /* 페이드인 애니메이션 적용 */

  @media (max-width: 768px) {
    height: 40vh;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const SectionTitle = styled.h2`
  font-size: 35px;
  color: #fff;
  text-align: center;
  font-weight: bold;
  position: relative;
  z-index: 10;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
  padding: 0 20px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 48px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const SubSectionTitle = styled.h2`
  font-size: 35px;
  margin-bottom: 32px;
  color: #333;
  text-align: center;
  font-weight: bold;
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  width: 100%;
`;

const FeatureCard = styled.div`
  flex: 1 1 45%;
  max-width: 1000px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 40px;
  text-align: left;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  }

  h3 {
    font-size: 26px;
    color: #007bff;
    margin-bottom: 16px;
    font-weight: 600;
  }

  p {
    font-size: 18px;
    color: #555;
    line-height: 1.7;
  }

  @media (max-width: 900px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const FAQSection = styled(ContentContainer)`
  padding-top: 64px;
  padding-bottom: 64px;
  background-color: #f9f9f9;
  margin-top: 32px;
  border-radius: 0;
  box-shadow: none;
`;

const FAQList = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`;

const FAQItem = styled.div`
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 24px 0;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #eee;

  &:first-child {
    border-top: 1px solid #eee;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Question = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Answer = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

export default Home;
