import React, { useState } from 'react';
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { healthService } from '../../api/health';

const MentalCareResult = () => {
  const navigate = useNavigate('');

  const [results, setResults] = useState(null); // 전체 결과 저장
  const [totalScore, setTotalScore] = useState(null);
  const [guideMessage, setGuideMessage] = useState('');

  useEffect(() => {
    async function fetchResult() {
      try {
        const userId = localStorage.getItem('userId');
        const data = await healthService.mentalresult(userId);
        setResults(data.questionScores);
        setTotalScore(data.totalScore);
        setGuideMessage(data.guideMessage);
        console.log('심리검사 받아온 데이터 : ', data);
        console.log('심리검사 받아온 가이드 메세지 : ', guideMessage);
      } catch (err) {
        console.log('심리검사 데이터를 불러오지 못했습니다.', err);
      }
    }

    fetchResult();
  }, []);

  const getOverallStatus = (score) => {
    let status = {
      text: '정보 없음',
      className: '',
      icon: FaTimesCircle,
      description: '검사 결과가 유효하지 않습니다.',
    };

    if (score >= 80 && score <= 100) {
      status = {
        text: '매우 양호',
        className: 'status-good',
        icon: FaCheckCircle,
        description:
          '현재 심리 건강 상태가 매우 양호합니다. 긍정적인 습관을 유지하시고, 꾸준히 자신을 돌보는 시간을 가지세요.',
      };
    } else if (score >= 50 && score < 80) {
      status = {
        text: '보통',
        className: 'status-caution',
        icon: FaExclamationTriangle,
        description: '일부 심리적 불편함이 있을 수 있으니 스트레스 관리에 신경 써주세요.',
      };
    } else if (score < 50) {
      status = {
        text: '주의 필요',
        className: 'status-warning',
        icon: FaTimesCircle,
        description: '심리적 어려움이 있을 수 있습니다. 전문가 상담을 고려해 보세요.',
      };
    }

    return status;
  };

  const overall = getOverallStatus(totalScore);
  const Icon = overall.icon;

  return (
    <MainContent>
      <PageTitle>
        <FaHeartbeat />
        건강관리 {'>'} 심리검사 {'>'} 심리검사 결과
      </PageTitle>

      <ContentHeader>
        <h2>심리검사 결과</h2>
        <hr />
        <Subtitle>당신의 심리 건강 상태를 확인하고, 맞춤형 가이드를 받아보세요.</Subtitle>
      </ContentHeader>

      <ResultContainer>
        <ResultSummary>
          <SummaryTitle>당신의 심리 건강 총점</SummaryTitle>
          <SummaryStatus className={overall.className}>
            <Icon style={{ marginRight: 10 }} />
            {totalScore}점 ({overall.text})
          </SummaryStatus>
          <SummaryDescription></SummaryDescription>
        </ResultSummary>

        <ResultSection>
          <SectionTitle>항목별 상세 분석</SectionTitle>
          <QuestionResultsGrid>
            {results && results.length > 0 ? (
              results.map(({ questionNo, questionText, score }) => (
                <QuestionResultItem key={questionNo}>
                  <ItemQuestion>{questionText}</ItemQuestion>
                  <ItemScore>{score}점</ItemScore>
                  <ItemInterpretation></ItemInterpretation>
                </QuestionResultItem>
              ))
            ) : (
              <p>결과가 없습니다.</p>
            )}
          </QuestionResultsGrid>
        </ResultSection>

        <RecommendationSection>
          <SectionTitle>추천 및 조언</SectionTitle>
          <p>총 점수 : {totalScore} 점</p>
          {guideMessage
            .split('\n')
            .filter((line) => !line.startsWith('총 점수')) // 총 점수 부분 필터링
            .map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
        </RecommendationSection>

        <ButtonGroup>
          <PageButton onClick={() => navigate('/healthcaremain')}>건강관리 메인</PageButton>
          <PageButton onClick={() => navigate('/mentaltest')}>검사 다시 하기</PageButton>
        </ButtonGroup>
      </ResultContainer>
    </MainContent>
  );
};

const ResultContainer = styled.div`
  padding: 20px;
  background-color: #fcfcfc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`;

const ResultSummary = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
`;

const SummaryStatus = styled.p`
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 15px;
    font-size: 0.9em;
  }

  &.status-good {
    color: #28a745;
  }
  &.status-caution {
    color: #ffc107;
  }
  &.status-warning {
    color: #dc3545;
  }
`;

const SummaryDescription = styled.p`
  font-size: 1.1em;
  color: #555;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const ResultSection = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h4`
  font-size: 1.5em;
  color: #444;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const QuestionResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const QuestionResultItem = styled.div`
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemQuestion = styled.p`
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1em;
`;

const ItemScore = styled.p`
  font-size: 1.8em;
  font-weight: bold;
  color: #1e90ff;
  margin-bottom: 10px;
`;

const ItemInterpretation = styled.p`
  font-size: 0.95em;
  color: #666;
  line-height: 1.5;
`;

const RecommendationSection = styled(ResultSection)`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
`;

export default MentalCareResult;
