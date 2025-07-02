import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import ProfileImg from '../../assets/profile.jpg';
import ChallangeImg from '../../assets/challengeImg.jpg';
import { userService } from '../../api/users';
import BoardAPI from '../../api/board';
import { challengeService } from '../../api/challengeService';

ChartJS.register(ArcElement, Tooltip, Legend);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const voteDoughnutData = {
  labels: ['찬성', '반대', '기권'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ['#28A745', '#DC3545', '#FFC107'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    },
  ],
};

const voteDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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
  cutout: '50%',
};

const AdminDashBoard = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const weeks = [];
  let currentWeek = [];
  calendarDays.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const [notices, setNotices] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [myInfoState, setMyInfoState] = useState(null);
  const [vacationCount, setVacationCount] = useState(0); // 휴가 일수 상태 추가

  const myInfo = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const [userInfo, vacationData] = await Promise.all([
            userService.getUserInfo(userId),
            userService.getVacationCount(userId)
        ]);
        setMyInfoState(userInfo);
        setVacationCount(vacationData);
    } catch (err) {
        console.log('계정 또는 휴가 정보를 불러오지 못했습니다.', err);
    }
  };

  const getChallengeForDashBoard = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await challengeService.getChallengeForDashBoard(userId);
      setChallenge(response);
    } catch (err) {
      console.log('대시보드에 챌린지 가져오기 실패', err);
    }
  };

  const getNotice = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await BoardAPI.getNotice(userId);
      setNotices(response.data);
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
    }
  };

  useEffect(() => {
    myInfo();
    getNotice();
    getChallengeForDashBoard();
  }, []);

  return (
    <DashboardContainer>
      <TopSection>
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
          <ChallengeCard>
            {challenge ? (
              <>
                <div className="challenge-text">
                  <h4>새로 등록된 챌린지</h4>
                  <p>
                    {challenge.startDate} ~ {challenge.endDate}
                  </p>
                  <h2>{challenge.completeTitle}</h2>
                </div>
                <div className="challenge-image">
                  <img src={ChallangeImg} alt="챌린지 이미지" />
                </div>
              </>
            ) : (
              <div className="challenge-text" style={{ padding: '20px', textAlign: 'center' }}>
                <h4>새로 등록된 챌린지</h4>
                <p>챌린지 정보가 없습니다.</p>
              </div>
            )}
          </ChallengeCard>
          <NoticeCard>
            <h3>공지사항</h3>
            {notices.length > 0 ? (
              <ul>
                {notices.map((notice) => (
                  <li key={notice.boardNo}>{notice.boardTitle}</li>
                ))}
              </ul>
            ) : (
              <p>공지사항이 없습니다.</p>
            )}
          </NoticeCard>
        </TopRightSection>
      </TopSection>

      <BottomSection>
        <UserInfoCard>
          <div className="user-avatar">
            <img
              src={
                myInfoState?.profileImagePath
                  ? `https://d1qzqzab49ueo8.cloudfront.net/${myInfoState.profileImagePath}`
                  : ProfileImg
              }
              alt="사용자 아바타"
            />
          </div>
          <h2>이름: {myInfoState?.userName}</h2>
          <div className="info-list">
            <dl>
              <dt>직급:</dt>
              <dd>{myInfoState?.jobName}</dd>
            </dl>
            <dl>
              <dt>소속:</dt>
              <dd>{myInfoState?.deptName}</dd>
            </dl>
            <dl>
                <dt>남은 연차 수:</dt>
                <dd>
                    <span>{vacationCount}일</span>
                </dd>
            </dl>
            <dl>
                <dt>복지 포인트:</dt>
                <dd>
                    <span>{myInfoState?.point}</span>(1500점 = 휴가 1일)
                </dd>
            </dl>
          </div>
        </UserInfoCard>

        <BottomRightSection>
          <VoteSummaryCard>
            <h3>최근 투표수 요약</h3>
            <div className="chart-wrapper">
              <Doughnut data={voteDoughnutData} options={voteDoughnutOptions} />
            </div>
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

const DashboardContainer = styled.div`
  padding: 25px;
  background-color: #f0f7ff;
  display: flex;
  flex-direction: column;
  gap: 30px;
  font-family: 'Pretendard', sans-serif;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const TopRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const BottomRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 55px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 25px;
`;

const CalendarCard = styled(Card)`
  padding: 30px;
  min-height: 400px;

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
      border-radius: 8px;

      &:hover {
        background-color: #f0f7ff;
      }

      &.today {
        background-color: #fb3f4a;
        color: white;
        font-weight: bold;
      }

      &.highlight {
        background-color: #ffecb3;
        color: #c07000;
        font-weight: bold;
      }
    }
  }
`;

const ChallengeCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #ffffff;
  padding: 20px 25px;
  min-height: 300px;
  min-width: 500px;

  .challenge-text {
    flex-grow: 1;
    h4 {
      font-size: 30px;
      color: #2f80ed;
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
    background-color: #c1e8ef;
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

const NoticeCard = styled(Card)`
  min-height: 250px;
  padding: 20px;
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

const UserInfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .user-avatar {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: #e0e0e0;
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
        width: 100px;
        flex-shrink: 0;
      }
      dd {
        color: #333;
        flex-grow: 1;
        span {
          font-weight: bold;
          color: #007bff;
        }
        &.small {
          font-size: 13px;
          color: #888;
        }
      }
    }
  }
`;

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
      color: #007bff;

      &.workation-count {
        color: #28a745;
      }
      &.on-site-count {
        color: #ffc107;
      }
      &.clocked-out-count {
        color: #6c757d;
      }
    }
  }
`;

export default AdminDashBoard;