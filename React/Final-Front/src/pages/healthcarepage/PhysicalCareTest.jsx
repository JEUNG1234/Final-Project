import React, { useState, useEffect, useRef } from 'react'; // <-- useState, useEffect, useRef 임포트
import { MainContent, PageTitle, ContentHeader, Subtitle, PageButton } from '../../styles/common/MainContentLayout';
import { FaHeartbeat } from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { healthService } from '../../api/health';

const QUESTIONS = [
  '1. 평소에 충분한 수면을 취하고 있다고 느낀다.',
  '2. 하루에 최소 30분 이상 걷거나 운동하는 습관이 있다.',
  '3. 최근 한 달 동안 특별한 통증(허리, 목, 관절 등)을 느낀 적이 없다.',
  '4. 식사는 규칙적으로 하고 있으며, 영양 균형을 고려하고 있다.',
  '5. 몸무게나 체형에 대해 건강하다고 느낀다.',
  '6. 최근 한 달간 과도한 스트레스를 느낀 적이 없다.',
  '7. 오래 앉아 있거나 서 있을 때 불편함 없이 지낼 수 있다.',
  '8. 시력이나 청력에 불편함을 느낀 적이 없다.',
  '9. 평소보다 피로감을 쉽게 느끼지 않는다.',
  '10. 전반적으로 자신의 건강 상태에 만족한다.',
];

const PhysicalCareTest = () => {
  const navigate = useNavigate();
  // 배열 길이 10, 초기값 5 (슬라이드를 위해)
  const [scores, setScores] = useState(new Array(10).fill(5));

  const handleScoreChange = (index, value) => {
    setScores((prevScores) => {
      const updated = [...prevScores];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('현재 로그인된 계정의 아이디 : ', userId);

      const response = await healthService.physicalquestion({ userId, questions: QUESTIONS, scores }); //physicalquestion으로 변경해야됨됨

      console.log('서버 응답:', response.data);

      navigate('/physicalcareresult');
    } catch (error) {
      console.error('서버 에러:', error);
      alert('서버 요청 중 문제가 발생했습니다.');
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <FaHeartbeat />
        건강관리 {'>'} 신체검사
      </PageTitle>

      <StyledContentHeader>
        <h2>신체검사</h2>
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
        <PageButton onClick={handleSubmit}>결과 확인하기</PageButton>
      </ButtonGroup>
    </MainContent>
  );
};

// ContentHeader에 hr 스타일 추가
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

// SliderWrapper는 ContentBody들을 가로로 나란히 배치하는 역할을 합니다.
const SliderWrapper = styled.div`
  display: flex;
  gap: 30px; /* ContentBody 컴포넌트들 사이의 간격 */
  margin-top: 10px;
  justify-content: center; /* ContentBody들을 가운데 정렬 */
  flex-wrap: wrap; /* 화면이 작아지면 다음 줄로 넘어가도록 */
  width: 100%; /* 부모 MainContent의 너비를 꽉 채움 */
`;

// ContentBody는 개별 질문 그룹의 컨테이너입니다.
const ContentBody = styled.div`
  flex: 1; /* ContentBodyWrapper 내에서 사용 가능한 공간을 균등하게 차지 */
  width: 500px;
  padding: 20px 20px; /* 내부 여백 */
  border-radius: 8px;
  box-sizing: border-box; /* padding이 너비에 포함되도록 */
  display: flex; /* 내부 요소들을 세로로 정렬 */
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px; /* 슬라이더 섹션들과 버튼 그룹 사이의 간격 */
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
// 각 슬라이더 섹션을 감싸는 컨테이너
const SliderSection = styled.div`
  margin-bottom: 30px; /* 각 슬라이더 섹션 간의 간격 */
  position: relative; /* 자식 absolute 요소를 위한 기준점 */
  padding: 0 10px; /* 슬라이더 좌우 여백 */
  height: 100px; /* 각 슬라이더 섹션의 높이를 고정하여 레이아웃 흔들림 방지 */

  &:last-child {
    margin-bottom: 0; /* 마지막 섹션은 아래 마진 없음 */
  }
`;

const QuestionTitle = styled.h4`
  margin-bottom: 30px; /* 질문과 슬라이더 사이 간격 */
  color: #333;
  font-size: 1.1em;
  line-height: 1.4;
`;

// 실제 Input Range 스타일링 (이전 Slider 컴포넌트의 스타일)
const StyledSliderInput = styled.input`
  width: 100%; /* 부모(SliderSection)에 맞게 꽉 채움 */
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: grab;
  outline: none;
  margin: 10px 0; /* 슬라이더 자체의 상하 마진 */

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    background: #e0e0e0;
    border-radius: 5px;
    position: relative;
    background: linear-gradient(
      to right,
      #1e90ff 0%,
      #1e90ff ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 100%
    );
  }

  &::-moz-range-track {
    height: 8px;
    background: #e0e0e0;
    border-radius: 5px;
    background: linear-gradient(
      to right,
      #1e90ff 0%,
      #1e90ff ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 ${(props) => props.$valuePercentage || 0}%,
      #e0e0e0 100%
    );
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: #1e90ff;
    border: 3px solid #fff;
    border-radius: 50%;
    margin-top: -8px; /* 트랙 위에 썸을 중앙에 위치 (높이/2 - 트랙높이/2) */
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

// 슬라이더 하단의 숫자 레이블 (1과 10만 표시)
const Labels = styled.div`
  display: flex;
  justify-content: space-between; /* 1과 10을 양 끝으로 밀어냄 */
  width: calc(100% - 20px); /* SliderSection padding을 고려하여 너비 조정 */
  margin-top: 10px; /* 슬라이더와 숫자 사이 간격 */
  font-size: 0.9em;
  color: #555;
  position: absolute;
  left: 10px; /* SliderSection padding과 동일하게 설정 */
  bottom: 0; /* SliderSection 바닥에 붙도록 */
  pointer-events: none; /* 숫자 클릭 방지 */
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

// 슬라이더 현재 값 표시 (썸 위에 나타나도록)
const CurrentValueDisplay = styled.div`
  position: absolute;
  top: 10px; /* SliderSection을 기준으로 위쪽 */
  left: 50%; /* JS에서 동적으로 위치 조정 */
  transform: translateX(-50%);
  font-weight: bold;
  color: #1e90ff;
  font-size: 1.2em;
  display: ${(props) => (props.$show ? 'block' : 'none')}; /* props로 가시성 제어 */
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

export default PhysicalCareTest;
