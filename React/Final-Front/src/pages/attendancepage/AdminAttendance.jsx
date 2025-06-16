import React from 'react';
import styled from 'styled-components';

// Chart.js 및 react-chartjs-2 임포트
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Pagination, BottomBar, PageButton, PageTitle } from '../../styles/common/MainContentLayout';
import { FaCalendarAlt } from 'react-icons/fa';

// Chart.js에서 사용될 요소들을 등록 (필수)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// 1. 금주 근태 비율 도넛 차트 데이터
const donutChartData = {
  labels: ['정상', '지각', '결근', '조퇴'],
  datasets: [
    {
      data: [85, 10, 3, 2], // 예시 비율
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#FF9800'], // 녹색, 노랑, 빨강, 주황
      borderColor: ['#ffffff'],
      borderWidth: 2,
    },
  ],
};

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // 컨테이너에 맞게 비율 조정
  plugins: {
    legend: {
      position: 'bottom', // 범례를 하단에 배치
      labels: {
        boxWidth: 12, // 범례 색상 박스 너비
        padding: 15, // 범례 아이템 간 간격
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed) {
            label += context.parsed + '%'; // 퍼센트 표시
          }
          return label;
        },
      },
    },
  },
  cutout: '60%', // 도넛 차트의 가운데 구멍 크기
};

// 2. 주간/월간 근태 분포 누적 막대 그래프 데이터 (예시: 지난 7일)
const barChartData = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '정상 출근',
      data: [18, 19, 17, 18, 16, 5, 2], // 월별 정상 출근 인원
      backgroundColor: '#4CAF50', // 녹색
    },
    {
      label: '지각',
      data: [2, 1, 3, 2, 4, 0, 0], // 월별 지각 인원
      backgroundColor: '#FFC107', // 노랑
    },
    {
      label: '결근',
      data: [0, 0, 0, 0, 0, 0, 0], // 월별 결근 인원
      backgroundColor: '#F44336', // 빨강
    },
    {
      label: '휴가/연차',
      data: [0, 0, 0, 0, 0, 15, 18], // 월별 휴가/연차 인원 (주말 반영)
      backgroundColor: '#2196F3', // 파랑
    },
    {
      label: '미기록',
      data: [0, 0, 0, 0, 0, 0, 0], // 월별 미기록 인원
      backgroundColor: '#9E9E9E', // 회색
    },
  ],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false, // 제목은 h3 태그로 대체
      text: '주간/월간 근태 분포',
    },
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 15,
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true, // 막대 누적
      grid: {
        display: false, // X축 그리드 라인 숨김
      },
    },
    y: {
      stacked: true, // 막대 누적
      beginAtZero: true,
      title: {
        display: true,
        text: '직원 수',
      },
    },
  },
};

