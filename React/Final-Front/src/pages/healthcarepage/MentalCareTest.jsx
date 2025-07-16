import React, { useState, useEffect, useRef } from 'react';
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { healthService } from '../../api/health';
import { toast } from 'react-toastify';

const QUESTIONS = [
  '1. 나는 내 감정을 스스로 잘 조절할 수 있다고 느낀다.',
  '2. 최근 들어 우울하거나 무기력한 기분을 자주 느낀다.',
  '3. 나는 내 삶에 만족감을 느낀다.',
  '4. 사소한 일에도 쉽게 불안하거나 긴장하게 된다.',
  '5. 다른 사람과의 관계에서 편안함을 느낀다.',
  '6. 나 자신에 대한 신뢰와 자존감이 있다.',
  '7. 최근에 혼자 있고 싶다는 생각을 자주 한다.',
  '8. 나는 미래에 대한 희망이나 기대감을 가지고 있다.',
  '9. 감정이 자주 요동치고 이유 없이 기분이 다운될 때가 있다.',
  '10. 일상에서 즐거움을 느끼는 일이 자주 있다.',
];

const MentalCareTest = () => {
  const navigate = useNavigate();
  // 배열 길이 10, 초기값 5 (슬라이드를 위해)
  const [scores, setScores] = useState(new Array(10).fill(5));
  const [loading, setLoading] = useState(false);

  const handleScoreChange = (index, value) => {
    setScores((prevScores) => {
      const updated = [...prevScores];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (loading) return; // 중복 클릭 방지

    setLoading(true); // 버튼 비활성화
    toast.info('현재 AI에게 심리검사를 요청중입니다. 잠시만 기다려주세요...');

    try {
      const userId = sessionStorage.getItem('userId');
      const response = await healthService.mentalquestion({ userId, questions: QUESTIONS, scores });
      console.log('서버 응답:', response.data);
      navigate('/mentalcareresult');
    } catch (error) {
      console.error('서버 에러:', error);
      toast.error('서버 요청 중 문제가 발생했습니다.');
    } finally {
      setLoading(false); // 필요하면 다시 활성화
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <FaHeartbeat /> 건강관리 {'>'} 심리검사
      </PageTitle>

      <StyledContentHeader>
        <h2>심리검사</h2>
        <hr />
        <Subtitle>현재 건강 데이터를 입력하고 AI로부터 맞춤형 건강 가이드를 받아보세요.</Subtitle>
      </StyledContentHeader>

      <ContentStatus>
        <Subtitle>1부터 10까지 자신의 상태를 선택해 주세요.</Subtitle>
        <Subtitle>1 : 전혀 그렇지 않다 - 10 : 매우 그렇다</Subtitle>
      </ContentStatus>

      <SliderWrapper>
        <ContentBody>
          {QUESTIONS.slice(0, 5).map((q, i) => (
            <SliderWithLabels
              key={i}
              question={q}
              min={1}
              max={10}
              value={scores[i]}
              onChange={(val) => handleScoreChange(i, val)}
            />
          ))}
        </ContentBody>

        <ContentBody>
          {QUESTIONS.slice(5).map((q, i) => (
            <SliderWithLabels
              key={i + 5}
              question={q}
              min={1}
              max={10}
              value={scores[i + 5]}
              onChange={(val) => handleScoreChange(i + 5, val)}
            />
          ))}
        </ContentBody>
      </SliderWrapper>

      <ButtonGroup>
        <PageButton onClick={() => navigate('/healthcaremain')}>뒤로가기</PageButton>
        <PageButton onClick={handleSubmit} disabled={loading}>
          {loading ? '처리 중...' : '결과 확인하기'}
        </PageButton>
      </ButtonGroup>
    </MainContent>
  );
};

const StyledContentHeader = styled(ContentHeader)`
  h2 {
    margin-bottom: 5px;
  }
`;

const ContentStatus = styled.div`
  margin-top: 10px;
  ${Subtitle} {
    margin-bottom: 5px;
    font-size: 0.95em;
    color: #666;
  }
`;

const SliderWrapper = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 10px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

const ContentBody = styled.div`
  flex: 1;
  width: 500px;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
`;

const SliderWithLabels = ({ question, min, max, value, onChange }) => {
  const sliderRef = useRef(null);
  const [showValue, setShowValue] = useState(false);
  const [thumbPosition, setThumbPosition] = useState('0px');
  const [valuePercentage, setValuePercentage] = useState(0);

  const labelsToShow = [min, max];

  const updateThumbPosition = (currentValue) => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const thumbWidth = 24;
      const range = max - min;
      const percentage = (currentValue - min) / range;
      const newPosition = percentage * (sliderWidth - thumbWidth) + thumbWidth / 2;
      setThumbPosition(`${newPosition}px`);
      setValuePercentage(percentage * 100);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => updateThumbPosition(value), 50);
    const handleResize = () => updateThumbPosition(value);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [value, min, max]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    updateThumbPosition(newValue);
    onChange?.(newValue);
  };

  return (
    <SliderSection>
      <QuestionTitle>{question}</QuestionTitle>
      <CurrentValueDisplay $show={showValue} style={{ left: thumbPosition }}>
        {value}
      </CurrentValueDisplay>
      <StyledSliderInput
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        value={value}
        step="1"
        onChange={handleSliderChange}
        onMouseDown={() => setShowValue(true)}
        onMouseUp={() => setShowValue(false)}
        onTouchStart={() => setShowValue(true)}
        onTouchEnd={() => setShowValue(false)}
        $valuePercentage={valuePercentage}
      />
      <Labels>
        {labelsToShow.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </Labels>
    </SliderSection>
  );
};

const SliderSection = styled.div`
  margin-bottom: 30px;
  position: relative;
  padding: 0 10px;
  height: 100px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const QuestionTitle = styled.h4`
  margin-bottom: 30px;
  color: #333;
  font-size: 1.1em;
  line-height: 1.4;
`;

const StyledSliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: grab;
  outline: none;
  margin: 10px 0;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    background: linear-gradient(
      to right,
      #1e90ff 0%,
      #1e90ff ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 100%
    );
    border-radius: 5px;
  }

  &::-moz-range-track {
    height: 8px;
    background: linear-gradient(
      to right,
      #1e90ff 0%,
      #1e90ff ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 100%
    );
    border-radius: 5px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #1e90ff;
    border: 3px solid #fff;
    border-radius: 50%;
    margin-top: -8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    transition: transform 0.1s ease;
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #1e90ff;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
  }

  &:hover::-webkit-slider-thumb,
  &:hover::-moz-range-thumb {
    transform: scale(1.1);
  }
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
  margin-top: 10px;
  font-size: 0.9em;
  color: #555;
  position: absolute;
  left: 10px;
  bottom: 0;
  pointer-events: none;
  box-sizing: border-box;

  span {
    flex-shrink: 0;
  }

  span:first-child {
    text-align: left;
    margin-right: auto;
  }

  span:last-child {
    text-align: right;
    margin-left: auto;
  }
`;

const CurrentValueDisplay = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: #1e90ff;
  font-size: 1.2em;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

export default MentalCareTest;
