import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaHeartbeat,
  FaFileAlt,
  FaChartLine,
  FaBrain,
  FaUserMd,
} from 'react-icons/fa';
import { PageTitle } from '../../styles/common/MainContentLayout';
import { useNavigate } from 'react-router-dom';
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
import { healthService } from '../../api/health';
import mentalCareImage from '../../assets/mentalcare.jpg';
import bodyCareImage from '../../assets/bodycare.jpg';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthCareMain = () => {
  const navigate = useNavigate();
  const [recentResult, setRecentResult] = useState(null);
  const [questionScores, setQuestionScores] = useState([]);
  const [historyScores, setHistoryScores] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = sessionStorage.getItem('userId');
        const history = await healthService.getAllResultList({ page: 0, size: 10 });
        const sorted = history.content.sort((a, b) => b.medicalCheckResultNo - a.medicalCheckResultNo);
        setHistoryScores(history.content);
        const latest = sorted[0];
        setRecentResult(latest);

        if (latest?.medicalCheckType === '신체검사') {
          const detail = await healthService.physicalresult(userId);
          setQuestionScores(detail.questionScores);
        } else if (latest?.medicalCheckType === '심리검사') {
          const detail = await healthService.mentalresult(userId);
          setQuestionScores(detail.questionScores);
        }
      } catch (error) {
        console.error('건강검사 데이터를 불러오는 데 실패했습니다.', error);
      }
    }
    fetchData();
  }, []);

  const getStatusText = (score) => {
    if (score >= 80) return '매우 양호';
    if (score >= 50) return '보통';
    return '주의 단계';
  };

  const getStatusColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getStatusDescription = (score) => {
    if (score >= 80) return '현재 건강 상태가 매우 양호합니다. 꾸준히 유지해 주세요.';
    if (score >= 50) return '건강 상태는 보통입니다. 규칙적인 운동과 식습관을 유지해 보세요.';
    return '건강 상태가 좋지 않습니다. 전문가 상담이 권장됩니다.';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'green';
    if (score >= 5) return 'orange';
    return 'red';
  };

  const sortedHistoryScores = [...historyScores].sort(
    (a, b) => new Date(a.medicalCheckCreateDate) - new Date(b.medicalCheckCreateDate)
  );

  const historyGraphData = {
    labels: sortedHistoryScores.map((item) => dayjs(item.medicalCheckCreateDate).format('MM/DD')),
    datasets: [
      {
        label: '신체검사',
        data: historyScores
          .filter((item) => item.medicalCheckType === '신체검사')
          .map((item) => item.medicalCheckTotalScore),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: '심리검사',
        data: historyScores
          .filter((item) => item.medicalCheckType === '심리검사')
          .map((item) => item.medicalCheckTotalScore),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <HealthCareContainer>
      <MainContentGrid>
        <LeftColumn>
          <Card>
            <PageTitle>
              <FaHeartbeat /> 건강관리
            </PageTitle>
            <SectionTitle>
              <FaChartLine style={{ marginRight: '10px' }} /> 최근 건강 점수 이력
            </SectionTitle>
            <GraphContainer>
              <GraphWrapper>
                <Line data={historyGraphData} options={graphOptions} />
              </GraphWrapper>
              <ImageSection>
                <StyledImage src={mentalCareImage} alt="심리 검사" />
                <StyledImage src={bodyCareImage} alt="신체 검사" />
              </ImageSection>
              <BottomButtons>
                <ActionButton onClick={() => navigate('/mentaltest')}>
                  <FaBrain style={{ marginRight: '8px' }} /> 심리 검사
                </ActionButton>
                <ActionButton onClick={() => navigate('/physicaltest')}>
                  <FaUserMd style={{ marginRight: '8px' }} /> 신체 검사
                </ActionButton>
              </BottomButtons>
            </GraphContainer>
          </Card>
        </LeftColumn>

        <RightColumnCard>
          <SectionTitle>최근 자가진단 결과</SectionTitle>
          {recentResult ? (
            <>
              <ScoreText>총점: {recentResult.medicalCheckTotalScore}점 / 100점</ScoreText>
              <StatusText>
                <FaExclamationTriangle /> 상태:{' '}
                <span style={{ color: getStatusColor(recentResult.medicalCheckTotalScore) }}>
                  {getStatusText(recentResult.medicalCheckTotalScore)}
                </span>
              </StatusText>
              <p style={{ fontSize: '0.9em', color: '#555' }}>
                {getStatusDescription(recentResult.medicalCheckTotalScore)}
              </p>
              <SectionTitle>항목별 요약</SectionTitle>
              <ul>
                {questionScores.map((q, idx) => (
                  <ListItem key={q.questionNo} color={getScoreColor(q.score)}>
                    Q{idx + 1}. {q.questionText} - {q.score}점
                  </ListItem>
                ))}
              </ul>
              <SectionTitle>
                <FaLightbulb style={{ color: '#ffc107', marginRight: '10px' }} /> 건강관리 가이드
              </SectionTitle>
              <ul>
                {recentResult.guideMessage
                  .split('\n')
                  .filter((line) => line.trim() && !line.startsWith('총 점수'))
                  .map((line, idx) => (
                    <GuideListItem key={idx}>{line}</GuideListItem>
                  ))}
              </ul>
            </>
          ) : (
            <p>최근 건강 정보가 없습니다.</p>
          )}
          <ResultButton onClick={() => navigate('/testresult')}>
            <FaFileAlt style={{ marginRight: '8px' }} /> 결과 기록
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
