import React, { useState, useEffect, useMemo } from 'react';
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
import { healthService } from '../../api/health';
import { useLocation } from 'react-router-dom';
import { vacationService } from '../../api/vacation'; // vacationService import 추가

ChartJS.register(ArcElement, Tooltip, Legend);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const MemberDashBoard = () => {
  const [attendance, setAttendance] = useState({
    attendanceTime: null,
    leaveTime: null,
    status: null,
  });
  const [myInfoState, setMyInfoState] = useState(null);
  const [notices, setNotices] = useState([]);
  const [approvedWorkations, setApprovedWorkations] = useState([]); // 승인된 워케이션 목록 상태 추가
  const [approvedVacations, setApprovedVacations] = useState([]); // 승인된 휴가 목록 상태 추가
  const [healthSummary, setHealthSummary] = useState({
    totalScore: 0,
    guideMessage: '',
  });

  const myInfo = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const [userInfo, vacationData, workationData, vacationList] = await Promise.all([
        userService.getUserInfo('userId'),
        userService.getVacationCount(userId),
        workationService.getApprovedWorkations(userId),
        vacationService.vacationList(userId), // 휴가 데이터 호출
      ]);
      setMyInfoState(userInfo);
      setApprovedWorkations(workationData);
      setApprovedVacations(vacationList.filter(v => v.status === 'MINUS')); // 승인된 휴가(사용분)만 필터링
      console.log('계정 데이터', userInfo);
      console.log('휴가 데이터', vacationData);
      console.log('워케이션 데이터', workationData);
      console.log('휴가 리스트', vacationList);
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
    return approvedWorkations.find((workation) => {
      const startDate = new Date(workation.workationStartDate);
      const endDate = new Date(workation.workationEndDate);
      return date >= startDate && date <= endDate;
    });
  };
  
  // 날짜가 휴가 기간에 포함되는지 확인하는 함수
  const getVacationForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return approvedVacations.find(vacation => {
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
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

  const totalScoreData = useMemo(
    () => ({
      labels: ['건강 점수', '남은 점수'],
      datasets: [
        {
          data: [healthSummary.totalScore, 100 - healthSummary.totalScore],
          backgroundColor: ['#4CAF50', '#e0e0e0'],
          borderWidth: 2,
        },
      ],
    }),
    [healthSummary.totalScore]
  );

  const totalScoreOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => context.label + ': ' + context.parsed + '점',
        },
      },
    },
  };

  const location = useLocation();

  const getLatestHealthData = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      let mentalResult = null;
      let physicalResult = null;

      // 심리 검사 결과 가져오기
      try {
        mentalResult = await healthService.mentalresult(userId);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.warn('심리검사 결과가 없습니다.');
        } else {
          console.error('심리 검사 결과 불러오기 실패:', err);
        }
      }

      // 신체 검사 결과 가져오기
      try {
        physicalResult = await healthService.physicalresult(userId);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.warn('신체검사 결과가 없습니다.');
        } else {
          console.error('신체 검사 결과 불러오기 실패:', err);
        }
      }

      let latestData = null;
      let latestType = '';
      let combinedMessage = ''; // 최종적으로 guideMessage에 들어갈 변수

      const getScoreAndMessage = (data) => {
        if (!data || !data.guideMessage) return { score: 0, message: '' };
        const scoreMatch = data.guideMessage.match(/총 점수:\s*(\d+)점/);
        const totalScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
        return { score: totalScore, message: data.guideMessage };
      };

      // 두 검사 결과가 모두 있을 경우, 날짜만 비교 (시분초 무시)
      if (mentalResult && physicalResult) {
        const mentalDate = new Date(mentalResult.medicalCheckCreateDate);
        const physicalDate = new Date(physicalResult.medicalCheckCreateDate);

        // 시분초를 초기화하여 날짜만으로 비교합니다.
        mentalDate.setHours(0, 0, 0, 0);
        physicalDate.setHours(0, 0, 0, 0);

        if (mentalDate.getTime() > physicalDate.getTime()) {
          latestData = mentalResult;
          latestType = '심리';
          combinedMessage = getScoreAndMessage(mentalResult).message;
        } else if (physicalDate.getTime() > mentalDate.getTime()) {
          latestData = physicalResult;
          latestType = '신체';
          combinedMessage = getScoreAndMessage(physicalResult).message;
        } else {
          // 날짜가 동일한 경우 (년,월,일이 같을 때)
          // 신체 검사 결과 우선
          latestData = physicalResult;
          latestType = '신체';

          const originalMessage = getScoreAndMessage(physicalResult).message;
          // toLocaleDateString()으로 날짜만 가져오기
          const dateString = new Date(physicalResult.medicalCheckCreateDate).toLocaleDateString('ko-KR');

          // 안내 메시지 추가
          combinedMessage = `두 가지 검사 모두 ${dateString}에 완료되었습니다. 현재는 신체 검사 결과가 표시됩니다.\n\n${originalMessage}`;
        }
      } else if (physicalResult) {
        // 신체 검사 결과만 있는 경우
        latestData = physicalResult;
        latestType = '신체';
        combinedMessage = getScoreAndMessage(physicalResult).message;
      } else if (mentalResult) {
        // 심리 검사 결과만 있는 경우
        latestData = mentalResult;
        latestType = '심리';
        combinedMessage = getScoreAndMessage(mentalResult).message;
      }

      if (latestData) {
        const { score } = getScoreAndMessage(latestData); // score만 필요
        setHealthSummary({
          totalScore: score,
          guideMessage: combinedMessage, // 최종 메시지 할당
          type: latestType,
        });
        console.log(`HealthSummary set to ${latestType}:`, {
          totalScore: score,
          guideMessage: combinedMessage,
          type: latestType,
        });
      } else {
        console.log('둘 다 검사 결과 없음');
        setHealthSummary({
          totalScore: 0,
          guideMessage: '검사 결과가 없습니다.',
          type: '',
        });
      }
    } catch (err) {
      console.error('건강 데이터 불러오기 중 예기치 않은 오류 발생', err);
      setHealthSummary({
        totalScore: 0,
        guideMessage: '검사 결과를 불러오는 데 실패했습니다.',
        type: '',
      });
    }
  };

  useEffect(() => {
    getAttendance();
    myInfo();
    getNotice();
    getChallengeForDashBoard();
    getLatestHealthData();
  }, [location.pathname]);

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
                    const vacationForDay = getVacationForDay(day);
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();
                    const isWorkation = !!workationForDay;
                    const isVacation = !!vacationForDay;

                    let className = '';
                    if (isToday) {
                      className += 'today ';
                    }
                    if (isWorkation) {
                      className += 'workation ';
                    }
                    if(isVacation){
                      className += 'vacation';
                    }

                    return (
                      <td key={dayIndex} className={className.trim()}>
                        <div className="day-number">{day}</div>
                        {isWorkation && <div className="workation-title">{workationForDay.workationTitle}</div>}
                        {isVacation && <div className="vacation-title">휴가</div>}
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
                  <img src={challenge.completeImageUrl ? `${import.meta.env.VITE_CLOUDFRONT_URL}/${challenge.completeImageUrl}` : ChallangeImg} alt="챌린지 이미지" />
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
              <dt>남은 휴가 수:</dt>
              <dd>
                <span>{myInfoState?.vacation}일</span>
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
            <h3>최근 검사 점수 ({healthSummary.type} 검사)</h3>
            <div className="chart-wrapper">
              <Doughnut data={totalScoreData} options={totalScoreOptions} />
              <div style={{ position: 'absolute', fontSize: '22px', fontWeight: 'bold' }}></div>
            </div>
            <p style={{ fontSize: '14px', color: '#555', marginTop: '10px', whiteSpace: 'pre-line' }}>
              {healthSummary.guideMessage}
            </p>
          </HealthDataCard>

          <AttendanceTimeCard>
            <div>
              <span>출근 시간 : </span>
              <span className="time">{formatTime(attendance.attendTime)}</span>
            </div>
            <div>
              <span>퇴근 시간 : </span>
              <span className="time">{formatTime(attendance.leaveTime)}</span>
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
      .vacation-title {
        font-size: 12px;
        color: #fff;
        background-color: #28a745;
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
      &.vacation {
          background-color: #8ce99a;
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
    display: grid;
    grid-template-columns: 1fr 80px;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }

  .time {
    justify-self: center;
    font-size: 20px;
    font-weight: bold;
    color: #007bff;
  }
`;