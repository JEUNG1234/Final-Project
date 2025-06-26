import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import runningWoman from '../../assets/challengeImg.jpg';
import { FaPlus } from 'react-icons/fa';
import { challengeService } from '../../api/challengeService'; // challengeService 임포트

// 목업 데이터(mockChallengeDetails) 삭제

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { id: challengeNo } = useParams(); // URL 파라미터에서 챌린지 ID 가져오기
  const [challenge, setChallenge] = useState(null); // 챌린지 데이터를 담을 상태
  const [achievement, setAchievement] = useState(0); // 달성률 상태

  useEffect(() => {
    // 챌린지 상세 정보 조회 API 호출
    const fetchChallengeDetail = async () => {
      if (!challengeNo) return;
      try {
        const data = await challengeService.getChallengeDetails(challengeNo);
        setChallenge(data);

        // --- 챌린지 기간 기반으로 달성률 계산 ---
        const today = new Date();
        const startDate = new Date(data.challengeStartDate);
        const endDate = new Date(data.challengeEndDate);

        // 오늘 날짜가 시작일 이전이면 0%, 종료일 이후면 100%
        if (today < startDate) {
          setAchievement(0);
        } else if (today > endDate) {
          setAchievement(100);
        } else {
          const totalDuration = endDate.getTime() - startDate.getTime();
          const progressedDuration = today.getTime() - startDate.getTime();
          const calculatedAchievement = Math.round((progressedDuration / totalDuration) * 100);
          setAchievement(calculatedAchievement);
        }
      } catch (error) {
        console.error('챌린지 상세 정보 로딩 실패:', error);
        alert('챌린지 정보를 불러오는 데 실패했습니다.');
        navigate('/challenge');
      }
    };

    fetchChallengeDetail();
  }, [challengeNo, navigate]);

  // 로딩 중이거나 데이터가 없을 경우
  if (!challenge) {
    return <MainContent>챌린지 정보를 불러오는 중...</MainContent>;
  }

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
          <ProgressBarWrapper>
            <ProgressBarBackground>
              <ProgressBarFill percentage={achievement} />
            </ProgressBarBackground>
            <ProgressText>
              참여인원 {challenge.participantCount}명 · 달성률 {achievement}%
            </ProgressText>
          </ProgressBarWrapper>
        </SummaryTextContent>
        <SummaryImage src={challenge.challengeImageUrl || runningWoman} alt={challenge.challengeTitle} />
      </ChallengeSummarySection>

      <JoinButtonArea>
        <JoinChallengeButton onClick={() => navigate(`/challenge/challengeJoin`)}>
          <FaPlus /> 챌린지 참여
        </JoinChallengeButton>
      </JoinButtonArea>

      <BoardSection>
        <BoardHeader>
          <h3>게시글 태그</h3>
          <h3>제목</h3>
          <h3>작성자</h3>
          <h3>작성일자</h3>
        </BoardHeader>
        <BoardTable>
          {challenge.completions && challenge.completions.length > 0 ? (
            challenge.completions.map((post) => (
              <BoardRow key={post.completeNo} onClick={() => navigate(`/challenge/challenge_id/${post.completeNo}`)}>
                <BoardCell typeColumn>챌린지</BoardCell>
                <BoardCell>{post.completeTitle}</BoardCell>
                <BoardCell>{post.userName}</BoardCell>
                <BoardCell>{/* 작성일자 필드가 없으므로 임시로 비워둠 */}</BoardCell>
              </BoardRow>
            ))
          ) : (
            <NoPostsMessage>아직 등록된 인증글이 없습니다.</NoPostsMessage>
          )}
        </BoardTable>
      </BoardSection>

      <BackButtonContainer>
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
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

const JoinChallengeButton = styled.button`
  height: 50px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px; /* 둥근 버튼 */
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

export default ChallengeDetail;