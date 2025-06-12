import React from 'react';
import styled from 'styled-components';
import { BsFire } from 'react-icons/bs';
import {
  BottomBar,
  Pagination,
  PageButton,
  MainContent,
  PageHeader,
  PageTitle,
} from '../../styles/common/MainContentLayout';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지
      </PageTitle>

      <MyChallengeAera>
        <MyChallengeButton onClick={() => navigate('/myChallenge')}>내 챌린지</MyChallengeButton>
      </MyChallengeAera>
      <ContentBody>
        {/* challengeData 배열을 map 함수로 순회하여 ChellengeCard 렌더링 */}
        {challengeData.map((challenge) => (
          <ChallengeCard key={challenge.id} onClick={() => navigate(`/challenge/${challenge.id}`)}>
            <CardImageArea>
              <CardImage src={challenge.img} alt={challenge.title} />
            </CardImageArea>
            <CardContent>
              <CardTitle>챌린지: {challenge.title}</CardTitle>
              <CardPeriod>기간 :{challenge.period}</CardPeriod>
              <CardCompletion>완료 :{challenge.completion}</CardCompletion>
              <ProgressBarContainer>
                <ProgressBarFill percentage={challenge.achievement} />
              </ProgressBarContainer>
              <CardAchievement>참여율 :{challenge.achievement}%</CardAchievement>
            </CardContent>
          </ChallengeCard>
        ))}
      </ContentBody>
      <BottomBar>
        <Pagination>
          <PageButton>&lt;</PageButton>
          <PageButton className="active">1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>&gt;</PageButton>
        </Pagination>
      </BottomBar>
    </MainContent>
  );
};

const MyChallengeAera = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0% 5%;
`;

const MyChallengeButton = styled.button`
  height: 50px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px; /* 둥근 버튼 */
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3c75e0;
  }
`;

const ContentBody = styled.div`
  width: 100%;
  padding: 10px 50px;
  margin: 20px 0;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: flex-start;
  gap: 40px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr);
    padding: 10px 20px;
  }
`;

const ChallengeCard = styled.div`
  width: 250px;
  padding-bottom: 5px; /* 기존 10px에서 줄임 */
  border-radius: 15px;
  border: 1px solid #ececec;
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

const CardImageArea = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardImage = styled.img`
  width: 90%;
  height: 85%; /* 기존 120px에서 100px로 줄임 */
  object-fit: contain;
  background-color: #ffffff; /* 빈 공간에 배경색을 주어 더 깔끔하게 보일 수 있습니다 */
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const CardContent = styled.div`
  padding: 8px 12px; /* 기존 10px 15px에서 줄임 */
  display: flex;
  flex-direction: column;
  gap: 3px; /* 기존 5px에서 줄임 */
`;

const CardTitle = styled.p`
  font-size: 14px; /* 기존 14px에서 줄임 */
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CardPeriod = styled.p`
  font-size: 12px; /* 기존 12px에서 줄임 */
  font-weight: 500;
  color: #666;
  margin: 0;
`;

const CardCompletion = styled.p`
  font-size: 12px; /* 기존 12px에서 줄임 */
  font-weight: 500;
  color: #666;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px; /* 기존 8px에서 줄임 */
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
  font-size: 12px; /* 기존 12px에서 줄임 */
  font-weight: 500;
  color: #666;
  margin: 4px 0 0 0; /* 기존 5px 0 0 0에서 줄임 */
  text-align: right;
`;

export default Chellenge;
