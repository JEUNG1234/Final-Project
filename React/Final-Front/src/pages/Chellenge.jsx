import React from 'react';
import styled from 'styled-components';
import { FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Chellenge = () => {
  return (
    <Container>
      <MainContent>
        <PageHeader>
          <PageTitle>
            <FaClipboardList />
            챌린지
          </PageTitle>
        </PageHeader>
        <MyChellengeAera>
          <MyChellengeButton>내 챌린지</MyChellengeButton>
        </MyChellengeAera>
        <ContentBody>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
          <ChellengeCard></ChellengeCard>
        </ContentBody>
        <Pagination>
          <PageButton>&lt;</PageButton>
          <PageButton className="active">1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>&gt;</PageButton>
        </Pagination>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 2%;
  background: #f0f7ff;
`;

const MainContent = styled.div`
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  color: #929393;
  display: flex;
  align-items: center;
  margin: 25px 35px;
  gap: 10px;

  /* React Icons는 SVG로 렌더링되므로, 직접적으로 스타일을 적용할 수 있습니다. */
  h2 {
    padding: 3% 7% 0 7%;
  }

  div {
    padding: 3% 3% 0 3%;
  }

  svg {
    color: #4d8eff;
  }
`;

const MyChellengeAera = styled.div`
  width: 100%;
  height: 50px;
  /* background-color: #5e7f9c; */
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MyChellengeButton = styled.button`
  width: 120px;
  margin: 0px 70px;
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

const ContentBody = styled.div`
  height: 70%;
  width: 100%;
  padding: 10px 50px;
  margin-top: 10px;
  /* background: #5c5c5c; */
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center; /* 수평 정렬 */
  align-items: center; /* 수직 정렬 */
  gap: 20px;
`;

const ChellengeCard = styled.div`
  width: 200px;
  height: 250px;
  border-radius: 10px;
  background-color: #f0f7ff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease; /* 부드러운 애니메이션 추가 */

  &:hover {
    background-color: #d8e5ff;
    transform: translateY(-5px); /* 살짝 위로 이동 */
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px; /* 버튼 간 간격 */
  margin-top: 20px;

  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  min-width: 35px; /* 버튼 최소 너비 */

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    font-weight: bold;
  }

  &:hover:not(.active) {
    background-color: #f0f0f0;
  }
`;
export default Chellenge;
