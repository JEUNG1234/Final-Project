import React from 'react';
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PhysicalCareResult = () => {
  const navigate = useNavigate(); // useNavigate 훅 호출에 인자 필요 없음 (오류 수정)

  // 새로운 신체 검사 질문 양식에 맞춘 임의의 결과 데이터
  const mockResults = {
    q1: 8, // 평소에 충분한 수면을 취하고 있다고 느낀다. (높을수록 좋음)
    q2: 7, // 하루에 최소 30분 이상 걷거나 운동하는 습관이 있다. (높을수록 좋음)
    q3: 3, // 최근 한 달 동안 특별한 통증(허리, 목, 관절 등)을 느낀 적이 없다. (낮을수록 좋음)
    q4: 9, // 식사는 규칙적으로 하고 있으며, 영양 균형을 고려하고 있다. (높을수록 좋음)
    q5: 8, // 몸무게나 체형에 대해 건강하다고 느낀다. (높을수록 좋음)
    q6: 4, // 최근 한 달간 과도한 스트레스를 느낀 적이 없다. (낮을수록 좋음)
    q7: 7, // 오래 앉아 있거나 서 있을 때 불편함 없이 지낼 수 있다. (높을수록 좋음)
    q8: 9, // 시력이나 청력에 불편함을 느낀 적이 없다. (낮을수록 좋음)
    q9: 4, // 평소보다 피로감을 쉽게 느끼지 않는다. (낮을수록 좋음)
    q10: 9, // 전반적으로 자신의 건강 상태에 만족한다. (높을수록 좋음)
  };

  // 임의의 결과 데이터를 기반으로 총점 계산
  const totalScore = Object.values(mockResults).reduce((sum, score) => sum + score, 0);

  // 신체 검사 질문 정의 (새로운 질문 양식)
  const questions = [
    '평소에 충분한 수면을 취하고 있다고 느낀다.', // 긍정 질문: 높을수록 좋음
    '하루에 최소 30분 이상 걷거나 운동하는 습관이 있다.', // 긍정 질문: 높을수록 좋음
    '최근 한 달 동안 특별한 통증(허리, 목, 관절 등)을 느낀 적이 없다.', // 부정 질문: 낮을수록 좋음
    '식사는 규칙적으로 하고 있으며, 영양 균형을 고려하고 있다.', // 긍정 질문: 높을수록 좋음
    '몸무게나 체형에 대해 건강하다고 느낀다.', // 긍정 질문: 높을수록 좋음
    '최근 한 달간 과도한 스트레스를 느낀 적이 없다.', // 부정 질문: 낮을수록 좋음
    '오래 앉아 있거나 서 있을 때 불편함 없이 지낼 수 있다.', // 긍정 질문: 높을수록 좋음
    '시력이나 청력에 불편함을 느낀 적이 없다.', // 부정 질문: 낮을수록 좋음
    '평소보다 피로감을 쉽게 느끼지 않는다.', // 부정 질문: 낮을수록 좋음
    '전반적으로 자신의 건강 상태에 만족한다.', // 긍정 질문: 높을수록 좋음
  ];

  // 각 점수 범위에 따른 해석 및 조언 (신체 질문에 맞춰 내용 변경)
  const getInterpretation = (questionIndex, score) => {
    const defaultInterpretation = '해당 항목의 일반적인 상태입니다.';
    const interpretations = {
      // 질문 1: 평소에 충분한 수면을 취하고 있다고 느낀다. (높을수록 좋음)
      0: {
        1: '수면이 충분하지 않거나 수면의 질이 좋지 않을 수 있습니다. 규칙적인 수면 습관이 필요합니다.',
        4: '때때로 수면이 부족하다고 느낍니다. 수면 환경을 점검해 보세요.',
        7: '대체로 충분한 수면을 취하고 있습니다. 좋은 수면 습관을 유지하세요.',
        10: '매우 충분하고 질 좋은 수면을 취하고 있어 신체 회복에 큰 도움이 됩니다!',
      },
      // 질문 2: 하루에 최소 30분 이상 걷거나 운동하는 습관이 있다. (높을수록 좋음)
      1: {
        1: '활동량이 매우 적은 편입니다. 건강을 위해 규칙적인 운동 습관을 시작하는 것이 좋습니다.',
        4: '운동량이 부족할 수 있습니다. 점진적으로 활동량을 늘려보세요.',
        7: '꾸준히 운동하는 좋은 습관을 가지고 있습니다. 건강 유지에 큰 도움이 됩니다.',
        10: '매일 꾸준히 운동하며 매우 활동적인 생활을 하고 있습니다. 훌륭합니다!',
      },
      // 질문 3: 최근 한 달 동안 특별한 통증(허리, 목, 관절 등)을 느낀 적이 없다. (낮을수록 좋음)
      2: {
        1: '통증이 거의 없어 신체적으로 매우 편안한 상태입니다.',
        4: '가끔 불편함을 느끼지만 일상에 큰 지장은 없습니다.',
        7: '통증을 자주 느끼는 편입니다. 자세 교정, 스트레칭 또는 전문가의 진료를 고려해 보세요.',
        10: '만성적인 통증으로 일상생활에 어려움을 겪고 있습니다. 정밀 진단과 치료가 필요할 수 있습니다.',
      },
      // 질문 4: 식사는 규칙적으로 하고 있으며, 영양 균형을 고려하고 있다. (높을수록 좋음)
      3: {
        1: '식사가 불규칙하거나 영양 균형이 좋지 않은 편입니다. 건강한 식습관을 위한 노력이 필요합니다.',
        4: '식습관에 개선이 필요한 부분이 있습니다. 영양소를 골고루 섭취하도록 노력하세요.',
        7: '대체로 규칙적이고 균형 잡힌 식사를 하고 있습니다. 건강한 식습관을 잘 유지하고 계십니다.',
        10: '매우 규칙적이고 영양 균형을 고려한 식사를 하고 있습니다. 당신의 건강한 습관이 신체 건강의 기반입니다!',
      },
      // 질문 5: 몸무게나 체형에 대해 건강하다고 느낀다. (높을수록 좋음)
      4: {
        1: '몸무게나 체형에 대한 불만족도가 높고, 건강에 대한 우려가 있습니다. 전문가와 상담해 보세요.',
        4: '몸무게나 체형에 대해 개선이 필요하다고 느낍니다. 꾸준한 관리와 노력이 필요합니다.',
        7: '자신의 몸무게와 체형에 대해 대체로 건강하다고 느낍니다. 좋은 자기 인식을 가지고 있습니다.',
        10: '자신의 몸무게와 체형에 매우 만족하며 건강한 상태를 유지하고 있습니다. 긍정적인 신체 이미지를 가지고 있습니다!',
      },
      // 질문 6: 최근 한 달간 과도한 스트레스를 느낀 적이 없다. (낮을수록 좋음)
      5: {
        1: '스트레스를 거의 느끼지 않고 평온한 상태를 유지하고 있습니다.',
        4: '가끔 스트레스를 느끼지만 잘 관리하고 있습니다.',
        7: '과도한 스트레스를 자주 경험하고 있습니다. 스트레스 해소 방법을 찾아 실천하는 것이 중요합니다.',
        10: '매우 심한 스트레스를 지속적으로 느끼고 있습니다. 전문가의 도움을 받아 스트레스를 관리하는 것이 시급합니다.',
      },
      // 질문 7: 오래 앉아 있거나 서 있을 때 불편함 없이 지낼 수 있다. (높을수록 좋음)
      6: {
        1: '오래 앉거나 서 있을 때 불편함을 자주 느낍니다. 활동량 증진이나 자세 교정이 필요할 수 있습니다.',
        4: '때때로 불편함을 느끼지만 참을 만합니다. 스트레칭을 꾸준히 해보세요.',
        7: '오래 앉거나 서 있어도 큰 불편함이 없습니다. 신체 활동 능력이 양호합니다.',
        10: '어떤 자세에서도 불편함 없이 편안하게 지낼 수 있습니다. 매우 건강한 신체 능력을 가지고 있습니다!',
      },
      // 질문 8: 시력이나 청력에 불편함을 느낀 적이 없다. (낮을수록 좋음)
      7: {
        1: '시력이나 청력에 불편함을 거의 느끼지 않습니다. 감각 기관이 건강한 상태입니다.',
        4: '가끔 시력이나 청력에 미세한 불편함을 느낍니다. 정기 검진을 고려해 보세요.',
        7: '시력이나 청력에 불편함을 자주 느끼고 있습니다. 전문의 진료를 받아보는 것이 좋습니다.',
        10: '시력이나 청력에 심각한 불편함을 겪고 있습니다. 빠른 시일 내에 전문가의 도움이 필요합니다.',
      },
      // 질문 9: 평소보다 피로감을 쉽게 느끼지 않는다. (낮을수록 좋음)
      8: {
        1: '피로감을 거의 느끼지 않으며 활력이 넘치는 상태입니다.',
        4: '가끔 피로를 느끼지만 금방 회복합니다. 컨디션 관리가 양호합니다.',
        7: '평소보다 피로감을 쉽게 느끼는 편입니다. 충분한 휴식과 에너지 보충이 필요합니다.',
        10: '매우 심한 피로감을 지속적으로 느끼고 있으며, 만성 피로가 의심됩니다. 전문가의 진단과 휴식이 매우 중요합니다.',
      },
      // 질문 10: 전반적으로 자신의 건강 상태에 만족한다. (높을수록 좋음)
      9: {
        1: '전반적인 건강 상태에 대한 만족도가 낮습니다. 자신의 건강을 위한 적극적인 노력이 필요합니다.',
        4: '건강 상태에 대해 평균적으로 만족합니다. 건강한 습관을 더욱 강화해 보세요.',
        7: '전반적으로 자신의 건강 상태에 만족하고 있습니다. 긍정적인 건강 인식을 가지고 있습니다.',
        10: '자신의 건강 상태에 매우 만족하고 있습니다. 건강 관리를 매우 잘하고 계십니다!',
      },
    };

    const relevantInterpretations = interpretations[questionIndex];
    if (relevantInterpretations) {
      // 점수가 높을수록 긍정적인 질문 (1, 2, 4, 5, 7, 10번 질문)
      const positiveQuestions = [0, 1, 3, 4, 6, 9]; // index 기준
      if (positiveQuestions.includes(questionIndex)) {
        if (score >= 9) return relevantInterpretations[10]; // 9-10점
        if (score >= 6) return relevantInterpretations[7]; // 6-8점
        if (score >= 3) return relevantInterpretations[4]; // 3-5점
        return relevantInterpretations[1]; // 1-2점
      }
      // 점수가 낮을수록 긍정적인 질문 (3, 6, 8, 9번 질문)
      else {
        // negativeQuestions
        if (score <= 2) return relevantInterpretations[1]; // 1-2점
        if (score <= 5) return relevantInterpretations[4]; // 3-5점
        if (score <= 8) return relevantInterpretations[7]; // 6-8점
        return relevantInterpretations[10]; // 9-10점
      }
    }
    return defaultInterpretation;
  };

  // 총점에 따른 전반적인 상태 및 설명 (신체 질문에 맞춰 기준 변경: 높을수록 좋음)
  const getOverallStatus = (score) => {
    let status = {
      text: '정보 없음',
      className: '',
      icon: FaTimesCircle,
      description: '검사 결과가 유효하지 않습니다.',
    };

    // 신체 검사 질문은 대부분 점수가 높을수록 좋으므로, 총점 기준을 재조정
    if (score >= 61 && score <= 100) {
      // 61점 이상은 양호
      status = {
        text: '양호',
        className: 'status-good',
        icon: FaCheckCircle,
        description: '현재 신체 건강 상태가 매우 양호합니다. 긍정적인 습관을 꾸준히 유지하여 건강을 지켜나가세요.',
      };
    } else if (score >= 31 && score <= 60) {
      // 31점 ~ 60점은 주의 필요
      status = {
        text: '주의 필요',
        className: 'status-caution',
        icon: FaExclamationTriangle,
        description: '일부 신체적 불편함이나 개선이 필요한 부분이 있을 수 있습니다. 적극적인 건강 관리가 필요합니다.',
      };
    } else if (score >= 10 && score <= 30) {
      // 10점 ~ 30점은 전문가 상담 권유
      status = {
        text: '전문가 상담 권유',
        className: 'status-warning',
        icon: FaTimesCircle,
        description:
          '상당한 신체적 어려움이나 건강 문제가 의심됩니다. 전문가와 상담하여 정확한 진단과 도움을 받는 것을 강력히 권유합니다.',
      };
    }
    return status;
  };

  const overall = getOverallStatus(totalScore);

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
            <overall.icon /> {totalScore}점 ({overall.text})
          </SummaryStatus>
          <SummaryDescription>{overall.description}</SummaryDescription>
        </ResultSummary>

        <ResultSection>
          <SectionTitle>항목별 상세 분석</SectionTitle>
          <QuestionResultsGrid>
            {questions.map((questionText, index) => {
              const questionKey = `q${index + 1}`;
              const score = mockResults[questionKey]; // 임의의 결과 사용
              return (
                <QuestionResultItem key={questionKey}>
                  <ItemQuestion>
                    {index + 1}. {questionText}
                  </ItemQuestion>
                  <ItemScore>{score}점</ItemScore>
                  <ItemInterpretation>{getInterpretation(index, score)}</ItemInterpretation>
                </QuestionResultItem>
              );
            })}
          </QuestionResultsGrid>
        </ResultSection>

        {/* 총점 기준을 재조정하여 추천 섹션 표시 여부 결정: 총점 60점 이하일 경우 추천 표시 */}
        {totalScore <= 60 && (
          <RecommendationSection>
            <SectionTitle>추천 및 조언</SectionTitle>
            <p>당신의 현재 신체 건강 상태를 개선하기 위해 다음과 같은 방법을 고려해 볼 수 있습니다.</p>
            <ul>
              <li>규칙적인 운동: 매일 30분 이상 걷기, 조깅, 수영 등 유산소 운동과 근력 운동을 병행하세요.</li>
              <li>
                균형 잡힌 식단: 신선한 채소, 과일, 통곡물, 단백질 위주로 섭취하고, 가공식품과 당류 섭취를 줄이세요.
              </li>
              <li>충분한 수면: 성인은 하루 7-9시간의 규칙적인 수면을 취하는 것이 중요합니다.</li>
              <li>스트레스 관리: 명상, 요가, 취미 활동 등을 통해 스트레스를 효과적으로 해소하세요.</li>
              <li>정기적인 건강 검진: 이상 징후를 조기에 발견하고 예방하기 위해 정기적으로 건강 검진을 받으세요.</li>
              <li>
                전문가 상담: 만성 통증, 소화 불량, 수면 장애 등 신체적 불편함이 지속된다면 전문의와 상담하여 정확한
                진단과 치료를 받으세요.
              </li>
            </ul>
          </RecommendationSection>
        )}

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
