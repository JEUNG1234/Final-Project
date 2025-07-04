import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainContent, PageTitle, Pagination, PageButton, BottomBar } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import runningWoman from '../../assets/challengeImg.jpg';
import { challengeService } from '../../api/challengeService';
import useUserStore from '../../Store/useStore';
import dayjs from 'dayjs';

const MyChallengeComplete = () => {
  const navigate = useNavigate();
  const { id: challengeNo } = useParams();
  const { user } = useUserStore();
  const [challenge, setChallenge] = useState(null);
  const [myCompletionsPage, setMyCompletionsPage] = useState({
    content: [],
    currentPage: 0,
    totalPage: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchMyCompletions = useCallback(async (page) => {
    if (!user?.userId) return;
    try {
      const data = await challengeService.getMyCompletions(challengeNo, user.userId, page);
      setMyCompletionsPage({
        content: data.content,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    } catch (error) {
      console.error("나의 인증글 목록을 불러오는데 실패했습니다.", error);
    }
  }, [challengeNo, user]);

  useEffect(() => {
    const fetchChallengeDetail = async () => {
      try {
        const detailData = await challengeService.getChallengeDetails(challengeNo);
        setChallenge(detailData);
      } catch (error) {
        console.error('챌린지 상세 정보 로딩 실패:', error);
      }
    };

    fetchChallengeDetail();
    fetchMyCompletions(0);
  }, [challengeNo, fetchMyCompletions]);

  if (!challenge) {
    return <MainContent>로딩 중...</MainContent>;
  }
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        MY 챌린지 {'>'} {challenge.challengeTitle}
      </PageTitle>

      <ChallengeSummarySection>
        <SummaryTextContent>
          <PeriodText>
            {challenge.challengeStartDate} ~ {challenge.challengeEndDate}
          </PeriodText>
          <ChallengeTitle>{challenge.challengeTitle}</ChallengeTitle>
        </SummaryTextContent>
        <SummaryImage 
          src={challenge.challengeImageUrl ? `${import.meta.env.VITE_CLOUDFRONT_URL}/${challenge.challengeImageUrl}` : runningWoman} 
          alt={challenge.challengeTitle} 
        />
      </ChallengeSummarySection>

      <BoardSection>
        <BoardHeader>
          <h3>게시글 태그</h3>
          <h3>제목</h3>
          <h3>작성자</h3>
          <h3>작성일자</h3>
        </BoardHeader>
        <BoardTable>
          {myCompletionsPage.content && myCompletionsPage.content.length > 0 ? (
            myCompletionsPage.content.map((post) => (
              <BoardRow key={post.completeNo} onClick={() => navigate(`/challenge/challenge_id/${post.completeNo}`)}>
                <BoardCell typeColumn>챌린지</BoardCell>
                <BoardCell>{post.completeTitle}</BoardCell>
                <BoardCell>{post.userName}</BoardCell>
                <BoardCell>{dayjs(post.createdDate).format('YYYY-MM-DD')}</BoardCell>
              </BoardRow>
            ))
          ) : (
            <NoPostsMessage>작성한 인증글이 없습니다.</NoPostsMessage>
          )}
        </BoardTable>
      </BoardSection>
      
      <BottomBar>
        <Pagination>
          <PageButton onClick={() => fetchMyCompletions(myCompletionsPage.currentPage - 1)} disabled={!myCompletionsPage.hasPrevious}>
            &lt;
          </PageButton>
          {Array.from({ length: myCompletionsPage.totalPage }, (_, i) => (
            <PageButton
              key={i}
              className={myCompletionsPage.currentPage === i ? 'active' : ''}
              onClick={() => fetchMyCompletions(i)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => fetchMyCompletions(myCompletionsPage.currentPage + 1)} disabled={!myCompletionsPage.hasNext}>
            &gt;
          </PageButton>
        </Pagination>
      </BottomBar>

      <GoBackButtonContainer>
        <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>
      </GoBackButtonContainer>
    </MainContent>
  );
};


export default MyChallengeComplete;


// Styled Components...
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
  border-bottom: 1px solid #f0f0f0;
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