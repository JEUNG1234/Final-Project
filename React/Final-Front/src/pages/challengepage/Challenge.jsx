import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsFire } from 'react-icons/bs';
import {
  BottomBar,
  Pagination,
  PageButton,
  MainContent,
  PageTitle,
} from '../../styles/common/MainContentLayout';
import { useNavigate } from 'react-router-dom';
import runningWoman from '../../assets/challengeImg.jpg';
import { challengeService } from '../../api/challengeService';

const Challenge = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchChallenges = async (page) => {
    try {
      const data = await challengeService.getAllChallenges(page);
      setChallenges(data.content);
      setPageInfo({
        currentPage: data.currentPage,
        totalPages: data.totalPage,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    } catch (error) {
      console.error('챌린지 목록을 불러오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchChallenges(0);
  }, []);

  const handlePageChange = (page) => {
    fetchChallenges(page);
  };

  return (
    <MainContent>
      <PageTitle>
        <BsFire />
        챌린지
      </PageTitle>

      <MyChallengeAera>
        <MyChallengeButton onClick={() => navigate('/myChallenge')}>MY 챌린지</MyChallengeButton>
      </MyChallengeAera>
      <ContentBody>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.challengeNo} onClick={() => navigate(`/challenge/${challenge.challengeNo}`)}>
            <CardImageArea>
              <CardImage 
                src={challenge.challengeImageUrl ? `https://d1qzqzab49ueo8.cloudfront.net/${challenge.challengeImageUrl}` : runningWoman} 
                alt={challenge.challengeTitle} 
              />
            </CardImageArea>
            <CardContent>
              <CardTitle>챌린지: {challenge.challengeTitle}</CardTitle>
              <CardPeriod>
                기간 : {challenge.challengeStartDate} ~ {challenge.challengeEndDate}
              </CardPeriod>
              {/* 포인트 표시 추가 */}
              <CardCompletion>포인트 : {challenge.challengePoint}P</CardCompletion>
              <CardCompletion>참여인원: {challenge.participantCount}명</CardCompletion>
            </CardContent>
          </ChallengeCard>
        ))}
      </ContentBody>
      <BottomBar>
        <Pagination>
          <PageButton onClick={() => handlePageChange(pageInfo.currentPage - 1)} disabled={!pageInfo.hasPrevious}>
            &lt;
          </PageButton>
          {Array.from({ length: pageInfo.totalPages }, (_, i) => (
            <PageButton
              key={i}
              className={pageInfo.currentPage === i ? 'active' : ''}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => handlePageChange(pageInfo.currentPage + 1)} disabled={!pageInfo.hasNext}>
            &gt;
          </PageButton>
        </Pagination>
      </BottomBar>
    </MainContent>
  );
};

// --- Styled Components --- (이하 생략)
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

export default Challenge;