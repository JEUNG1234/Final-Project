import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContent as BaseMainContent } from '../../styles/common/MainContentLayout';
import { voteService } from '../../api/voteService';
import useUserStore from '../../Store/useStore';
import Modal from '../../components/Modal';

const VoteResult = () => {
  const navigate = useNavigate();
  const { voteId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [winningOption, setWinningOption] = useState(null);
  const { user } = useUserStore();

  // 모달 상태 및 데이터 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voters, setVoters] = useState([]);
  const [selectedOptionTitle, setSelectedOptionTitle] = useState('');
  const [isLoadingVoters, setIsLoadingVoters] = useState(false);

  useEffect(() => {
    const fetchVoteResult = async () => {
      try {
        const data = await voteService.getVoteDetails(voteId);
        setResultData(data);
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
        startDate: resultData.voteCreatedDate,
        endDate: resultData.voteEndDate,
        type: resultData.voteType,
        points: resultData.points,
      },
    });
  };

  // 모달 열기 핸들러
  const handleOpenVotersModal = async (voteContentNo, optionText) => {
    if (resultData.isAnonymous) {
      alert('익명 투표는 참여자 정보를 볼 수 없습니다.');
      return;
    }

    setIsLoadingVoters(true);
    setIsModalOpen(true);
    setSelectedOptionTitle(optionText);
    try {
      const voterData = await voteService.getVotersForOption(voteId, voteContentNo);
      setVoters(voterData);
    } catch (error) {
      alert(error.response?.data || '투표자 목록을 불러오는 데 실패했습니다.');
      setIsModalOpen(false);
    } finally {
      setIsLoadingVoters(false);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVoters([]);
    setSelectedOptionTitle('');
  };

  if (!resultData) {
    return <MainContent>결과를 불러오는 중...</MainContent>;
  }

  return (
    <>
      <MainContent>
        <Header>
          <TagGroup>
            <TypeBadge $type={resultData.voteType}>{resultData.voteType === 'LONG' ? '장기' : '단기'}</TypeBadge>
            <Tag>{resultData.points}P</Tag>
          </TagGroup>
          <Title>{resultData.voteTitle}</Title>
          <Info>
            <span>
              <strong>마감일:</strong> {resultData.voteEndDate}
            </span>
            <span>
              <strong>총 참여자:</strong> {resultData.totalVotes}명
            </span>
          </Info>
        </Header>

        <ResultList>
          {resultData.options
            .sort((a, b) => b.voteCount - a.voteCount)
            .map((option, index) => {
              const percentage = resultData.totalVotes > 0 ? (option.voteCount / resultData.totalVotes) * 100 : 0;
              return (
                <ResultItem
                  key={option.voteContentNo}
                  $isWinner={option.voteContentNo === winningOption?.voteContentNo}
                  onClick={!resultData.isAnonymous ? () => handleOpenVotersModal(option.voteContentNo, option.voteContent) : null}
                  isClickable={!resultData.isAnonymous}
                >
                  <Rank>{index + 1}위</Rank>
                  <OptionText>{option.voteContent}</OptionText>
                  <ResultInfo>
                    <ProgressBar>
                      <ProgressFill percentage={percentage} />
                    </ProgressBar>
                    <Count>
                      {option.voteCount}표 ({percentage.toFixed(1)}%)
                    </Count>
                  </ResultInfo>
                </ResultItem>
              );
            })}
        </ResultList>

        <Footer>
          <SummaryBox>
            <p>
              총 <strong>{resultData.totalVotes}</strong>명이 참여한 투표에서 '
              <strong>{winningOption?.voteContent || '결과 없음'}</strong>' 항목이{' '}
              <strong>{winningOption?.voteCount || 0}</strong>표를 얻어 1위로 선정되었습니다.
            </p>
            <ButtonWrapper>
              {user?.jobCode === 'J2' && (
                <ActionButton onClick={handleCreateChallenge} $primary>
                  챌린지 생성
                </ActionButton>
              )}
              <ActionButton onClick={() => navigate('/votelist')}>목록으로</ActionButton>
            </ButtonWrapper>
          </SummaryBox>
        </Footer>
      </MainContent>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`'${selectedOptionTitle}' 투표자 목록`}>
        {isLoadingVoters ? (
          <p>목록을 불러오는 중입니다...</p>
        ) : (
          <VoterList>
            {voters.length > 0 ? (
              voters.map((voter) => (
                <VoterItem key={voter.userId}>
                  {voter.userName} ({voter.userId})
                </VoterItem>
              ))
            ) : (
              <p>투표한 사용자가 없습니다.</p>
            )}
          </VoterList>
        )}
      </Modal>
    </>
  );
};

const MainContent = styled(BaseMainContent)`
  max-width: 900px;
  margin: 40px auto;
  background-color: #f9fbfc;
`;
const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 20px;
`;
const TagGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;
const TypeBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  background-color: ${(props) => (props.$type === 'LONG' ? '#20c997' : '#ff922b')};
`;
const Tag = styled.span`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  background-color: #e0f2ff;
  color: #007bff;
`;
const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;
const Info = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 15px;
  color: #666;
  strong {
    font-weight: 600;
  }
`;
const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ResultItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 200px;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  transition: all 0.2s;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};

  &:hover {
    background-color: ${(props) => (props.isClickable ? '#f8f9fa' : 'white')};
  }

  ${(props) =>
    props.$isWinner &&
    css`
      border-color: #007bff;
      box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);
      transform: scale(1.02);
    `}
`;
const Rank = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
  text-align: center;
`;
const OptionText = styled.span`
  font-size: 17px;
  font-weight: 500;
  color: #444;
`;
const ResultInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Count = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #555;
  width: 90px;
  text-align: right;
`;
const ProgressBar = styled.div`
  flex-grow: 1;
  height: 12px;
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
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$primary ? '#007bff' : '#f8f9fa')};
  color: ${(props) => (props.$primary ? 'white' : '#333')};
  border: 1px solid ${(props) => (props.$primary ? 'transparent' : '#ddd')};
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const VoterList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const VoterItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

export default VoteResult;