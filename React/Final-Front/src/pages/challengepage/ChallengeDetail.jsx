import React, { useState, useEffect } from 'react'; // React 자체는 그대로 임포트
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Pagination, PageButton, MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { BsFire } from 'react-icons/bs';
import runningWoman from '../../assets/challengeImg.jpg';
import { FaPlus } from 'react-icons/fa';

const mockChallengeDetails = {
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

const ChallengeDetail = () => {
  const navigate = useNavigate(); // 뒤로가기 버튼을 위한 navigate 훅

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지
      </PageTitle>

      <ChallengeSummarySection>
        <SummaryTextContent>
          <PeriodText>{mockChallengeDetails[1].period}</PeriodText>
          <ChallengeTitle>{mockChallengeDetails[1].title}</ChallengeTitle>
          <ProgressBarWrapper>
            <ProgressBarBackground>
              <ProgressBarFill percentage={mockChallengeDetails[1].achievement} />
            </ProgressBarBackground>
            <ProgressText>
              {mockChallengeDetails[1].currentProgressDays}/{mockChallengeDetails[1].totalChallengeDays}일 달성{' '}
              {mockChallengeDetails[1].achievement}%
            </ProgressText>
          </ProgressBarWrapper>
        </SummaryTextContent>
        <SummaryImage src={mockChallengeDetails[1].img} alt={mockChallengeDetails[1].title} />
      </ChallengeSummarySection>

      <JoinButtonArea>
        <JoinChallengeButton>
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
          {mockChallengeDetails[1].boardPosts.map((post) => (
            <BoardRow key={post.id}>
              <BoardCell typeColumn>{post.type}</BoardCell>
              <BoardCell>{post.title}</BoardCell>
              <BoardCell>{post.author}</BoardCell>
              <BoardCell>{post.date}</BoardCell>
            </BoardRow>
          ))}
        </BoardTable>
      </BoardSection>

      <BackButtonContainer>
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
      </BackButtonContainer>
    </MainContent>
  );
};

export default ChallengeDetail;

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
  padding: 20px 40px; /* 내부 여백 */
  margin: 10px 35px; /* MainContent 내부 여백 */
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
  margin: 0;
`;

const ChallengeTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const ProgressBarWrapper = styled.div`
  width: 250px; /* 진행바 너비 고정 */
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
  color: #555;
  text-align: right;
  margin: 0;
`;

const SummaryImage = styled.img`
  width: 200px; /* 이미지 크기 */
  height: 150px;
  object-fit: contain;
  margin-left: 50px; /* 텍스트와의 간격 */

  @media (max-width: 900px) {
    margin-left: 0;
    margin-top: 20px;
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

  @media (max-width: 900px) {
    position: static; /* 모바일에서는 정적으로 배치 */
    margin-top: 20px;
    align-self: flex-end; /* 오른쪽 정렬 */
  }
`;

const BoardSection = styled.div`
  margin: 10px 35px; /* MainContent 내부 여백 */
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
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

  &:last-child {
    border-bottom: none;
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
  /* padding-bottom: 50px; 하단 여백 */
`;

const BackButton = styled.button`
  background-color: #f8f9fa;
  color: #495057;
  padding: 10px 30px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }
`;
