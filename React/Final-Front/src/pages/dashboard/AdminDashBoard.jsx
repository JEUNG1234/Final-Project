import React from 'react';
// Chart.js 및 react-chartjs-2 임포트
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components'; // styled-components는 여기서 임포트
import ProfileImg from '../../assets/ronaldo.jpg';
import ChallangeImg from '../../assets/challengeImg.jpg';

// Chart.js에서 사용될 요소들을 등록 (필수)
ChartJS.register(ArcElement, Tooltip, Legend);

// 달력 날짜 생성 함수
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0: 일요일, 1: 월요일

// 투표 데이터 요약 차트 데이터 및 옵션 (수정됨)
const voteDoughnutData = {
  labels: ['찬성', '반대', '기권'],
  datasets: [
    {
      data: [60, 25, 15], // 예시 투표 비율 (총 100%)
      backgroundColor: ['#28A745', '#DC3545', '#FFC107'], // 녹색 (찬성), 빨강 (반대), 노랑 (기권)
      borderColor: ['#ffffff'],
      borderWidth: 2,
    },
  ],
};

const voteDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false, // 컨테이너에 맞게 비율 조정
  plugins: {
    legend: {
      display: false, // 커스텀 범례를 사용할 것이므로 기본 범례는 숨김
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed) {
            label += context.parsed + '%';
          }
          return label;
        },
      },
    },
  },
  cutout: '50%', // 도넛 차트의 가운데 구멍 크기
};

const AdminDashBoard = () => {
  // 예시 날짜 데이터를 위해 Date 객체 사용
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0 (일) ~ 6 (토)

  const calendarDays = [];
  // 빈 칸 채우기 (일요일 시작 기준)
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // 날짜 채우기
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  // 주별로 분리
  const weeks = [];
  let currentWeek = [];
  calendarDays.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <DashboardContainer>
      {/* 상단 섹션 */}
      <TopSection>
        {/* 1. 달력 카드 */}
        <CalendarCard>
          <h3>
            {currentYear}년 {currentMonth + 1}월
          </h3>
          <table>
            <thead>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'today' : ''}`}
                    >
                      {day}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CalendarCard>

        <TopRightSection>
          {/* 2. 챌린지 카드 */}
          <ChallengeCard>
            <div className="challenge-text">
              <h4>새로 등록된 챌린지</h4>
              <p>5월 1일 ~ 5월 31일</p>
              <h2>하루 10000보 걷기</h2>
            </div>
            <div className="challenge-image">
              <img src={ChallangeImg} alt="챌린지 이미지" /> {/* Placeholder 이미지 */}
            </div>
          </ChallengeCard>

          {/* 3. 공지사항 카드 */}
          <NoticeCard>
            <h3>공지사항</h3>
            <ul>
              <li>프로젝트 마감 기한 엄수</li>
              <li>Git 병합 수정 잘 할 것</li>
              <li>6/3 회식 (역삼역 세븐일레븐)</li>
            </ul>
          </NoticeCard>
        </TopRightSection>
      </TopSection>

      {/* 하단 섹션 */}
      <BottomSection>
        {/* 4. 사용자 정보 카드 */}
        <UserInfoCard>
          <div className="user-avatar">
            <img src={ProfileImg} alt="사용자 아바타" /> {/* Placeholder 이미지 */}
          </div>
          <h2>이름: 사용자</h2>
          <div className="info-list">
            <dl>
              <dt>직급:</dt>
              <dd>사원</dd>
            </dl>
            <dl>
              <dt>소속:</dt>
              <dd>개발팀</dd>
            </dl>
            <dl>
              <dt>남은 연차 수:</dt>
              <dd>
                <span>3일</span>
              </dd>
            </dl>
            <dl>
              <dt>복지 포인트:</dt>
              <dd>
                <span>1400점</span>(1500점 = 휴가 1일)
              </dd>
            </dl>
            <dl>
              <dt></dt>
              <dd className="small">(현재 추가로 받은 휴가 일 수: 0일)</dd>
            </dl>
          </div>
        </UserInfoCard>

        <BottomRightSection>
          {/* 5. 최근 투표수 요약 카드 (수정됨) */}
          <VoteSummaryCard>
            <h3>최근 투표수 요약</h3>
            <div className="chart-wrapper">
              <Doughnut data={voteDoughnutData} options={voteDoughnutOptions} />
            </div>
            {/* 커스텀 범례 */}
            <div className="legend-list">
              <div>
                <span className="color-box" style={{ backgroundColor: '#28A745' }}></span>찬성: 60명
              </div>
              <div>
                <span className="color-box" style={{ backgroundColor: '#DC3545' }}></span>반대: 25명
              </div>
              <div>
                <span className="color-box" style={{ backgroundColor: '#FFC107' }}></span>기권: 15명
              </div>
            </div>
          </VoteSummaryCard>

          {/* 6. 오늘 직원들 출퇴근 현황 카드 (수정됨) */}
          <AttendanceStatusCard>
            <h3>오늘 직원 출퇴근 현황</h3>
            <div className="status-item">
              <span className="status-label">워케이션:</span>
              <span className="status-count workation-count">3명</span>
            </div>
            <div className="status-item">
              <span className="status-label">출근(미출근):</span>
              <span className="status-count on-site-count">25명 (2명 미출근)</span>
            </div>
            <div className="status-item">
              <span className="status-label">퇴근:</span>
              <span className="status-count clocked-out-count">20명</span>
            </div>
          </AttendanceStatusCard>
        </BottomRightSection>
      </BottomSection>
    </DashboardContainer>
  );
};

// ==========================================================
// 스타일 정의 (styled-components)
// ==========================================================

// 전체 대시보드 컨테이너
const DashboardContainer = styled.div`
  padding: 30px; /* 전체 대시보드 안쪽 여백 */
  background-color: #f0f7ff; /* 전체 배경색 */
  display: flex;
  flex-direction: column;
  gap: 30px; /* 섹션 간의 간격 */
  font-family: 'Pretendard', sans-serif; /* 폰트 설정 */
