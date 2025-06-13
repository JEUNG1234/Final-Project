import React from 'react';
// Chart.js 및 react-chartjs-2 임포트
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components'; // styled-components는 여기서 임포트
import ProfileImg from '../assets/ronaldo.jpg';
import ChallangeImg from '../assets/challengeImg.jpg';

// Chart.js에서 사용될 요소들을 등록 (필수)
ChartJS.register(ArcElement, Tooltip, Legend);

// 달력 날짜 생성 함수
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0: 일요일, 1: 월요일

// 건강 데이터 요약 차트 데이터 및 옵션
const healthDoughnutData = {
  labels: ['수면 시간', '걸음 수', '스트레스 지수'],
  datasets: [
    {
      data: [35, 55, 10], // 예시 비율
      backgroundColor: ['#28A745', '#007BFF', '#FFC107'], // 녹색, 파랑, 노랑
      borderColor: ['#ffffff'],
      borderWidth: 2,
    },
  ],
};

const healthDoughnutOptions = {
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

// ==========================================================
// 메인 대시보드 컴포넌트
// ==========================================================
const MemberDashBoard = () => {
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
          {/* 5. 건강 데이터 요약 카드 */}
          <HealthDataCard>
            <h3>최근 건강 데이터 요약</h3>
            <div className="chart-wrapper">
              <Doughnut data={healthDoughnutData} options={healthDoughnutOptions} />
            </div>
            {/* 커스텀 범례 */}
            <div className="legend-list">
              <div>
                <span className="color-box" style={{ backgroundColor: '#28A745' }}></span>수면 시간: 9시간
              </div>
              <div>
                <span className="color-box" style={{ backgroundColor: '#007BFF' }}></span>걸음 수: 3000보
              </div>
              <div>
                <span className="color-box" style={{ backgroundColor: '#FFC107' }}></span>스트레스 지수: 중간
              </div>
            </div>
          </HealthDataCard>

          {/* 6. 출퇴근 시간 카드 */}
          <AttendanceTimeCard>
            <div>
              <span>출근 시간 : </span>
              <span className="time">08 : 53</span>
              <button className="check-in">출근</button>
            </div>
            <div>
              <span>퇴근 시간 : </span>
              <span className="time">-</span>
              <button className="check-out">퇴근</button>
            </div>
          </AttendanceTimeCard>
        </BottomRightSection>
      </BottomSection>
    </DashboardContainer>
  );
};

export default MemberDashBoard;

// ==========================================================
// 스타일 정의 (styled-components)
// ==========================================================

// 전체 대시보드 컨테이너
const DashboardContainer = styled.div`
  padding: 25px; /* 전체 대시보드 안쪽 여백 */
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

  @media (max-width: 992px) {
    grid-template-columns: 1fr; /* 화면이 작아지면 한 줄로 */
  }
`;

const BottomRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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

  .user-avatar {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: #e0e0e0; /* 아바타 플레이스홀더 배경 */
    margin-bottom: 20px;
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
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .info-list {
    width: 100%;
    text-align: left;
    dl {
      display: flex;
      margin-bottom: 10px;
      font-size: 15px;

      dt {
        color: #777;
        width: 80px; /* 라벨 너비 고정 */
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
          font-size: 13px;
          color: #888;
        }
      }
    }
  }
`;

// 5. 건강 데이터 요약 (Bottom Right 상단)
const HealthDataCard = styled(Card)`
  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  .chart-wrapper {
    width: 100%;
    max-width: 250px; /* 차트 최대 너비 */
    margin: 0 auto 20px; /* 중앙 정렬 */
    height: 200px; /* 차트 컨테이너 높이 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .legend-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    color: #555;
    div {
      display: flex;
      align-items: center;
      .color-box {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        margin-right: 8px;
      }
    }
  }
`;

// 6. 출퇴근 시간 카드 (Bottom Right 하단)
const AttendanceTimeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    color: #333;
    font-weight: 500;

    .time {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;

      &.check-in {
        background-color: #28a745; /* 녹색 */
        &:hover {
          background-color: #218838;
        }
      }
      &.check-out {
        background-color: #dc3545; /* 빨강 */
        &:hover {
          background-color: #c82333;
        }
      }
    }
  }
`;
