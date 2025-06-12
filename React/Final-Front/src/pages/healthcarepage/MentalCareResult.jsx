import React from 'react';
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MentalCareResult = () => {
  const navigate = useNavigate('');
  const mockResults = {
    q1: 7, // 피로/무기력
    q2: 5, // 위장 불편함
    q3: 8, // 수면 문제
    q4: 6, // 통증
    q5: 4, // 가슴 답답함
    q6: 3, // 자율신경계 반응
    q7: 7, // 식욕 변화
    q8: 8, // 감정 조절 어려움
    q9: 5, // 피부/탈모/알레르기
    q10: 9, // 의욕 저하, 무기력
  };

  // 임의의 결과 데이터를 기반으로 총점 계산
  const totalScore = Object.values(mockResults).reduce((sum, score) => sum + score, 0);

  const questions = [
    '나는 내 감정을 스스로 잘 조절할 수 있다고 느낀다.',
    '최근 들어 우울하거나 무기력한 기분을 자주 느낀다.',
    '나는 내 삶에 만족감을 느낀다.',
    '사소한 일에도 쉽게 불안하거나 긴장하게 된다.',
    '다른 사람과의 관계에서 편안함을 느낀다.',
    '나 자신에 대한 신뢰와 자존감이 있다.',
    '최근에 혼자 있고 싶다는 생각을 자주 한다.',
    '나는 미래에 대한 희망이나 기대감을 가지고 있다.',
    '감정이 자주 요동치고 이유 없이 기분이 다운될 때가 있다.',
    '일상에서 즐거움을 느끼는 일이 자주 있다.',
  ];

  // 각 점수 범위에 따른 해석 및 조언 (예시, 이전과 동일)
  const getInterpretation = (questionIndex, score) => {
    const defaultInterpretation = '해당 항목의 일반적인 상태입니다.';
    const interpretations = {
      0: {
        1: '감정 조절에 어려움을 겪고 있을 수 있습니다. 감정을 이해하고 표현하는 연습이 필요합니다.',
        4: '감정을 조절하는 데 때때로 어려움을 느낍니다. 감정 관리 방법을 탐색해 보세요.',
        7: '대부분의 상황에서 감정을 잘 조절하는 편입니다. 꾸준히 자신을 돌아보는 시간을 가지세요.',
        10: '감정 조절 능력이 매우 뛰어납니다. 당신의 강점입니다!',
      },
      1: {
        1: '우울하거나 무기력한 기분을 거의 느끼지 않는 편입니다. 현재의 긍정적인 상태를 유지하세요.',
        4: '가끔 우울감이나 무기력감을 느낍니다. 감정 변화에 주의를 기울여 보세요.',
        7: '우울하거나 무기력한 기분을 자주 느낍니다. 감정 전환을 위한 활동이나 휴식이 필요할 수 있습니다.',
        10: '매우 자주 우울하거나 무기력한 기분을 느끼고 있습니다. 전문가의 도움이 필요할 수 있습니다.',
      },
      2: {
        1: '삶에 대한 만족감이 낮은 편입니다. 당신에게 진정으로 중요한 것이 무엇인지 탐색해 보세요.',
        4: '삶에 대한 만족도가 평균 수준입니다. 작은 성취에도 기쁨을 느끼는 연습이 도움이 됩니다.',
        7: '삶에 대체로 만족하고 있습니다. 긍정적인 면을 더욱 강화해 보세요.',
        10: '삶에 대한 만족감이 매우 높습니다. 당신의 삶을 잘 이끌어가고 있습니다.',
      },
      3: {
        1: '불안이나 긴장을 거의 느끼지 않는 편입니다. 평온한 마음을 잘 유지하고 있습니다.',
        4: '가끔 사소한 일에 불안감을 느낍니다. 불안의 원인을 파악해 보는 것이 좋습니다.',
        7: '쉽게 불안하거나 긴장하는 경향이 있습니다. 이완 기법이나 스트레스 관리 연습이 도움이 될 수 있습니다.',
        10: '매우 쉽게 불안하거나 긴장하여 일상생활에 영향을 미칩니다. 불안 관리를 위한 전문가 상담을 고려해 보세요.',
      },
      4: {
        1: '관계에서 불편함이나 어려움을 자주 느낍니다. 관계 개선을 위한 노력이 필요할 수 있습니다.',
        4: '관계에서 때때로 불편함을 느낍니다. 소통 방식을 점검해 보는 것이 좋습니다.',
        7: '대부분의 관계에서 편안함을 느낍니다. 좋은 관계를 유지하고 계십니다.',
        10: '사람들과의 관계에서 매우 편안함을 느끼고 긍정적인 관계를 맺고 있습니다.',
      },
      5: {
        1: '자신에 대한 신뢰나 자존감이 낮은 편입니다. 스스로의 강점과 가치를 찾아보세요.',
        4: '자존감이 평균 수준입니다. 자신을 긍정적으로 바라보는 연습이 필요합니다.',
        7: '자신에 대한 신뢰와 자존감이 높은 편입니다. 당신의 능력을 믿고 나아가세요.',
        10: '자신에 대한 신뢰와 자존감이 매우 높습니다. 긍정적인 자기 인식이 당신의 큰 자산입니다.',
      },
      6: {
        1: '혼자만의 시간을 건강하게 즐기고, 타인과의 교류에도 적극적입니다.',
        4: '때때로 혼자만의 시간을 선호하지만, 고립감을 느끼지는 않습니다.',
        7: '혼자 있고 싶다는 생각을 자주 하며 사회적 교류가 줄어들고 있을 수 있습니다. 고립되지 않도록 주의하고, 필요한 경우 주변에 도움을 요청하세요.',
        10: '매우 자주 혼자 있고 싶어 하며, 타인과의 접촉을 피하는 경향이 강합니다. 외로움이나 고립감이 심화될 수 있으니 주변의 관심과 전문가의 도움이 필요합니다.',
      },
      7: {
        1: '미래에 대한 희망이나 기대감이 낮은 편입니다. 작은 목표부터 세워 성취감을 느껴보는 것이 좋습니다.',
        4: '미래에 대한 기대감이 보통 수준입니다. 긍정적인 변화를 상상해 보세요.',
        7: '미래에 대한 희망과 기대감을 가지고 있습니다. 계획을 세우고 실행하며 발전해 나가세요.',
        10: '미래에 대한 희망과 기대감이 매우 높습니다. 당신의 밝은 미래를 응원합니다.',
      },
      8: {
        1: '감정 기복이 적고 비교적 안정적인 기분을 유지합니다.',
        4: '가끔 감정 기복을 느끼지만, 대체로 잘 조절합니다.',
        7: '감정이 자주 요동치고 기분이 급격히 다운될 때가 많습니다. 감정 일기를 써보거나 전문가와 상담을 고려해 보세요.',
        10: '감정 조절이 매우 어렵고, 이유 없이 기분이 심하게 다운되는 경우가 빈번합니다. 전문가의 진단과 도움이 시급합니다.',
      },
      9: {
        1: '일상에서 즐거움을 느끼기 어렵습니다. 작은 기쁨을 찾으려는 노력이 필요합니다.',
        4: '가끔 일상에서 즐거움을 느끼지만, 더 많은 활력이 필요해 보입니다.',
        7: '일상에서 즐거움을 자주 느끼는 편입니다. 긍정적인 에너지를 잘 유지하고 있습니다.',
        10: '일상에서 매우 자주 즐거움을 느끼고 있습니다. 삶을 긍정적으로 바라보는 당신의 태도는 큰 강점입니다.',
      },
    };

    const relevantInterpretations = interpretations[questionIndex];
    if (relevantInterpretations) {
      if (score >= 10) return relevantInterpretations[10];
      if (score >= 7) return relevantInterpretations[7];
      if (score >= 4) return relevantInterpretations[4];
      if (score >= 1) return relevantInterpretations[1];
    }
    return defaultInterpretation;
  };

  // 총점에 따른 전반적인 상태 및 설명 (이전과 동일)
  const getOverallStatus = (score) => {
    let status = {
      text: '정보 없음',
      className: '',
      icon: FaTimesCircle,
      description: '검사 결과가 유효하지 않습니다.',
    };

    if (score >= 10 && score <= 30) {
      status = {
        text: '양호',
        className: 'status-good',
        icon: FaCheckCircle,
        description:
          '현재 심리 건강 상태가 매우 양호합니다. 긍정적인 습관을 유지하시고, 꾸준히 자신을 돌보는 시간을 가지세요.',
      };
    } else if (score > 30 && score <= 60) {
      status = {
        text: '주의 필요',
        className: 'status-caution',
        icon: FaExclamationTriangle,
        description:
          '일부 심리적 불편함을 겪고 있을 수 있습니다. 스트레스 관리, 충분한 휴식 등 적극적인 자기 관리가 필요합니다.',
      };
    } else if (score > 60 && score <= 100) {
      status = {
        text: '전문가 상담 권유',
        className: 'status-warning',
        icon: FaTimesCircle,
        description:
          '상당한 심리적 어려움을 겪고 있을 가능성이 높습니다. 전문가와 상담하여 정확한 진단과 도움을 받는 것을 강력히 권유합니다.',
      };
    }
    return status;
  };

  const overall = getOverallStatus(totalScore);

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

        {totalScore > 30 && ( // 총점이 높을 경우에만 추천 섹션 표시 (임의의 기준)
          <RecommendationSection>
            <SectionTitle>추천 및 조언</SectionTitle>
            <p>당신의 현재 심리 상태를 개선하기 위해 다음과 같은 방법을 고려해 볼 수 있습니다.</p>
            <ul>
              <li>스트레스 관리: 규칙적인 운동, 명상, 취미 활동 등으로 스트레스를 해소하세요.</li>
              <li>충분한 수면: 규칙적인 수면 패턴을 유지하고, 잠들기 전 스마트폰 사용을 자제하세요.</li>
              <li>건강한 식습관: 균형 잡힌 식단을 통해 몸과 마음에 필요한 영양소를 공급하세요.</li>
              <li>사회적 관계: 주변 사람들과 교류하며 긍정적인 관계를 유지하세요.</li>
              <li>전문가 상담: 심리적 어려움이 지속된다면 정신건강의학과 전문의나 심리 상담 전문가와 상담해 보세요.</li>
              <li>햇볕 쬐기: 매일 15-30분 정도 햇볕을 쬐는 것은 기분 개선에 도움이 됩니다.</li>
            </ul>
          </RecommendationSection>
        )}

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