`;

// 섹션별 컨테이너 (그리드 레이아웃)
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 좌측 (달력) 1fr, 우측 (챌린지 + 공지) 1fr */
  gap: 30px; /* 컬럼 간의 간격 */

  @media (max-width: 992px) {
    grid-template-columns: 1fr; /* 화면이 작아지면 한 줄로 */
  }
`;

const TopRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 좌측 (사용자 정보) 1fr, 우측 (건강 + 출퇴근) 1fr */
  gap: 30px;
  /* Align items to stretch vertically to fill the available space */
  align-items: start; /* This helps align the top of the columns */

  @media (max-width: 992px) {
    grid-template-columns: 1fr; /* 화면이 작아지면 한 줄로 */
  }
`;

const BottomRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  /* Ensure this section also stretches if needed, though individual card heights will largely dictate it */
  height: 100%; /* Make sure it tries to fill its grid area */
`;

// 개별 카드 스타일
const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 25px; /* 기본 패딩 */
`;

// 1. 달력 카드 (Top Left)
const CalendarCard = styled(Card)`
  padding: 30px;
  min-height: 400px; /* 최소 높이 설정 */

  h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: flex;
      gap: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    text-align: center;

    th {
      color: #777;
      padding-bottom: 15px;
      font-weight: 500;
    }

    td {
      padding: 30px 0;
      color: #555;
      cursor: pointer;
      border-radius: 8px; /* 날짜 박스 둥글게 */

      &:hover {
        background-color: #f0f7ff;
      }

      &.today {
        background-color: #fb3f4a; /* 오늘 날짜 배경 */
        color: white;
        font-weight: bold;
      }

      &.highlight {
        background-color: #ffecb3; /* 특별한 날짜 (예: 휴가) */
        color: #c07000;
        font-weight: bold;
      }
    }
  }
`;

// 2. 챌린지 카드 (Top Right 상단)
const ChallengeCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #ffffff; /* 챌린지 배경색 */
  padding: 20px 25px;

  .challenge-text {
    flex-grow: 1;
    h4 {
      font-size: 30px;
      color: #2f80ed; /* 푸른색 제목 */
      margin-bottom: 5px;
    }
    p {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 28px;
      color: #333;
      font-weight: bold;
    }
  }

  .challenge-image {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: #c1e8ef; /* 이미지 플레이스홀더 배경 */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

// 3. 공지사항 카드 (Top Right 하단)
const NoticeCard = styled(Card)`
  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      font-size: 15px;
      color: #555;
      margin-bottom: 10px;
      border-bottom: 1px dashed #eee;
      padding-bottom: 10px;
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }
`;

// 4. 사용자 정보 카드 (Bottom Left)
const UserInfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px;
  box-sizing: border-box;

  .user-avatar {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background-color: #e0e0e0; /* 아바타 플레이스홀더 배경 */
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }

  .info-list {
    width: 100%;
    text-align: left;
    dl {
      display: flex;
      margin-bottom: 8px;
      font-size: 15px;

      dt {
        color: #777;
        width: 95px;
        flex-shrink: 0;
      }
      dd {
        color: #333;
        flex-grow: 1;
        span {
          font-weight: bold;
          color: #007bff; /* 포인트 색상 */
        }
        &.small {
          font-size: 12px;
          color: #888;
        }
      }
    }
  }
`;

// 5. 최근 투표수 요약 카드 (Bottom Right 상단) - 이름 변경 및 스타일 유지
const VoteSummaryCard = styled(Card)`
  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }
  .chart-wrapper {
    width: 100%;
    max-width: 200px;
    margin: 0 auto 15px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .legend-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: #555;
    div {
      display: flex;
      align-items: center;
      .color-box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        margin-right: 6px;
      }
    }
  }
  padding: 15px;
  box-sizing: border-box;
`;

// 6. 오늘 직원들 출퇴근 현황 카드 (Bottom Right 하단) - 이름 변경 및 스타일 변경
const AttendanceStatusCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  box-sizing: border-box;

  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 8px;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
    font-size: 14px;

    &:last-child {
      border-bottom: none;
    }

    .status-label {
      color: #555;
      font-weight: 500;
    }

    .status-count {
      font-size: 16px;
      font-weight: bold;
      color: #007bff; /* 기본 색상 */

      &.workation-count {
        color: #28a745; /* 워케이션은 녹색 */
      }
      &.on-site-count {
        color: #ffc107; /* 출근(미출근)은 노란색 */
      }
      &.clocked-out-count {
        color: #6c757d; /* 퇴근은 회색 */
      }
    }
  }
`;

export default AdminDashBoard;