import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import ProfileImg from '../../assets/profile.jpg';
import ChallangeImg from '../../assets/challengeImg.jpg';
import { userService } from '../../api/users';
import { attendanceService } from '../../api/attendance';
import BoardAPI from '../../api/board';
import { challengeService } from '../../api/challengeService';
import { workationService } from '../../api/workation';

ChartJS.register(ArcElement, Tooltip, Legend);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const healthDoughnutData = {
    labels: ['수면 시간', '걸음 수', '스트레스 지수'],
    datasets: [
        {
            data: [35, 55, 10],
            backgroundColor: ['#28A745', '#007BFF', '#FFC107'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
        },
    ],
};

const healthDoughnutOptions = {
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

const MemberDashBoard = () => {
    const [attendance, setAttendance] = useState({
        attendanceTime: null,
        leaveTime: null,
        status: null,
    });
    const [myInfoState, setMyInfoState] = useState(null);
    const [notices, setNotices] = useState([]);
    const [vacationCount, setVacationCount] = useState(0); // 휴가 일수 상태 추가
    const [approvedWorkations, setApprovedWorkations] = useState([]); // 승인된 워케이션 목록 상태 추가

    const myInfo = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const [userInfo, vacationData, workationData] = await Promise.all([
                userService.getUserInfo(userId),
                userService.getVacationCount(userId),
                workationService.getApprovedWorkations(userId),
            ]);
            setMyInfoState(userInfo);
            setVacationCount(vacationData);
            setApprovedWorkations(workationData);
            console.log('계정 데이터', userInfo);
            console.log('휴가 데이터', vacationData);
            console.log('워케이션 데이터', workationData);
        } catch (err) {
            console.log('계정, 휴가 또는 워케이션 정보를 불러오지 못했습니다.', err);
        }
    };

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
    
    // 날짜가 워케이션 기간에 포함되는지 확인하고, 해당 워케이션 정보를 반환하는 함수
    const getWorkationForDay = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        return approvedWorkations.find(workation => {
            const startDate = new Date(workation.workationStartDate);
            const endDate = new Date(workation.workationEndDate);
            return date >= startDate && date <= endDate;
        });
    };

    const getAttendance = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await attendanceService.attendanceList(userId);
            const todayRecord = filterTodayAttendance(response);
            setAttendance(
                todayRecord || {
                    attendTime: null,
                    leaveTime: null,
                    status: null,
                }
            );
        } catch (err) {
            console.log('출퇴근 정보 불러오기 실패', err);
        }
    };

    const filterTodayAttendance = (list) => {
        const today = new Date().toISOString().slice(0, 10);
        return list.find((item) => item.attendTime?.slice(0, 10) === today) || null;
    };

    const getNotice = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await BoardAPI.getNotice(userId);
            setNotices(response.data);
        } catch (error) {
            console.error('공지사항 조회 실패:', error);
        }
    };

    const [challenge, setChallenge] = useState(null);

    const getChallengeForDashBoard = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await challengeService.getChallengeForDashBoard(userId);
            setChallenge(response);
        } catch (err) {
            console.log('대시보드에 챌린지 가져오기 실패', err);
        }
    };

    useEffect(() => {
        getAttendance();
        myInfo();
        getNotice();
        getChallengeForDashBoard();
    }, []);

    const formatTime = (dateTime) => {
        if (!dateTime) return '-';
        const date = new Date(dateTime);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
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
                                        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                        const isWorkation = !!workationForDay;

                                        let className = '';
                                        if (isToday) {
                                            className += 'today ';
                                        }
                                        if (isWorkation) {
                                            className += 'workation ';
                                        }

                                        return (
                                            <td
                                                key={dayIndex}
                                                className={className.trim()}
                                            >
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
                    <HealthDataCard>
                        <h3>최근 건강 데이터 요약</h3>
                        <div className="chart-wrapper">
                            <Doughnut data={healthDoughnutData} options={healthDoughnutOptions} />
                        </div>
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
                    <AttendanceTimeCard>
                        <div>
                            <span>출근 시간 : </span>
                            <span className="time">{formatTime(attendance.attendTime)}</span>
                            <button className="check-in">출근</button>
                        </div>
                        <div>
                            <span>퇴근 시간 : </span>
                            <span className="time">{formatTime(attendance.leaveTime)}</span>
                            <button className="check-out">퇴근</button>
                        </div>
                    </AttendanceTimeCard>
                </BottomRightSection>
            </BottomSection>
        </DashboardContainer>
    );
};

export default MemberDashBoard;

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
        background-color: #A2D2FF; 
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

const HealthDataCard = styled(Card)`
  h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  .chart-wrapper {
    width: 100%;
    max-width: 250px;
    margin: 0 auto 20px;
    height: 200px;
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
        background-color: #28a745;
        &:hover {
          background-color: #218838;
        }
      }
      &.check-out {
        background-color: #dc3545;
        &:hover {
          background-color: #c82333;
        }
      }
    }
  }
`;