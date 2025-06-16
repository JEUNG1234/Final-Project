import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainContent as BaseMainContent } from '../../styles/common/MainContentLayout';

const resultData = {
  title: '6월 건강 챌린지',
  dateRange: '2025-06-05 — 2025-07-04',
  startDate: '2025-06-05', // state로 넘겨주기 위한 데이터
  endDate: '2025-07-04',   // state로 넘겨주기 위한 데이터
  tag: '장기 챌린지',
  points: 300,
  totalParticipants: 100,
  options: [
    { title: '헬스장 매일 가기', votes: 25 },
    { title: '주말마다 등산 가기', votes: 20 },
    { title: '점심메뉴 다 같이 식단하기(샐러드 OR 포케)', votes: 35 },
    { title: '1일 10000보 걷기', votes: 20 },
  ],
};

const VoteResult = () => {
  const navigate = useNavigate();
  const winningOption = resultData.options.reduce((prev, current) => (prev.votes > current.votes ? prev : current));

  // 챌린지 생성 페이지로 데이터를 가지고 이동하는 함수
  const handleCreateChallenge = () => {
    navigate('/challenge/create', {
      state: {
        title: winningOption.title, // 1등한 항목의 제목
        startDate: resultData.startDate,
        endDate: resultData.endDate,
        type: resultData.tag.includes('장기') ? '장기' : '단기',
        points: resultData.points,
      },
    });
  };

  return (
    <MainContent>
      <ResultHeader>
        <Title>{resultData.title}</Title>
        <DateRange>{resultData.dateRange}</DateRange>
        <TagWrapper>
          <Tag type={resultData.tag}>{resultData.tag}</Tag>
          <Tag type={resultData.tag}>{resultData.points}P</Tag>
        </TagWrapper>
      </ResultHeader>

      <ResultList>
        {resultData.options.map((option, index) => {
          const percentage = (option.votes / resultData.totalParticipants) * 100;
          return (
            <ResultItem key={index}>
              <TitleWrapper>
                <OptionTitle>{option.title}</OptionTitle>
                <VoteCount>({option.votes}표)</VoteCount>
              </TitleWrapper>
              <ProgressBar>
                <ProgressFill percentage={percentage} />
              </ProgressBar>
            </ResultItem>
          );
        })}
      </ResultList>

      <Footer>
        <SummaryBox>
          <p>
            이번 투표에서 가장 많은 표를 얻은 것은 <strong>{winningOption.title}</strong>였습니다!
            <br />
            여러분의 의견을 반영하여, 건강 챌린지를 다음달 식단해보는 건 어떠세요?
          </p>
          <ButtonWrapper>
            <ActionButton onClick={() => navigate('/votelist')}>투표 목록으로</ActionButton>
            {/* '챌린지 생성' 버튼에 onClick 이벤트 연결 */}
            <ActionButton primary onClick={handleCreateChallenge}>챌린지 생성</ActionButton>
          </ButtonWrapper>
        </SummaryBox>
        <TotalParticipants>총 {resultData.totalParticipants}명 참여</TotalParticipants>
      </Footer>
    </MainContent>
  );
};

// ... (이하 Styled Components는 이전과 동일)
const MainContent = styled(BaseMainContent)`
  margin: 30px auto;
  padding: 30px 40px;
`;
const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;
const DateRange = styled.p`
  font-size: 16px;
  color: #888;
  margin: 8px 0;
`;
const TagWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;
const Tag = styled.span`
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  
  ${(props) =>
    (props.type === '장기 챌린지' &&
      css`
        background-color: #e7f5ee;
        color: #28a745;
      `) ||
    (props.type === '단기 챌린지' &&
      css`
        background-color: #fff8e1;
        color: #f59e0b;
      `)}
`;
const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ResultItem = styled.div``;
const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
`;
const OptionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #444;
`;
const VoteCount = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #888;
`;
const ProgressBar = styled.div`
  width: 100%;
  height: 28px;
  background-color: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background-color: #5cb85c;
  border-radius: 8px;
`;
const Footer = styled.div`
  margin-top: 30px;
  position: relative;
`;
const SummaryBox = styled.div`
  background-color: #eaf3ff;
  border: 1px solid #b8d6ff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #333;
  line-height: 1.6;

  strong {
    color: #0056b3;
    font-weight: 700;
  }
`;
const ButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;
const ActionButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #007bff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${(props) =>
    props.primary
      ? css`
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `
      : css`
          background-color: white;
          color: #007bff;
          &:hover {
            background-color: #f0f8ff;
          }
        `}
`;
const TotalParticipants = styled.p`
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-size: 16px;
  font-weight: 600;
  color: #555;
`;

export default VoteResult;