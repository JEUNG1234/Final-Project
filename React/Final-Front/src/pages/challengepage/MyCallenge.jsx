import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Pagination, PageButton, MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'; // 좌우 화살표 아이콘 추가

import runningWoman from '../../assets/challengeImg.jpg';

const ongoingChallengeData = {
  1: {
    id: 1,
    breadcrumbs: '하루 10000보 걷기',
    title: '하루 10000보 걷기',
    period: '5월 1일 ~ 5월 31일',
    currentProgressDays: 15,
    totalChallengeDays: 31,
    achievement: 50,
    img: runningWoman,
    boardPosts: [
      { id: 1, type: '공지사항', title: '안녕하세요', author: '홍길동', date: '2025/03/01' },
      { id: 2, type: '챌린지', title: '안녕하세요', author: '김철수', date: '2025/03/01' },
      { id: 3, type: '챌린지', title: '안녕하세요', author: '이영구', date: '2025/02/01' },
      { id: 4, type: '챌린지', title: '안녕하세요', author: '최지원', date: '2025/02/01' },
      { id: 5, type: '챌린지', title: '안녕하세요', author: '박지원', date: '2025/02/01' },
    ],
  },
};

const completedChallengeData = [
  {
    id: 1,
    title: '5월 챌린지',
    period: '25.06.05 - 25.07.04',
    completion: 53,
    achievement: 50.0,
    img: runningWoman,
  },
  {
    id: 2,
    title: '하루에 10000보 걷기',
    period: '25.06.05 - 25.07.04',
    completion: 53,
    achievement: 80.5,
    img: runningWoman,
  },
  {
    id: 3,
    title: '건강 식단 지키기', // 이미지에 있는 '검버섯...' 내용은 이 챌린지 제목에 맞게 수정
    period: '25.06.05 - 25.07.04',
    completion: 53,
    achievement: 30.4,
    img: runningWoman,
  },
  {
    id: 4,
    title: '건강한 식단하기',
    period: '25.06.05 - 25.07.04',
    completion: 53,
    achievement: 50.0,
    img: runningWoman,
  },
  // 더 많은 챌린지 데이터를 추가할 수 있습니다.
];

const MyCallenge = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        건강 챌린지 {'>'} 내 챌린지
      </PageTitle>

      <ChallengeSummarySection>
        <SummaryTextContent>
          <PeriodText>{ongoingChallengeData[1].period}</PeriodText>
          <ChallengeTitle>{ongoingChallengeData[1].title}</ChallengeTitle>
          <ProgressBarWrapper>
            <ProgressBarBackground>
              <ProgressBarFill percentage={ongoingChallengeData[1].achievement} />
            </ProgressBarBackground>
            <ProgressText>
              {ongoingChallengeData[1].currentProgressDays}/{ongoingChallengeData[1].totalChallengeDays}일 달성{' '}
              {ongoingChallengeData[1].achievement}%
            </ProgressText>
          </ProgressBarWrapper>
        </SummaryTextContent>
        <SummaryImage src={ongoingChallengeData[1].img} alt={ongoingChallengeData[1].title} />
      </ChallengeSummarySection>

      <ChallengeSummary>
        <SummaryCard>나의 챌린지 완료 횟수: 2회</SummaryCard>
        <SummaryCard>누적 획득 포인트: 200p</SummaryCard>
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
          {completedChallengeData.map((challenge) => (
            <ChallengeCard key={challenge.id} onClick={() => navigate('/myChallengeDetail')}>
              <CardImage src={challenge.img} alt={challenge.title} />
              <CardContent>
                <CardTitle>챌린지: {challenge.title}</CardTitle>
                <CardPeriod>기간 :{challenge.period}</CardPeriod>
                <CardCompletion>완료 :{challenge.completion}</CardCompletion>
                <ProgressBarContainer>
                  <MiniProgressBarFill percentage={challenge.achievement} />
                </ProgressBarContainer>
                <CardAchievement>달성률 :{challenge.achievement}%</CardAchievement>
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

// =========================================================
// Styled Components
// =========================================================

// 상단 도전 중인 챌린지 섹션
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

  @media (max-width: 900px) {
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
  width: 400px;
  height: 200px;
  border-radius: 25px; /* 이미지를 원형으로 */
  object-fit: cover;
  flex-shrink: 0; /* 이미지 크기 유연하게 줄어들지 않도록 */
  background-color: #ffe08a; /* 이미지 배경색 (노란 원) */
  padding: 10px; /* 이미지와 원형 배경 사이 여백 */

  @media (max-width: 768px) {
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
  margin: 0 50px;

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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* 반응형 그리드 */
  gap: 20px; /* 카드 간 간격 */
  justify-content: center; /* 카드들을 가운데 정렬 */

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

const CardImage = styled.img`
  width: 100%;
  height: 120px; /* 기존 120px에서 100px로 줄임 */
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
  margin-top: 30px;
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
