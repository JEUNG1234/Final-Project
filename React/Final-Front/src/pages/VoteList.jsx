import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";

const voteData = [
  { id: 4, title: '점심 메뉴 투표' },
  { id: 3, title: '회식 장소 투표하기' },
  { id: 2, title: '워크숍/야유회 장소 투표' },
  {
    id: 1,
    title: '사무실 간식, 무엇이 좋을까요?',
    options: [
      '신선한 과일 (사과, 바나나)',
      '견과류 믹스(아몬드, 호두)',
      '에너지바 / 단백질바',
      '간단한 빵 / 샌드위치',
    ],
  },
];

const Container = styled.div`
  background-color: #F0F7FF;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 32px;
  width: 600px;
  margin: 40px auto;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const VoteItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const VoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 16px;
  cursor: pointer;
`;

const VoteTitle = styled.span`
  font-weight: 600;
  width: 70%;
`;

const ResultButton = styled.button`
  border: 1px solid #ccc;
  color: black;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f3;
  }
`;



const OptionContainer = styled.div`
background-color: #f9fafb;
  padding: ${(props) => (props.isOpen ? '20px' : '0 20px')};
  max-height: ${(props) => (props.isOpen ? '500px' : '0')};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 3s ease;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;

  input {
    margin-right: 10px;
    accent-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background-color: #4d8eff;
  color: white;
  padding: 12px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3c75e0;
  }
`;

//모달 영역
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ResultBar = styled.div`
  background-color: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ResultFill = styled.div`
  height: 24px;
  background-color: #4d8eff;
  width: ${props => props.percent}%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  color: white;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  float: right;
  cursor: pointer;
`;

const VoteList = () => {
  const [openId, setOpenId] = useState(1);
  const [selected, setSelected] = useState('신선한 과일 (사과, 바나나)');
  
  //모달 보여주기
  const [showModal, setShowModal] = useState(false);

  //모달에 보여줄 투표 결과
  const [resultData, setResultData] = useState(null);

  return (
    <Container>
      <Title>투표 리스트</Title>
      {voteData.map((vote) => (
        <VoteItem key={vote.id}>
          <VoteHeader>
            <VoteTitle>{vote.id}. {vote.title}</VoteTitle>
            <ResultButton
  onClick={() => {
    if (vote.options) {
      // 예시용 퍼센트 데이터
      const fakeResults = [
        { option: '신선한 과일 (사과, 바나나)', percent: 20 },
        { option: '견과류 믹스(아몬드, 호두)', percent: 30 },
        { option: '에너지바 / 단백질바', percent: 15 },
        { option: '간단한 빵 / 샌드위치', percent: 35 },
      ];
      setResultData({ title: vote.title, results: fakeResults });
      setShowModal(true);
    }
  }}
>
  결과보기
</ResultButton>

            {showModal && resultData && (
  <ModalOverlay onClick={() => setShowModal(false)}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
      <ModalTitle>{resultData.title}</ModalTitle>
      {resultData.results.map((item, idx) => (
        <div key={idx}>
          <div style={{ marginBottom: '4px', fontWeight: 500 }}>{item.option}</div>
          <ResultBar>
            <ResultFill percent={item.percent}>
              <span>{item.percent}%</span>
            </ResultFill>
          </ResultBar>
        </div>
      ))}
    </ModalContent>
  </ModalOverlay>
)}


           {openId === vote.id ? (
      <FaCircleChevronUp onClick={() => setOpenId(null)} />
    ) : (
      <FaCircleChevronDown onClick={() => setOpenId(vote.id)} />
    )}
          </VoteHeader>
{vote.options && (
  <OptionContainer isOpen={vote.id === openId}>
    {vote.id === openId &&
      vote.options.map((option, index) => (
        <OptionLabel key={index}>
          <input
            type="radio"
            name="voteOption"
            value={option}
            checked={selected === option}
            onChange={() => setSelected(option)}
          />
          {option}
        </OptionLabel>
      ))}
    {vote.id === openId && <SubmitButton>투표하기</SubmitButton>}
  </OptionContainer>
)}
        </VoteItem>
      ))}
    </Container>
    
  );
  

  
};


export default VoteList;
