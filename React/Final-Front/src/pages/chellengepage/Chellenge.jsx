import React from 'react';
import styled from 'styled-components';
import { FaClipboardList } from 'react-icons/fa';

// 이미지를 import 합니다. (실제 이미지 경로로 변경해주세요)
// 이 경로는 Chellenge.jsx 파일이 src/pages/chellengepage/ 에 있고
// 이미지가 src/assets/challengeImg.jpg 에 있을 때 올바릅니다.
import runningWoman from '../../assets/challengeImg.jpg';

const challengeData = [
  {
    id: 1,
    title: '하루에 10000보 걷기',
    period: '25.06.05 - 25.07.04',
    completion: 53,
    achievement: 21.7,
    img: runningWoman, // 위에서 임포트한 이미지 변수 사용
  },
  {
    id: 2,
    title: '매일 물 2리터 마시기',
    period: '25.06.10 - 25.07.10',
    completion: 15,
    achievement: 50.0,
    img: runningWoman,
  },
  {
    id: 3,
    title: '주 3회 근력 운동',
    period: '25.06.01 - 25.06.30',
    completion: 8,
    achievement: 70.0,
    img: runningWoman,
  },
  {
    id: 4,
    title: '하루 한 시간 독서',
    period: '25.05.20 - 25.06.20',
    completion: 20,
    achievement: 85.0,
    img: runningWoman,
  },
  {
    id: 5,
    title: '명상 10분',
    period: '25.06.01 - 25.06.15',
    completion: 10,
    achievement: 100.0,
    img: runningWoman,
  },
  {
    id: 6,
    title: '건강 식단 지키기',
    period: '25.06.01 - 25.07.01',
    completion: 2,
    achievement: 6.0,
    img: runningWoman,
  },
  {
    id: 7,
    title: '건강 식단 지키기',
    period: '25.06.01 - 25.07.01',
    completion: 2,
    achievement: 6.0,
    img: runningWoman,
  },
  {
    id: 8,
    title: '건강 식단 지키기',
    period: '25.06.01 - 25.07.01',
    completion: 2,
    achievement: 6.0,
    img: runningWoman,
  },
];

const Chellenge = () => {
  return (
    <Container>
      <MainContent>
        <PageHeader>
          <PageTitle>
            <FaClipboardList />
            챌린지
          </PageTitle>
        </PageHeader>
        <MyChellengeAera>
          <MyChellengeButton>내 챌린지</MyChellengeButton>
        </MyChellengeAera>
        <ContentBody>
          {/* challengeData 배열을 map 함수로 순회하여 ChellengeCard 렌더링 */}
          {challengeData.map((challenge) => (
            <ChellengeCard key={challenge.id}>
              <CardImage src={challenge.img} alt={challenge.title} />
              <CardContent>
                <CardTitle>챌린지: {challenge.title}</CardTitle>
                <CardPeriod>기간 :{challenge.period}</CardPeriod>
                <CardCompletion>완료 :{challenge.completion}</CardCompletion>
                <ProgressBarContainer>
                  <ProgressBarFill percentage={challenge.achievement} />
                </ProgressBarContainer>
                <CardAchievement>달성률 :{challenge.achievement}%</CardAchievement>
              </CardContent>
            </ChellengeCard>
          ))}
        </ContentBody>
        <Pagination>
          <PageButton>&lt;</PageButton>
          <PageButton className="active">1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>&gt;</PageButton>
        </Pagination>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 2%;
  background: #f0f7ff;
`;

const MainContent = styled.div`
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  color: #929393;
  display: flex;
  align-items: center;
  margin: 25px 35px;
  gap: 10px;

  svg {
    color: #4d8eff;
  }
`;

const MyChellengeAera = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MyChellengeButton = styled.button`
  width: 120px;
  margin: 0px 70px;
  background-color: #4d8eff;
  color: white;
  padding: 12px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3c75e0;
  }
`;

const ContentBody = styled.div`
  width: 100%;
  padding: 10px 50px;
  margin: 10px 0;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: flex-start;
  gap: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    padding: 10px 20px;
  }
`;

const ChellengeCard = styled.div`
  width: 250px;
  padding-bottom: 5px; /* 기존 10px에서 줄임 */
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  background-color: #f0f7ff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    background-color: #d8e5ff;
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100px; /* 기존 120px에서 100px로 줄임 */
  object-fit: contain;
  background-color: #ffffff; /* 빈 공간에 배경색을 주어 더 깔끔하게 보일 수 있습니다 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const CardContent = styled.div`
  padding: 8px 12px; /* 기존 10px 15px에서 줄임 */
  display: flex;
  flex-direction: column;
  gap: 3px; /* 기존 5px에서 줄임 */
`;

const CardTitle = styled.p`
  font-size: 13px; /* 기존 14px에서 줄임 */
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CardPeriod = styled.p`
  font-size: 11px; /* 기존 12px에서 줄임 */
  color: #666;
  margin: 0;
`;

const CardCompletion = styled.p`
  font-size: 11px; /* 기존 12px에서 줄임 */
  color: #666;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 7px; /* 기존 8px에서 줄임 */
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 4px; /* 기존 5px에서 줄임 */
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.percentage || 0}%;
  background-color: #4d8eff;
  border-radius: 4px;
`;

const CardAchievement = styled.p`
  font-size: 11px; /* 기존 12px에서 줄임 */
  color: #666;
  margin: 4px 0 0 0; /* 기존 5px 0 0 0에서 줄임 */
  text-align: right;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
  padding: 30px 0;

  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  min-width: 35px;

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    font-weight: bold;
  }

  &:hover:not(.active) {
    background-color: #f0f0f0;
  }
`;
export default Chellenge;
