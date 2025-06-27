import React, { useState } from 'react';
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { healthService } from '../../api/health';

const PhysicalCareResult = () => {
  const navigate = useNavigate('');

  const [results, setResults] = useState(null); // 전체 결과 저장
  const [totalScore, setTotalScore] = useState(null);
  const [guideMessage, setGuideMessage] = useState('');

  useEffect(() => {
    async function fetchResult() {
      try {
        const userId = localStorage.getItem('userId');
        const data = await healthService.physicalresult(userId);
        setResults(data.questionScores);
        setTotalScore(data.totalScore);
        setGuideMessage(data.guideMessage);
        console.log('신체검사 받아온 데이터 : ', data);
        console.log('신체검사 받아온 가이드 메세지 : ', guideMessage);
      } catch (err) {
        console.log('신체검사 데이터를 불러오지 못했습니다.', err);
      }
    }

    fetchResult();
  }, []);

  // 총점에 따른 전반적인 상태 및 설명 (신체 질문에 맞춰 기준 변경: 높을수록 좋음)
  const getOverallStatus = (score) => {
    let status = {
      text: '정보 없음',
      className: '',
      icon: FaTimesCircle,
      description: '검사 결과가 유효하지 않습니다.',
    };

    // 신체 검사 질문은 대부분 점수가 높을수록 좋으므로, 총점 기준을 재조정
    if (score >= 80 && score <= 100) {
      // 61점 이상은 양호
      status = {
        text: '매우 양호',
        className: 'status-good',
        icon: FaCheckCircle,
        description: '현재 신체 건강 상태가 매우 양호합니다. 긍정적인 습관을 꾸준히 유지하여 건강을 지켜나가세요.',
      };
    } else if (score >= 50 && score < 80) {
      // 50점 ~ 80점은 주의 필요
      status = {
        text: '보통',
        className: 'status-caution',
        icon: FaExclamationTriangle,
        description: '일부 신체적 불편함이나 개선이 필요한 부분이 있을 수 있습니다. 적극적인 건강 관리가 필요합니다.',
      };
    } else if (score < 50) {
      // 10점 ~ 30점은 전문가 상담 권유
      status = {
        text: '주의 필요',
        className: 'status-warning',
        icon: FaTimesCircle,
        description:
          '상당한 신체적 어려움이나 건강 문제가 의심됩니다. 전문가와 상담하여 정확한 진단과 도움을 받는 것을 강력히 권유합니다.',
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
        건강관리 {'>'} 신체검사 {'>'} 신체검사 결과
      </PageTitle>

      <ContentHeader>
        <h2>신체검사 결과</h2>
        <hr />
        <Subtitle>당신의 신체 건강 상태를 확인하고, 맞춤형 가이드를 받아보세요.</Subtitle>
      </ContentHeader>

      <ResultContainer>
        <ResultSummary>
          <SummaryTitle>당신의 신체 건강 총점</SummaryTitle>
          <SummaryStatus className={overall.className}>
            <Icon style={{ marginRight: 10 }} />
            {totalScore}점 ({overall.text})
          </SummaryStatus>
          <SummaryDescription>{overall.description}</SummaryDescription>
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

        {/* 총점 기준을 재조정하여 추천 섹션 표시 여부 결정: 총점 60점 이하일 경우 추천 표시 */}
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
          <PageButton onClick={() => navigate('/physicaltest')}>검사 다시 하기</PageButton>
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
  font-size: 1.8em; /* 20px 대신 em 단위를 사용하여 반응형에 유리하게 */
  color: #333;
  margin-bottom: 15px;
`;

const SummaryStatus = styled.p`
  font-size: 2.5em; /* 30px 대신 em 단위를 사용하여 반응형에 유리하게 */
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

export default PhysicalCareResult;
