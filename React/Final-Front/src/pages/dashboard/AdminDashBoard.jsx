import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import ProfileImg from '../../assets/profile.jpg';
import ChallangeImg from '../../assets/challengeImg.jpg';
import { userService } from '../../api/users';
import BoardAPI from '../../api/board';
import { challengeService } from '../../api/challengeService';
import { workationService } from '../../api/workation';
import { voteService } from '../../api/voteService';
import useUserStore from '../../Store/useStore';
import { adminService } from '../../api/admin';
import { FaUsers, FaUmbrellaBeach, FaExclamationTriangle } from 'react-icons/fa';
import { vacationAdminService } from '../../api/vacationAdmin';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const voteResponseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '투표 응답률',
      font: {
        size: 18,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const AdminDashBoard = () => {
  const [myInfoState, setMyInfoState] = useState(null);
  const [notices, setNotices] = useState([]);
  const [vacationCount, setVacationCount] = useState(0);
  const [approvedWorkations, setApprovedWorkations] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [voteResponseData, setVoteResponseData] = useState({
    labels: ['일간', '주간', '월간'],
    datasets: [
      {
        label: '응답률',
        data: [0, 0, 0],
        backgroundColor: ['#A4BEEA', '#C3E6CB', '#B2EBF2'],
        borderColor: ['#8CADDD', '#A1D6AE', '#99DDE5'],
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  });

  const [todayStatus, setTodayStatus] = useState({
    clockedIn: 0,
    absent: 0,
    workation: 0,
    late: 0,
    vacation: 0,
  });

  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.companyCode) return;

      try {
        const [
          userInfo,
          vacationData,
          workationData,
          noticeData,
          challengeData,
          todayAttendance,
          allEmployees,
          allWorkations,
          stats,
          allVacations,
        ] = await Promise.all([
          userService.getUserInfo(),
          userService.getVacationCount(user.userId),
          workationService.getApprovedWorkations(user.userId),
          BoardAPI.getNotice(user.userId),
          challengeService.getChallengeForDashBoard(user.userId),
          adminService.getTodayAttendance(user.userId),
          adminService.MemberManagement({ companyCode: user.companyCode }),
          workationService.workationFullList(user.companyCode),
          voteService.getVoteResponseRateStatistics(user.companyCode),
          vacationAdminService.getAllVacationList(user.companyCode),
        ]);

        setMyInfoState(userInfo);
        setVacationCount(vacationData);
        setApprovedWorkations(workationData);
        setNotices(noticeData.data);
        setChallenge(challengeData);

        const totalEmployeeCount = allEmployees.length;
        const lateCount = todayAttendance.filter((a) => new Date(a.attendTime).getHours() >= 9).length;
        const clockedInCount = todayAttendance.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const workationCount = allWorkations.filter((w) => {
          const startDate = new Date(w.workationStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(w.workationEndDate);
          endDate.setHours(0, 0, 0, 0);
          return w.status === 'Y' && today >= startDate && today <= endDate;
        }).length;
        
        const vacationTodayCount = allVacations.filter(v => {
          const vStart = new Date(v.startDate);
          const vEnd = new Date(v.endDate);
          vStart.setHours(0, 0, 0, 0);
          vEnd.setHours(0, 0, 0, 0);
          return v.status === 'Y' && today >= vStart && today <= vEnd;
        }).length;

        const absentCount = totalEmployeeCount - clockedInCount - workationCount - vacationTodayCount;

        setTodayStatus({
          clockedIn: clockedInCount,
          absent: absentCount > 0 ? absentCount : 0,
          workation: workationCount,
          late: lateCount,
          vacation: vacationTodayCount,
        });

        setVoteResponseData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [stats.daily.toFixed(1), stats.weekly.toFixed(1), stats.monthly.toFixed(1)],
            },
          ],
        }));
      } catch (err) {
        console.error('대시보드 데이터 로딩 중 오류 발생:', err);
      }
    };

    fetchData();
  }, [user]);

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

  const getWorkationForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return approvedWorkations.find((workation) => {
      const startDate = new Date(workation.workationStartDate);
      const endDate = new Date(workation.workationEndDate);
      return date >= startDate && date <= endDate;
    });
  };

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
                  {week.map((day, dayIndex) => {
                    const workationForDay = getWorkationForDay(day);
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();
                    const isWorkation = !!workationForDay;

                    let className = '';
                    if (isToday) {
                      className += 'today ';
                    }
                    if (isWorkation) {
                      className += 'workation ';
                    }

                    return (
                      <td key={dayIndex} className={className.trim()}>
                        <div className="day-number">{day}</div>
                        {isWorkation && <div className="workation-title">{workationForDay.workationTitle}</div>}
                      </td>
                    );
                  })}
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
                  ? `${import.meta.env.VITE_CLOUDFRONT_URL}/${myInfoState.profileImagePath}`
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
                <span>{myInfoState?.vacation}일</span>
              </dd>
            </dl>
            <dl>
              <dt>복지 포인트:</dt>
              <dd>
                <span>{myInfoState?.point}</span>(1500점 = 휴가 1일) | 현재 추가 휴가 : {vacationCount}일
              </dd>
            </dl>
          </div>
        </UserInfoCard>

        <BottomRightSection>
          <VoteResponseCard>
            <div className="chart-wrapper">
              <Bar options={voteResponseOptions} data={voteResponseData} />
            </div>
          </VoteResponseCard>

          <TodayStatusCard>
            <h3>오늘 근태 현황</h3>
            <StatusWrapper>
              <StatusItem>
                <StatusIcon>
                  <FaUsers />
                </StatusIcon>
                <StatusText>
                  <p>출근 {todayStatus.clockedIn}명</p>
                  <p>미출근 {todayStatus.absent}명</p>
                </StatusText>
              </StatusItem>
              <VerticalDivider />
              <StatusItem>
                <StatusIcon>
                  <FaUmbrellaBeach />
                </StatusIcon>
                <StatusText>
                  <p>워케이션 {todayStatus.workation}명</p>
                  <p>휴가 {todayStatus.vacation}명</p>
                </StatusText>
              </StatusItem>
              <VerticalDivider />
              <StatusItem>
                <StatusIcon>
                  <FaExclamationTriangle />
                </StatusIcon>
                <StatusText>
                  <p>지각 {todayStatus.late}명</p>
                </StatusText>
              </StatusItem>
            </StatusWrapper>
          </TodayStatusCard>
        </BottomRightSection>
      </BottomSection>
    </DashboardContainer>
  );
};

