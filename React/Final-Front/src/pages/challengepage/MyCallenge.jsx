import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Pagination, PageButton, MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import runningWoman from '../../assets/challengeImg.jpg';
import { challengeService } from '../../api/challengeService';
import useUserStore from '../../Store/useStore';

const MyCallenge = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [ongoingChallenge, setOngoingChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);

  useEffect(() => {
    const fetchMyChallenges = async () => {
      if (!user?.userId) return;
      try {
        const response = await challengeService.getMyChallenges(user.userId);
        setOngoingChallenge(response.ongoingChallenge);
        setCompletedChallenges(response.completedChallenges);
        setUserTotalPoints(response.userTotalPoints);
      } catch (error) {
        console.error('나의 챌린지 목록을 불러오는데 실패했습니다.', error);
      }
    };
    fetchMyChallenges();
  }, [user]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} MY 챌린지
      </PageTitle>
      {ongoingChallenge ? (
        <ChallengeSummarySection>
          <SummaryTextContent>
            <Participate>참여중인 챌린지</Participate>
            <PeriodText>
              {ongoingChallenge.challengeStartDate} ~ {ongoingChallenge.challengeEndDate}
            </PeriodText>
            <ChallengeTitle>{ongoingChallenge.challengeTitle}</ChallengeTitle>
            <ProgressBarWrapper>
              <ProgressBarBackground>
                <ProgressBarFill percentage={ongoingChallenge.achievement} />
              </ProgressBarBackground>
              <ProgressText>
                {ongoingChallenge.currentProgressDays}/{ongoingChallenge.totalChallengeDays}일 달성{' '}
                {ongoingChallenge.achievement}%
              </ProgressText>
            </ProgressBarWrapper>
          </SummaryTextContent>
          <SummaryImage src={ongoingChallenge.challengeImageUrl || runningWoman} alt={ongoingChallenge.challengeTitle} />
        </ChallengeSummarySection>
      ) : (
        <NoChallengeMessage>참여중인 챌린지가 없습니다.</NoChallengeMessage>
      )}

      <ChallengeSummary>
        <SummaryCard>나의 챌린지 완료 횟수: {completedChallenges.filter(c => new Date(c.challengeEndDate) < new Date()).length}회</SummaryCard>
        <SummaryCard>누적 획득 포인트: {userTotalPoints}p</SummaryCard>
      </ChallengeSummary>

      <CompletedChallengesSection>
        <SectionHeader>
          <SectionTitle>도전한 챌린지</SectionTitle>
          <NavigationButtons>
            <NavButton>
              <FaAngleLeft />
            </NavButton>
            <NavButton>
              <FaAngleRight />
            </NavButton>
          </NavigationButtons>
        </SectionHeader>
        <ChallengeCardGrid>
          {completedChallenges.map((challenge) => (
            <ChallengeCard key={challenge.challengeNo} onClick={() => navigate(`/mychallenge/complete/${challenge.challengeNo}`)}>
              <CardImageArea>
                <CardImage src={challenge.challengeImageUrl || runningWoman} alt={challenge.challengeTitle} />
              </CardImageArea>
              <CardContent>
                <CardTitle>챌린지: {challenge.challengeTitle}</CardTitle>
                <CardPeriod>
                  기간 :{challenge.challengeStartDate} ~ {challenge.challengeEndDate}
                </CardPeriod>
                <CardCompletion>포인트 : {challenge.challengePoint}P</CardCompletion>
                <ProgressBarContainer>
                  <MiniProgressBarFill percentage={challenge.userAchievementRate} />
                </ProgressBarContainer>
                <CardAchievement>달성률 :{challenge.userAchievementRate}%</CardAchievement>
              </CardContent>
            </ChallengeCard>
          ))}
        </ChallengeCardGrid>
      </CompletedChallengesSection>

      <GoBackButtonContainer>
        <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>
      </GoBackButtonContainer>
    </MainContent>
  );
};

export default MyCallenge;

// Styled Components... (이전과 동일)
const NoChallengeMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #888;
`;
const ChallengeSummarySection = styled.div`
  background-color: #e6f2ff; /* 연한 파란색 배경 */
  border-radius: 15px;
  padding: 10px 20px 10px 40px; /* 내부 여백 */
  margin: 0 35px 10px 35px; /* MainContent 내부 여백 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* + 챌린지 참여 버튼 위치 조정을 위해 */
  overflow: hidden; /* 이미지 오버플로우 방지 */

  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 30px;
  }
`;

const SummaryTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 요소 간 간격 */
  flex-grow: 1; /* 남은 공간 차지 */
  z-index: 1; /* 이미지 위에 텍스트가 오도록 */
`;

const Participate = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #5d90ff;
  margin: 0;
`;

const PeriodText = styled.p`
  font-size: 16px;
  color: #6c757d;
  font-weight: 600;
  margin: 0;
`;

const ChallengeTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const ProgressBarWrapper = styled.div`
  width: 300px; /* 진행바 너비 고정 */
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 8px;
  background-color: #c9e2ff; /* 진행바 배경색 */
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.percentage || 0}%;
  background-color: #4d8eff; /* 진행바 채우는 색 */
  border-radius: 4px;
`;

const ProgressText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #555;
  text-align: right;
  margin: 0;
`;

const SummaryImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 25px;
  object-fit: cover;
  flex-shrink: 0; /* 이미지 크기 유연하게 줄어들지 않도록 */
  background-color: #ffe08a; /* 이미지 배경색 (노란 원) */
  padding: 10px; /* 이미지와 원형 배경 사이 여백 */

  @media (max-width: 1200px) {
    width: 150px;
    height: 150px;
  }
`;

// 챌린지 요약 (완료 횟수, 포인트) 섹션
const ChallengeSummary = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin: 20px 30px;
  }
`;

const SummaryCard = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 1.1em;
  color: #333;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-grow: 1; /* 가로 공간을 유연하게 채움 */
  max-width: 300px; /* 너무 넓어지지 않도록 제한 */

  @media (max-width: 768px) {
    width: 80%;
    max-width: none;
  }
`;

// 도전한 챌린지 목록 섹션
const CompletedChallengesSection = styled.div`
  padding: 0 10px;
  margin: 0 30px;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px 30px;
    margin: 0 30px 20px 30px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h4`
  font-size: 1.5em;
  color: #333;
  font-weight: bold;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #4d8eff;
  }
`;

const ChallengeCardGrid = styled.div`
  width: 100%;
  padding: 5px 50px;
  margin: 5px 0;
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

const MiniProgressBarFill = styled.div`
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

// 뒤로가기 버튼
const GoBackButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
`;

const GoBackButton = styled.button`
  height: 50px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
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