import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FaPoll } from 'react-icons/fa';
import { FaCircleChevronDown, FaCircleChevronUp } from 'react-icons/fa6';
import { MainContent as BaseMainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { useNavigate } from 'react-router-dom';
import { voteService } from '../../api/voteService';
import useUserStore from '../../Store/useStore';

const VoteList = () => {
  const [voteList, setVoteList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchVotes = async () => {
      if (!user?.userId) {
        // alert('로그인이 필요합니다.');
        // navigate('/login');
        return;
      }
      try {
        const data = await voteService.getAllVotes(user.userId);
        setVoteList(data);
      } catch (error) {
        console.error('투표 목록 조회 실패:', error);
        alert('투표 목록을 불러오는 데 실패했습니다.');
      }
    };
    fetchVotes();
  }, [user, navigate]);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleOptionChange = (voteId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [voteId]: optionId }));
  };

  const handleVote = async (voteNo) => {
    const selectedOptionNo = selectedOptions[voteNo];
    if (!selectedOptionNo) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }
    try {
      await voteService.castVote(voteNo, selectedOptionNo, user.userId);
      alert('투표가 완료되었습니다!');
      // Optimistic UI Update: 서버를 기다리지 않고 UI를 먼저 업데이트
      setVoteList((prevList) =>
        prevList.map((vote) =>
          vote.voteNo === voteNo
            ? {
                ...vote,
                isVoted: true,
                totalVotes: vote.totalVotes + 1,
                options: vote.options.map((opt) =>
                  opt.voteContentNo === selectedOptionNo ? { ...opt, voteCount: opt.voteCount + 1 } : opt
                ),
              }
            : vote
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || '투표 처리 중 오류가 발생했습니다.');
      console.error('투표 실패:', error);
    }
  };

  // D-day 계산 함수
  const calculateDday = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff < 0) return '종료';
    const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `D-${dDay}`;
  };

  return (
    <MainContent>
      <PageTitle>
        <FaPoll /> 투표
      </PageTitle>
      <ComponentHeader>
        <ComponentTitle>챌린지 투표</ComponentTitle>
        <Description>모든 응답은 익명으로 처리됩니다. 마음 편히 의견을 들려주세요.</Description>
      </ComponentHeader>
      <ButtonContainer>
        <CreateButton onClick={() => navigate('/votecreate')}>투표 생성</CreateButton>
      </ButtonContainer>
      <VoteListWrapper>
        {voteList.map((vote) => (
          <VoteItem key={vote.voteNo}>
            <VoteHeader onClick={() => handleToggle(vote.voteNo)}>
              <VoteTitleWrapper>
                <VoteNumber>{vote.voteNo}</VoteNumber>
                <VoteTitle>{vote.voteTitle}</VoteTitle>
                <Tag type={vote.voteType}>{vote.voteType === 'LONG' ? '장기' : '단기'}</Tag>
              </VoteTitleWrapper>
              <ActionWrapper>
                <ResultButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/voteresult/${vote.voteNo}`);
                  }}
                >
                  결과보기
                </ResultButton>
                <Dday>{calculateDday(vote.voteEndDate)}</Dday>
                {openId === vote.voteNo ? <FaCircleChevronUp /> : <FaCircleChevronDown />}
              </ActionWrapper>
            </VoteHeader>
            <OptionContainer isOpen={openId === vote.voteNo}>
              {vote.options.map((option, index) => (
                <OptionLabel key={index}>
                  <input
                    type="radio"
                    name={`vote_option_${vote.voteNo}`}
                    value={option.voteContentNo}
                    checked={selectedOptions[vote.voteNo] === option.voteContentNo}
                    onChange={() => handleOptionChange(vote.voteNo, option.voteContentNo)}
                    disabled={vote.isVoted}
                  />
                  {option.voteContent} ({option.voteCount}표)
                </OptionLabel>
              ))}
              <SubmitButton onClick={() => handleVote(vote.voteNo)} disabled={vote.isVoted}>
                {vote.isVoted ? '투표 완료' : '투표하기'}
              </SubmitButton>
            </OptionContainer>
          </VoteItem>
        ))}
      </VoteListWrapper>
    </MainContent>
  );
};

// --- Styled Components (이하 동일) ---
const MainContent = styled(BaseMainContent)`
  margin: 30px auto;
`;
const ComponentHeader = styled.div`
  margin: 15px 0 20px 0;
  text-align: center;
`;
const ComponentTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;
const Description = styled.p`
  font-size: 15px;
  color: #888;
  margin-top: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #007bff;
  display: inline-block;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const CreateButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0056b3;
  }
`;
const VoteListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const VoteItem = styled.div`
  border: 1px solid #cce4ff;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;
const VoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  svg {
    font-size: 22px;
    color: #a0a0a0;
  }
`;
const VoteTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const VoteNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #555;
  margin-right: 12px;
`;
const VoteTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;
const Tag = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  ${(props) =>
    props.type === 'LONG' &&
    css`
      background-color: #e7f5ee;
      color: #28a745;
    `}
  ${(props) =>
    props.type === 'SHORT' &&
    css`
      background-color: #fff8e1;
      color: #f59e0b;
    `}
`;
const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;
const ResultButton = styled.button`
  background-color: #4d8eff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #3c75e0;
  }
`;
const Dday = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;
const OptionContainer = styled.div`
  padding: ${(props) => (props.isOpen ? '20px 20px 20px 52px' : '0 20px 0 52px')};
  background-color: #f7faff;
  border-top: 1px solid #e9e9e9;
  max-height: ${(props) => (props.isOpen ? '500px' : '0')};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #444;
  input[type='radio'] {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    accent-color: #007bff;
    &:disabled {
      accent-color: #ccc;
    }
  }
`;
const SubmitButton = styled.button`
  background-color: ${(props) => (props.disabled ? '#adb5bd' : '#007bff')};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;
  &:hover {
    background-color: ${(props) => (props.disabled ? '#adb5bd' : '#0056b3')};
  }
`;

export default VoteList;