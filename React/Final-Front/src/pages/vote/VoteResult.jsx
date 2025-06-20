import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContent as BaseMainContent } from '../../styles/common/MainContentLayout';
import { voteService } from '../../api/voteService';

const VoteResult = () => {
  const navigate = useNavigate();
  const { voteId } = useParams(); // URL 파라미터에서 voteId 가져오기
  const [resultData, setResultData] = useState(null);
  const [winningOption, setWinningOption] = useState(null);

  useEffect(() => {
    const fetchVoteResult = async () => {
      try {
        const data = await voteService.getVoteDetails(voteId);
        setResultData(data);
        // 1등 항목 찾기
        if (data && data.options.length > 0) {
          const winner = data.options.reduce((prev, current) =>
            prev.voteCount > current.voteCount ? prev : current
          );
          setWinningOption(winner);
        }
      } catch (error) {
        console.error('투표 결과 조회 실패:', error);
        alert('투표 결과를 불러오는 데 실패했습니다.');
      }
    };
    fetchVoteResult();
  }, [voteId]);

  const handleCreateChallenge = () => {
    if (!resultData || !winningOption) return;
    navigate('/challenge/create', {
      state: {
        title: winningOption.voteContent,
        endDate: resultData.voteEndDate,
        type: resultData.voteType,
        // points: resultData.points, // 포인트 정보가 API에 있다면 추가
      },
    });
  };

  if (!resultData) {
    return <MainContent>결과를 불러오는 중입니다...</MainContent>;
  }

  return (
    <MainContent>
      <ResultHeader>
        <Title>{resultData.voteTitle}</Title>
        <DateRange>~ {resultData.voteEndDate}</DateRange>
        <TagWrapper>
          <Tag type={resultData.voteType}>{resultData.voteType === 'LONG' ? '장기' : '단기'}</Tag>
          {/* <Tag type={resultData.voteType}>{resultData.points}P</Tag> */}
        </TagWrapper>
      </ResultHeader>
      <ResultList>
        {resultData.options.map((option, index) => {
          const percentage = resultData.totalVotes > 0 ? (option.voteCount / resultData.totalVotes) * 100 : 0;
          return (
            <ResultItem key={index}>
              <TitleWrapper>
                <OptionTitle>{option.voteContent}</OptionTitle>
                <VoteCount>({option.voteCount}표)</VoteCount>
              </TitleWrapper>
              <ProgressBar>
                <ProgressFill percentage={percentage} />
              </ProgressBar>
            </ResultItem>
          );
        })}
      </ResultList>
      <Footer>
        {winningOption && (
          <SummaryBox>
            <p>
              이번 투표에서 가장 많은 표를 얻은 것은 <strong>{winningOption.voteContent}</strong>였습니다!
            </p>
            <ButtonWrapper>
              <ActionButton onClick={() => navigate('/votelist')}>투표 목록으로</ActionButton>
              <ActionButton primary onClick={handleCreateChallenge}>
                챌린지 생성
              </ActionButton>
            </ButtonWrapper>
          </SummaryBox>
        )}
        <TotalParticipants>총 {resultData.totalVotes}명 참여</TotalParticipants>
      </Footer>
    </MainContent>
  );
};

// --- Styled Components (이하 동일) ---
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
    (props.type === 'LONG' &&
      css`
        background-color: #e7f5ee;
        color: #28a745;
      `) ||
    (props.type === 'SHORT' &&
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
  transition: width 0.5s ease-in-out;
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