// Styled Components...
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

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const BottomRightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
    table-layout: fixed; /* 테이블 레이아웃 고정 */

    th {
      color: #777;
      padding-bottom: 15px;
      font-weight: 500;
    }

    td {
      padding: 10px 0;
      color: #555;
      cursor: pointer;
      border-radius: 8px;
      position: relative;
      vertical-align: top;
      height: 90px;
      border: 1px solid #f0f0f0;

      &:hover {
        background-color: #f0f7ff;
      }

      .day-number {
        margin-bottom: 4px;
      }

      .workation-title {
        font-size: 12px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        padding: 2px 5px;
        margin-top: 4px;
        display: inline-block;
        max-width: 90%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &.today {
        background-color: #fb3f4a;
        color: white;
        font-weight: bold;
        .workation-title {
          background-color: rgba(255, 255, 255, 0.3);
          color: black;
        }
      }

      &.workation {
        background-color: #a2d2ff;
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

const VoteResponseCard = styled(Card)`
  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  .chart-wrapper {
    width: 100%;
    height: 250px; /* 차트 높이 조절 */
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TodayStatusCard = styled(Card)`
  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StatusIcon = styled.div`
  font-size: 2.5rem;
  color: #555;
`;

const StatusText = styled.div`
  text-align: center;
  p {
    margin: 2px 0;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 60px;
  background-color: #e0e0e0;
`;

export default AdminDashBoard;