const AdminAttendance = () => {
  return (
    <AttendanceManagementContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>
          <FaCalendarAlt />
          근태 관리
        </PageTitle>
        <SearchFilterArea>
          <input type="date" placeholder="날짜 검색" />
          <input type="text" placeholder="직원명 검색" />
          <select>
            <option value="">부서/팀 선택</option>
            <option value="development">개발팀</option>
            <option value="marketing">마케팅팀</option>
            <option value="hr">인사팀</option>
          </select>
          <button>조회</button>
        </SearchFilterArea>
      </PageHeader>

      {/* 상단 요약/대시보드 영역 */}
      <SummaryDashboard>
        <SummaryCard>
          <h3>오늘 근태 현황</h3>
          <p>총 20명 | 정상 18명 | 지각 2명 | 결근 5명 | 휴가 5명</p>
          {/* 실제 데이터와 아이콘은 추후 동적으로 바인딩 */}
        </SummaryCard>
        <SummaryCard>
          <h3>평균 근무 시간</h3>
          <p>주간: 8.5시간 (↑0.2h) | 월간: 8.2시간 (↓0.1h)</p>
          {/* 실제 데이터와 아이콘은 추후 동적으로 바인딩 */}
        </SummaryCard>
        <SummaryCard>
          <h3>금주 근태 비율</h3>
          <ChartContainer>
            {/* ChartPlaceholder 대신 Doughnut 차트 렌더링 */}
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </ChartContainer>
          {/* ChartLegend는 Doughnut options에서 범례를 관리하므로 제거합니다. */}
        </SummaryCard>
      </SummaryDashboard>

      {/* 하단 상세 조회 영역 - 그래프 */}
      <DetailChartArea>
        <h3>주간/월간 근태 분포</h3>
        <ChartContainer height="250px">
          {/* ChartPlaceholder 대신 Bar 차트 렌더링 */}
          <Bar data={barChartData} options={barChartOptions} />
        </ChartContainer>
      </DetailChartArea>

      {/* 하단 상세 조회 영역 - 테이블 */}
      <DetailTableArea>
        <h3>직원별 상세 출퇴근 기록</h3>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>직원명</th>
              <th>부서/팀</th>
              <th>출근 시간</th>
              <th>퇴근 시간</th>
              <th>근무 시간</th>
              <th>출퇴근 여부</th>
              <th>날짜</th>
              <th>비고</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {/* 예시 데이터 (실제로는 API 호출로 받아온 데이터를 map 함수로 렌더링) */}
            <tr>
              <td>1</td>
              <td>김철수</td>
              <td>개발팀</td>
              <td>08:30</td>
              <td>-</td>
              <td>-</td>
              <td>미기록</td>
              <td>2025/03/01</td>
              <td></td>
              <td>
                <TableActionButton>수정</TableActionButton>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>이영희</td>
              <td>마케팅팀</td>
              <td>08:42</td>
              <td>18:10</td>
              <td>9시간 28분</td>
              <td>정상 출근</td>
              <td>2025/02/29</td>
              <td></td>
              <td>
                <TableActionButton>수정</TableActionButton>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>박민수</td>
              <td>인사팀</td>
              <td>09:12</td>
              <td>18:05</td>
              <td>8시간 53분</td>
              <td>지각</td>
              <td>2025/02/28</td>
              <td>교통 체증</td>
              <td>
                <TableActionButton>수정</TableActionButton>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>김철수</td>
              <td>개발팀</td>
              <td>08:50</td>
              <td>18:03</td>
              <td>9시간 13분</td>
              <td>정상 출근</td>
              <td>2025/02/27</td>
              <td></td>
              <td>
                <TableActionButton>수정</TableActionButton>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>이영희</td>
              <td>마케팅팀</td>
              <td>08:52</td>
              <td>18:00</td>
              <td>9시간 8분</td>
              <td>정상 출근</td>
              <td>2025/02/26</td>
              <td></td>
              <td>
                <TableActionButton>수정</TableActionButton>
              </td>
            </tr>
            {/* 더 많은 데이터 */}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <BottomBar>
          <Pagination>
            <PageButton>&lt;</PageButton>
            <PageButton className="active">1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>4</PageButton>
            <PageButton>&gt;</PageButton>
          </Pagination>
        </BottomBar>
      </DetailTableArea>
    </AttendanceManagementContainer>
  );
};

const AttendanceManagementContainer = styled.div`
  padding: 20px;
  background-color: #f0f7ff; /* 연한 배경색 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
`;

const SearchFilterArea = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  input,
  select {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    font-family: 'Pretendard', sans-serif;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff; /* 파란색 버튼 */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const SummaryDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* 반응형 그리드 */
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    font-size: 18px;
    color: #555;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #333;
    line-height: 1.5;
  }
`;

// ChartPlaceholder 대신 ChartContainer 사용 (이름 변경)
const ChartContainer = styled.div`
  height: ${(props) => props.height || '120px'}; /* 기본 높이 120px, prop으로 조절 가능 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const ChartLegend = styled.p`
  font-size: 12px;
  color: #6c757d;
  margin-top: 10px;
  text-align: center;
`;

const DetailChartArea = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;

  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
`;

const DetailTableArea = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow-x: auto; /* 테이블이 넘칠 경우 스크롤바 */

  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    text-align: left;
    margin-bottom: 20px;
  }

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: #555;
    white-space: nowrap; /* 헤더 텍스트 줄바꿈 방지 */
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }
`;

const TableActionButton = styled.button`
  padding: 6px 12px;
  background-color: #6c757d; /* 회색 버튼 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #5a6268;
  }
`;

export default AdminAttendance;
