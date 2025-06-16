import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FaPoll } from 'react-icons/fa';
import { FaCircleChevronDown, FaCircleChevronUp } from 'react-icons/fa6';
import { MainContent as BaseMainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 외부로 초기 데이터 분리
const initialChallengeVoteData = [
  { id: 4, title: '3월 건강 챌린지', options: null, tag: null, dDay: null, points: null, voted: false },
  { id: 3, title: '4월 건강 챌린지', options: null, tag: null, dDay: null, points: null, voted: false },
  { id: 2, title: '5월 건강 챌린지', options: null, tag: '단기 챌린지', dDay: null, points: 100, voted: false },
  {
    id: 1,
    title: '6월 건강 챌린지',
    options: [
      '헬스장 매일 가기',
      '주말마다 등산 가기',
      '점심메뉴 다 같이 식단하기(샐러드 OR 포케)',
      '1일 10000보 걷기',
    ],
    tag: '장기 챌린지',
    dDay: 'D-3',
    points: 300,
    voted: false, // 투표 여부 상태 추가
  },
];

const VoteList = () => {
  // 데이터를 state로 관리하여 'voted' 상태를 변경할 수 있도록 수정
  const [challengeData, setChallengeData] = useState(initialChallengeVoteData);
  const [openId, setOpenId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
    // 항목을 열 때, 아직 선택한 옵션이 없으면 첫 번째 옵션을 기본 선택으로 설정
    if (!selectedOptions[id]) {
      const vote = challengeData.find((v) => v.id === id);
      if (vote && vote.options) {
        setSelectedOptions((prev) => ({ ...prev, [id]: vote.options[0] }));
      }
    }
  };

  const handleOptionChange = (voteId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [voteId]: option }));
  };

  // 투표하기 버튼 클릭 시 처리할 함수
  const handleVote = (voteId) => {
    if (!selectedOptions[voteId]) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }
    // 해당 투표의 'voted' 상태를 true로 변경
    setChallengeData((prevData) =>
      prevData.map((vote) => (vote.id === voteId ? { ...vote, voted: true } : vote))
    );
    alert('투표가 완료되었습니다!');
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
        {challengeData.map((vote) => (
          <VoteItem key={vote.id}>
            <VoteHeader onClick={() => handleToggle(vote.id)}>
              <VoteTitleWrapper>
                <VoteNumber>{vote.id}</VoteNumber>
                <VoteTitle>{vote.title}</VoteTitle>
                {vote.tag && <Tag type={vote.tag}>{vote.tag}</Tag>}
                {vote.points && <Tag type={vote.tag}>{vote.points}P</Tag>}
              </VoteTitleWrapper>
              <ActionWrapper>
                <ResultButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/voteresult/${vote.id}`);
                  }}
                >
                  결과보기
                </ResultButton>
                {vote.dDay && <Dday>{vote.dDay}</Dday>}
                {openId === vote.id ? <FaCircleChevronUp /> : <FaCircleChevronDown />}
              </ActionWrapper>
            </VoteHeader>

            {vote.options && (
              <OptionContainer isOpen={openId === vote.id}>
                {vote.options.map((option, index) => (
                  <OptionLabel key={index}>
                    <input
                      type="radio"
                      name={`vote_option_${vote.id}`}
                      value={option}
                      checked={selectedOptions[vote.id] === option}
                      onChange={() => handleOptionChange(vote.id, option)}
                      disabled={vote.voted} // voted 상태에 따라 비활성화
                    />
                    {option}
                  </OptionLabel>
                ))}
                <SubmitButton 
                  onClick={() => handleVote(vote.id)} 
                  disabled={vote.voted} // voted 상태에 따라 비활성화
                >
                  {vote.voted ? '투표 완료' : '투표하기'}
                </SubmitButton>
              </OptionContainer>
            )}
          </VoteItem>
        ))}
      </VoteListWrapper>
    </MainContent>
  );
};

// --- Styled Components (SubmitButton 수정) ---

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
    props.type === '장기 챌린지' &&
    css`
      background-color: #e7f5ee;
      color: #28a745;
    `}
  
  ${(props) =>
    props.type === '단기 챌린지' &&
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