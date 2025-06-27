import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import runningWoman from '../../assets/challengeImg.jpg';
import { challengeService } from '../../api/challengeService';
import useUserStore from '../../Store/useStore';

const MyChallengeComplete = () => {
  const navigate = useNavigate();
  const { id: challengeNo } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [personalAchievement, setPersonalAchievement] = useState(0);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchChallengeData = async () => {
      if (!challengeNo || !user) return;
      try {
        const detailData = await challengeService.getChallengeDetails(challengeNo);
        setChallenge(detailData);

        const userCompletions = detailData.completions.filter(c => c.userId === user.userId);
        const totalDuration = (new Date(detailData.challengeEndDate).getTime() - new Date(detailData.challengeStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

        if (totalDuration > 0) {
          const calculatedAchievement = Math.round((userCompletions.length / totalDuration) * 100);
          setPersonalAchievement(calculatedAchievement);
        }
      } catch (error) {
        console.error('챌린지 상세 정보 로딩 실패:', error);
        alert('챌린지 정보를 불러오는 데 실패했습니다.');
        navigate('/myChallenge');
      }
    };

    fetchChallengeData();
  }, [challengeNo, user, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!challenge) {
    return <MainContent>로딩 중...</MainContent>;
  }

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} MY 챌린지 {'>'} {challenge.challengeTitle}
      </PageTitle>

      <ChallengeSummarySection>
        <SummaryTextContent>
          <PeriodText>{challenge.challengeStartDate} ~ {challenge.challengeEndDate}</PeriodText>
          <ChallengeTitle>{challenge.challengeTitle}</ChallengeTitle>
          <ProgressBarWrapper>
            <ProgressBarBackground>
              <ProgressBarFill percentage={personalAchievement} />
            </ProgressBarBackground>
            <ProgressText>
              나의 달성률 {personalAchievement}%
            </ProgressText>
          </ProgressBarWrapper>
        </SummaryTextContent>
        <SummaryImage src={challenge.challengeImageUrl || runningWoman} alt={challenge.challengeTitle} />
      </ChallengeSummarySection>

      <BoardSection>
        <BoardHeader>
          <h3>게시글 태그</h3>
          <h3>제목</h3>
          <h3>작성자</h3>
          <h3>작성일자</h3>
        </BoardHeader>
        <BoardTable>
          {challenge.completions && challenge.completions.length > 0 ? (
             challenge.completions
             .filter(post => post.userId === user.userId) // 내 인증글만 필터링
             .map((post) => (
              <BoardRow key={post.completeNo} onClick={() => navigate(`/challenge/challenge_id/${post.completeNo}`)}>
                <BoardCell typeColumn>챌린지</BoardCell>
                <BoardCell>{post.completeTitle}</BoardCell>
                <BoardCell>{post.userName}</BoardCell>
                <BoardCell>{/* 작성일자 필드가 없으므로 임시로 비워둠 */}</BoardCell>
              </BoardRow>
            ))
          ) : (
            <NoPostsMessage>등록된 인증글이 없습니다.</NoPostsMessage>
          )}
        </BoardTable>
      </BoardSection>

      <BackButtonContainer>
        <BackButton onClick={handleGoBack}>뒤로가기</BackButton>
      </BackButtonContainer>
    </MainContent>
  );
};

export default MyChallengeComplete;

// Styled Components... (이전과 동일)
const ChallengeSummarySection = styled.div`
  background-color: #e6f2ff; /* 연한 파란색 배경 */
  border-radius: 15px;
  padding: 20px 40px; /* 내부 여백 */
  margin: 10px 35px; /* MainContent 내부 여백 */
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

const PeriodText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #6c757d;
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

const BoardSection = styled.div`
  margin: 10px 35px; /* MainContent 내부 여백 */
  background-color: #ffffff;
  border: 1px solid #ececec;
  border-radius: 15px;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BoardHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 3fr 1.5fr 1.5fr; /* 열 너비 조정 */
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  color: #333;

  h3 {
    margin: 0;
    font-size: 15px;
    text-align: center;
  }

  h3:first-child {
    text-align: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    h3 {
      font-size: 13px;
    }
  }
`;

const BoardTable = styled.div`
  width: 100%;
`;

const BoardRow = styled.div`
  display: grid;
  grid-template-columns: 120px 3fr 1.5fr 1.5fr; /* Header와 동일하게 설정 */
  padding: 12px 0;
  border-bottom: 1px solid #ffffff;
  font-size: 14px;
  color: #555;
  align-items: center;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #ebebeb;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    font-size: 12px;
  }
`;

const BoardCell = styled.div`
  text-align: center;
  padding: 0 5px; /* 셀 내부 여백 */
  word-break: break-word; /* 긴 텍스트 줄바꿈 */

  ${(props) =>
    props.typeColumn &&
    `
    color: #4d8eff; /* 공지사항/챌린지 텍스트 색상 */
    font-weight: bold;
  `}
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 16px;
`;

const BackButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const BackButton = styled.button`
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