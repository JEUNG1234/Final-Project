import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle, Pagination, PageButton, BottomBar } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import runningWoman from '../../assets/challengeImg.jpg';
import { FaPlus } from 'react-icons/fa';
import { challengeService } from '../../api/challengeService';
import useUserStore from '../../Store/useStore';
import dayjs from 'dayjs';

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { id: challengeNo } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [completionsPage, setCompletionsPage] = useState({
    content: [],
    currentPage: 0,
    totalPage: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [personalAchievement, setPersonalAchievement] = useState(0);
  const { user } = useUserStore();
  const [hasActiveChallenge, setHasActiveChallenge] = useState(false);
  const [isMyChallenge, setIsMyChallenge] = useState(false);

  const fetchCompletions = useCallback(async (page) => {
    try {
      const data = await challengeService.getCompletions(challengeNo, page);
      setCompletionsPage({
        content: data.content,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    } catch (error) {
      console.error("인증글 목록을 불러오는데 실패했습니다.", error);
    }
  }, [challengeNo]);

  useEffect(() => {
    const fetchChallengeData = async () => {
      if (!challengeNo || !user) return;
      try {
        const detailData = await challengeService.getChallengeDetails(challengeNo);
        const activeStatus = await challengeService.checkActiveChallenge(user.userId);
        
        setChallenge(detailData);
        setHasActiveChallenge(activeStatus);

        const userCompletionsCount = detailData.completions.filter((c) => c.userId === user.userId).length;
        const totalDuration = (new Date(detailData.challengeEndDate).getTime() - new Date(detailData.challengeStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1;
        if (totalDuration > 0) {
          setPersonalAchievement(Math.round((userCompletionsCount / totalDuration) * 100));
        }
        if (userCompletionsCount > 0) {
          setIsMyChallenge(true);
        }
        
        fetchCompletions(0);

      } catch (error) {
        console.error('챌린지 데이터 로딩 실패:', error);
        alert('챌린지 정보를 불러오는 데 실패했습니다.');
        navigate('/challenge');
      }
    };

    fetchChallengeData();
  }, [challengeNo, navigate, user, fetchCompletions]);

  if (!challenge) {
    return <MainContent>챌린지 정보를 불러오는 중...</MainContent>;
  }

  const isChallengeOngoing = new Date() <= new Date(challenge.challengeEndDate);
  const canJoin = isChallengeOngoing && (!hasActiveChallenge || isMyChallenge);

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지 {'>'} {challenge.challengeTitle}
      </PageTitle>

      <ChallengeSummarySection>
        <SummaryTextContent>
          <PeriodText>
            {challenge.challengeStartDate} ~ {challenge.challengeEndDate}
          </PeriodText>
          <ChallengeTitle>{challenge.challengeTitle}</ChallengeTitle>
          <ChallengeDescription>{challenge.challengeContent}</ChallengeDescription>
          <ProgressBarWrapper>
            <ProgressBarBackground>
              <ProgressBarFill percentage={personalAchievement} />
            </ProgressBarBackground>
            <ProgressText>
              참여인원 {challenge.participantCount}명 · 나의 달성률 {personalAchievement}%
            </ProgressText>
          </ProgressBarWrapper>
        </SummaryTextContent>
        <SummaryImage 
              src={challenge.challengeImageUrl ? `https://d1qzqzab49ueo8.cloudfront.net/${challenge.challengeImageUrl}` : runningWoman} 
              alt={challenge.challengeTitle} 
            />
      </ChallengeSummarySection>

      <JoinButtonArea>
        {isChallengeOngoing && (
          <JoinChallengeButton
            onClick={() => navigate(`/challenge/${challengeNo}/join`)}
            disabled={!canJoin}
            title={!canJoin && !isMyChallenge ? '이미 진행중인 다른 챌린지가 있습니다.' : '챌린지 참여하기'}
          >
            <FaPlus /> {!canJoin && !isMyChallenge ? '다른 챌린지 진행중' : '챌린지 참여'}
          </JoinChallengeButton>
        )}
      </JoinButtonArea>

      <BoardSection>
        <BoardHeader>
          <h3>게시글 태그</h3>
          <h3>제목</h3>
          <h3>작성자</h3>
          <h3>작성일자</h3>
        </BoardHeader>
        <BoardTable>
          {completionsPage.content && completionsPage.content.length > 0 ? (
            completionsPage.content.map((post) => (
              <BoardRow key={post.completeNo} onClick={() => navigate(`/challenge/challenge_id/${post.completeNo}`)}>
                <BoardCell typeColumn>챌린지</BoardCell>
                <BoardCell>{post.completeTitle}</BoardCell>
                <BoardCell>{post.userName}</BoardCell>
                <BoardCell>{dayjs(post.createdDate).format('YYYY-MM-DD')}</BoardCell>
              </BoardRow>
            ))
          ) : (
            <NoPostsMessage>아직 등록된 인증글이 없습니다.</NoPostsMessage>
          )}
        </BoardTable>
      </BoardSection>

      <BottomBar>
        <Pagination>
          <PageButton onClick={() => fetchCompletions(completionsPage.currentPage - 1)} disabled={!completionsPage.hasPrevious}>
            &lt;
          </PageButton>
          {Array.from({ length: completionsPage.totalPage }, (_, i) => (
            <PageButton
              key={i}
              className={completionsPage.currentPage === i ? 'active' : ''}
              onClick={() => fetchCompletions(i)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => fetchCompletions(completionsPage.currentPage + 1)} disabled={!completionsPage.hasNext}>
            &gt;
          </PageButton>
        </Pagination>
      </BottomBar>

      <BackButtonContainer>
        <BackButton onClick={() => navigate('/challenge')}>목록으로</BackButton>
      </BackButtonContainer>
    </MainContent>
  );
};

const JoinButtonArea = styled.div`
  width: 100%;
  height: 50px;
  padding-right: 50px;
  display: flex;
  justify-content: end;
`;

const ChallengeSummarySection = styled.div`
  background-color: #e6f2ff;
  border-radius: 15px;
  padding: 10px 20px 10px 40px;
  margin: 0 35px 10px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 30px;
  }
`;

const SummaryTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  z-index: 1;
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

const ChallengeDescription = styled.p`
  font-size: 16px;
  color: #555;
  margin: 5px 0 10px;
  line-height: 1.6;
`;

const ProgressBarWrapper = styled.div`
  width: 300px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 8px;
  background-color: #c9e2ff;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.percentage || 0}%;
  background-color: #4d8eff;
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
  flex-shrink: 0;
  background-color: #ffe08a;
  padding: 10px;

  @media (max-width: 1200px) {
    width: 150px;
    height: 150px;
  }
`;

const JoinChallengeButton = styled.button`
  height: 50px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
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
  
  &:disabled {
    background-color: #b0c4de;
    cursor: not-allowed;
  }
`;

const BoardSection = styled.div`
  margin: 10px 35px;
  background-color: #ffffff;
  border: 1px solid #ececec;
  border-radius: 15px;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BoardHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 3fr 1.5fr 1.5fr;
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
  grid-template-columns: 120px 3fr 1.5fr 1.5fr;
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
  padding: 0 5px;
  word-break: break-word;

  ${(props) =>
    props.typeColumn &&
    `
    color: #4d8eff;
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

export default ChallengeDetail;