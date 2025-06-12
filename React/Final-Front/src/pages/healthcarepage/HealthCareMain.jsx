import React from 'react';
import styled from 'styled-components';
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaHeartbeat,
  FaFileAlt,
  FaChartLine,
  FaPills,
  FaMoon,
  FaRunning,
  FaBrain,
  FaUserMd,
} from 'react-icons/fa';
import { PageTitle } from '../../styles/common/MainContentLayout';
import bodyCareImage from '../../assets/bodycare.jpg';
import mentalCareImage from '../../assets/mentalcare.jpg';
import { useNavigate } from 'react-router-dom';

// Chart.js 관련 임포트 및 등록
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js에 필요한 컴포넌트들을 등록합니다.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthCareMain = () => {
  // 그래프 데이터 (예시 데이터)
  const navigate = useNavigate();
  const healthData = {
    labels: ['1차', '2차', '3차', '4차', '5차', '6차', '7차'],
    datasets: [
      {
        label: '신체 점수',
        data: [50, 20, 90, 30, 95, 40, 80], // 예시 데이터
        borderColor: colors.primary,
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4, // 곡선 부드러움
        fill: false, // 선 아래를 채우지 않음
      },
      {
        label: '심리 점수', // 두 번째 선 (예시)
        data: [70, 60, 65, 70, 68, 62, 65],
        borderColor: colors.success,
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // 그래프 옵션
  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false, // 컨테이너에 맞춰 크기 조절
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12, // 범례 폰트 크기
          },
        },
      },
      title: {
        display: false, // 차트 자체의 제목은 SectionTitle이 대체
        text: '건강 상태 변화 추이',
      },
      tooltip: {
        // 툴팁 스타일 조정
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // x축 그리드 라인 숨기기
        },
        ticks: {
          font: {
            size: 12, // x축 라벨 폰트 크기
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10, // y축 10단위로 표시
          font: {
            size: 12, // y축 라벨 폰트 크기
          },
        },
        grid: {
          color: colors.mediumGray, // y축 그리드 라인 색상
        },
      },
    },
  };

  return (
    <HealthCareContainer>
      <MainContentGrid>
        <LeftColumn>
          <Card>
            <PageTitle>
              <FaHeartbeat />
              건강관리
            </PageTitle>
            <SectionTitle>
              <FaChartLine style={{ marginRight: '10px', color: colors.primary }} />
              나의 건강 상태 결과
            </SectionTitle>
            <GraphContainer>
              <GraphWrapper>
                <Line data={healthData} options={graphOptions} />
              </GraphWrapper>

              <ImageSection>
                <StyledImage src={mentalCareImage} alt="심리 검사" />
                <StyledImage src={bodyCareImage} alt="신체 검사" />
              </ImageSection>

              <BottomButtons>
                <ActionButton onClick={() => navigate('/mentaltest')}>
                  <FaBrain style={{ marginRight: '8px' }} />
                  심리 검사
                </ActionButton>
                <ActionButton onClick={() => navigate('/physicaltest')}>
                  <FaUserMd style={{ marginRight: '8px' }} />
                  신체 검사
                </ActionButton>
              </BottomButtons>
            </GraphContainer>
          </Card>
        </LeftColumn>

        <RightColumnCard>
          <SectionTitle>자가진단 결과</SectionTitle>
          <ScoreText>총점: 42점 / 100점</ScoreText>
          <StatusText>
            <FaExclamationTriangle /> 상태: <span style={{ color: colors.warning }}>주의 단계</span>
          </StatusText>
          <p style={{ fontSize: '0.9em', color: colors.text, marginBottom: '15px' }}>
            원문 증상이 있으므로 생활습관 개선이 필요합니다.
          </p>
          <GuideSection />
          <SectionTitle style={{ fontSize: '1.2em' }}>
            <span style={{ color: colors.primary, marginRight: '8px' }}>•</span> 항목별 요약
          </SectionTitle>
          <ul>
            <ListItem color="red">
              <FaPills style={{ marginRight: '5px' }} /> 피로/무기력: 2점 - 약간의 피로 있음
            </ListItem>
            <ListItem color="orange">식욕 변화: 3점 - 식사 패턴 변화 존재</ListItem>
            <ListItem color="red">
              <FaMoon style={{ marginRight: '5px' }} /> 수면 문제: 6점 - 수면 질 저하
            </ListItem>
            <ListItem color="orange">
              <FaRunning style={{ marginRight: '5px' }} /> 운동 부족: 4점 - 활동량 부족
            </ListItem>
            <ListItem color="green">소화 불량: 1점 - 양호</ListItem>
            <ListItem color="yellow">소화 불편: 3점 - 주기적 불편감</ListItem>
            <ListItem color="red">체중/체중 변화: 8점 - 순환 이상 가능성</ListItem>
            <ListItem color="red">면역 저하: 7점 - 면역력 약화 징후</ListItem>
            <ListItem color="yellow">지구력 저하: 5점 - 피로 누적</ListItem>
            <ListItem color="orange">건강 불안감: 3점 - 약간의 걱정 존재</ListItem>

            <GuideSection />
            <SectionTitle>
              <FaLightbulb style={{ color: colors.warning, marginRight: '10px' }} /> 건강관리 가이드
            </SectionTitle>
            <ul>
              <GuideListItem>수면 루틴을 일정하게 유지하세요.</GuideListItem>
              <GuideListItem>가벼운 산책과 스트레칭을 시작해보세요.</GuideListItem>
              <GuideListItem>면역력 높이는 식단(과일, 유산균 등)을 챙기세요.</GuideListItem>
              <GuideListItem>소화기 및 순환계 불편이 계속된다면 의료 상담 권장</GuideListItem>
            </ul>
          </ul>
          <ResultButton onClick={() => navigate('/testresult')}>
            <FaFileAlt style={{ marginRight: '8px' }} />
            결과 기록
          </ResultButton>
        </RightColumnCard>
      </MainContentGrid>
    </HealthCareContainer>
  );
};

const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  info: '#17a2b8',
  warning: '#ffc107',
  danger: '#dc3545',
  success: '#28a745',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef',
  darkGray: '#343a40',
  text: '#333',
  softBlue: '#e0f2f7', // 카드 배경색 예시
};

// 메인 컨테이너
const HealthCareContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  min-height: 100vh;
  gap: 20px;
`;

const ResultButton = styled.button`
  padding: 10px 20px;
  background-color: #3b82f6;
  margin-top: 30px;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex; /* 아이콘과 텍스트를 중앙에 정렬하기 위해 */
  align-items: center; /* 아이콘과 텍스트를 세로 중앙 정렬 */
  justify-content: center;

  &:hover {
    background-color: #2563eb;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// 전체 카드 레이아웃을 위한 Grid
const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* 모바일 우선 */
  gap: 20px;

  @media (min-width: 1024px) {
    /* 더 큰 화면에서 2컬럼 */
    grid-template-columns: 2fr 1fr; /* 왼쪽 2개 카드 컬럼 : 오른쪽 1개 카드 컬럼 비율 (조절 가능) */
    align-items: start; /* 각 컬럼의 상단에 맞춰 정렬 */
  }
`;

// 왼쪽 컬럼 (두 개의 카드를 포함)
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* LeftColumn 내에서 공간을 채우도록 */
`;

// 오른쪽 긴 카드 (자가진단 결과)
const RightColumnCard = styled(Card)`
  /* 자가진단 결과 카드가 길게 늘어나도록 */
  height: auto; /* 내용에 따라 높이 자동 조절 */
  min-height: 500px; /* 최소 높이를 지정하여 좌측 카드들에 맞춰 길게 보이도록 (조절 필요) *

  /* 모바일에서는 일반 카드처럼 동작 */
  @media (max-width: 1023px) {
    min-height: unset; /* 모바일에서는 최소 높이 제한 해제 */
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.4em;
  color: ${colors.darkGray};
  margin-bottom: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ScoreText = styled.p`
  font-size: 1.2em;
  color: ${colors.text};
  margin-bottom: 10px;
  text-align: center;
`;

const StatusText = styled.p`
  font-size: 1.1em;
  color: ${colors.danger};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;

  svg {
    color: ${colors.warning};
  }
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  font-size: 0.95em;
  color: ${colors.text};
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.color || colors.darkGray};
    flex-shrink: 0;
    margin-top: 5px;
  }
`;

const GuideListItem = styled.li`
  margin-bottom: 8px;
  font-size: 0.95em;
  color: ${colors.text};
`;

// 그래프 섹션을 위한 Wrapper
const GraphWrapper = styled.div`
  position: relative;
  height: 250px; /* 그래프의 실제 높이 조절 */
  width: 100%; /* 부모 너비에 맞춤 */
  margin-bottom: 20px; /* 그래프 아래 여백 */
`;

// GraphContainer 스타일 업데이트: 이제 실제 그래프 대신 GraphWrapper를 포함합니다.
const GraphContainer = styled.div`
  height: auto; /* 내용물에 따라 높이 자동 조절 */
  background-color: ${colors.lightGray}; /* 배경색을 lightGray로 변경하여 깔끔하게 */
  border-radius: 5px;
  display: flex;
  flex-direction: column; /* 세로 방향으로 내용 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  justify-content: flex-start; /* 상단에서부터 내용 정렬 */
  color: ${colors.secondary};
  font-size: 0.9em;
  padding: 20px; /* 내부 여백 추가 */
  gap: 20px; /* 내부 요소들 사이 간격 */
`;

// 이미지 섹션 (GraphContainer 내부에 있으므로 margin-bottom 제거 또는 조정)
const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%; /* 부모(GraphContainer) 너비를 최대한 활용 */
`;

const StyledImage = styled.img`
  max-width: 350px;
  max-height: 250px; /* 높이를 살짝 줄여서 너무 크지 않도록 */
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 280px;
`;

// 하단 버튼 섹션 (GraphContainer 내부에 있으므로 margin-bottom 제거 또는 조정)
const BottomButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #4d82d2;
  }
`;

const GuideSection = styled.div`
  padding-top: 10px;
  border-top: 1px solid ${colors.mediumGray}; /* 구분선 */

  ${SectionTitle} {
    /* GuideSection 내 SectionTitle 중앙 정렬 해제 */
    justify-content: flex-start;
  }
`;

export default HealthCareMain;
