import React, { useState } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Pagination, BottomBar, PageButton, PageTitle } from '../../styles/common/MainContentLayout';
import { FaCalendarAlt } from 'react-icons/fa';
import { useEffect } from 'react';
import { adminService } from '../../api/admin';
import { departmentService } from '../../api/department';
import useUserStore from '../../Store/useStore';

// Chart.js에서 사용될 요소들을 등록 (필수)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// =============================================================================================================================

// 도넛 차트 데이터 계산 함수
const getDonutChartData = (attendanceList) => {
  if (!Array.isArray(attendanceList)) attendanceList = [];
  let normal = 0;
  let late = 0;
  let absent = 0;
  let earlyLeave = 0;

  attendanceList.forEach((item) => {
    if (item.status === 'W' && item.attendTime) {
      const attendTime = new Date(item.attendTime);
      const nineAM = new Date(attendTime);
      nineAM.setHours(9, 0, 0, 0);
      if (attendTime <= nineAM) {
        normal++;
      } else {
        late++;
      }
    } else if (item.status === 'L') {
      // 퇴근한 경우는 이미 출근한 것으로 간주
      normal++;
    } else {
      // 어떤 상태도 없는 경우만 결근 처리
      absent++;
    }
  });

  return {
    labels: ['정상', '지각', '결근'],
    datasets: [
      {
        data: [normal, late, absent, earlyLeave],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  };
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

// =============================================================================================================================
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
      label: '휴가/워케이션',
      data: [0, 0, 0, 0, 0, 15, 18], // 월별 휴가/연차 인원 (주말 반영)
      backgroundColor: '#2196F3', // 파랑
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

// =============================================================================================================================

const AdminAttendance = () => {
  // 당일 근무 시간 함수 모음
  const [attendanceList, setAttendanceList] = useState([]);

  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const normal = attendanceList.filter((item) => {
    if (item.status !== 'W' || !item.attendTime) return false;
    const attendDate = new Date(item.attendTime);
    const nineAM = new Date(attendDate);
    nineAM.setHours(9, 0, 0, 0);
    return attendDate <= nineAM; // 9시 이전 출근 정상
  }).length;

  const late = attendanceList.filter((item) => {
    if (item.status !== 'W' || !item.attendTime) return false;
    const attendDate = new Date(item.attendTime);
    const nineAM = new Date(attendDate);
    nineAM.setHours(9, 0, 0, 0);
    return attendDate > nineAM; // 9시 이후 출근 지각
  }).length;

  const notCome = attendanceList.filter((item) => item.status == null).length;

  const total = attendanceList.filter((item) => {
    return item.attendTime && isToday(item.attendTime);
  }).length;

  const leave = attendanceList.filter((item) => item.status === 'L' && isToday(item.leaveTime)).length;

  const getTodayStatusChart = () => ({
    labels: ['정상', '지각', '결근', '퇴근'],
    datasets: [
      {
        data: [normal, late, notCome, leave],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  });

  // =============================================================================================================================

  // 평균 근무 시간 계산 (주간, 월간) 함수 모음
  const calcAverageWorkHours = (list, daysAgo) => {
    const now = new Date();
    const filtered = list.filter((item) => {
      if (!item.attendTime || item.workHours == null) return false;
      const attendDate = new Date(item.attendTime);
      return attendDate >= new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    });
    if (filtered.length === 0) return 0;
    const totalHours = filtered.reduce((acc, cur) => acc + (cur.workHours || 0), 0);
    return (totalHours / filtered.length).toFixed(1);
  };
  // 금주 근태 비율 함수 모음
  const weeklyAvg = calcAverageWorkHours(attendanceList, 7);

  // 월별 근태 비율 함수 모음 (도넛 차트용)
  const monthlyAvg = calcAverageWorkHours(attendanceList, 30);

  const getAvgWorkHourDonutData = (weeklyAvg, monthlyAvg) => {
    return {
      labels: ['주간 평균', '월간 평균'],
      datasets: [
        {
          data: [Number(weeklyAvg), Number(monthlyAvg)],
          backgroundColor: ['#42A5F5', '#66BB6A'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2,
        },
      ],
    };
  };

  // =============================================================================================================================
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date)) return '';
    // 시:분까지만 반환 (HH:mm)
    return date.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5);
  };

  const combineDateAndTime = (dateTimeString, timeString) => {
    if (!dateTimeString) return null;
    // dateTimeString 예: "2025-06-23T09:00:00"
    const datePart = dateTimeString.split('T')[0]; // "2025-06-23"
    return `${datePart}T${timeString}:00`; // "2025-06-23T15:30:00"
  };

  // 출근 시간, 퇴근 시간으로 근무 시간(소수점 시간) 계산
  const calculateWorkHours = (attendDateTimeStr, leaveDateTimeStr) => {
    if (!attendDateTimeStr || !leaveDateTimeStr) return 0;
    const attend = new Date(attendDateTimeStr);
    const leave = new Date(leaveDateTimeStr);
    const diffMs = leave - attend;
    return diffMs > 0 ? +(diffMs / (1000 * 60 * 60)).toFixed(2) : 0; // 시간 단위, 소수점 2자리 숫자 반환
  };

  // 츨퇴근 수정 함수
  const handleUpdateAttendTime = async (item) => {
    try {
      const workHours = calculateWorkHours(item.attendTime, item.leaveTime);

      const updateData = {
        attendanceNo: item.attendanceNo,
        attendTime: item.attendTime,
        leaveTime: item.leaveTime,
        workHours: workHours,
      };

      const response = await adminService.updateAttendTime(updateData);
      console.log('수정 성공:', response.data);

      // UI에서도 반영
      setAttendanceList((prev) =>
        prev.map((el) => (el.attendanceNo === item.attendanceNo ? { ...el, workHours: workHours } : el))
      );
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const handleAttendTimeChange = (attendanceNo, newTime) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.attendanceNo === attendanceNo
          ? { ...item, attendTime: combineDateAndTime(item.attendTime, newTime) }
          : item
      )
    );
  };

  const handleLeaveTimeChange = (attendanceNo, newTime) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.attendanceNo === attendanceNo ? { ...item, leaveTime: combineDateAndTime(item.leaveTime, newTime) } : item
      )
    );
  };

  // =============================================================================================================================
  // 페이징처리
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  // =============================================================================================================================

  // 조건 처리 함수
  const [searchDate, setSearchDate] = useState('');
  const [userName, setUserName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [attendances, setAttendances] = useState([]);
  const { companyCode } = useUserStore((state) => state.user);

  const handleSearch = async () => {
    try {
      const res = await adminService.getMemberAttendance({
        companyCode,
        userName,
        date: searchDate,
        deptName: deptCode,
        page: 0,
        size: 10,
        sort: 'attendTime,desc',
      });
      if (res && res.content) {
        setAttendances(res.content);
        console.log('현재 상세 근태 데이터 : ', attendances);
      } else {
        console.warn('데이터가 없습니다.');
        setAttendances([]); // 빈 배열로 초기화
      }
    } catch (err) {
      console.error('조회 실패:', err);
    }
  };

  // =============================================================================================================================
  // 부서 가져오기
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
        console.log('현재 부서 목록 : ', data);
      } catch (error) {
        console.error('부서 목록 불러오기 실패:', error);
      }
    }
    fetchDepartments();
  }, []);

  // =============================================================================================================================

  const getAttendanceList = async (page = 0) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await adminService.getAllAttendanceByCompanyCode(userId, page, 5);
      if (response && Array.isArray(response.content)) {
        setAttendanceList(response.content);
        setCurrentPage(response.currentPage);
        setTotalPage(response.totalPage);
      } else if (Array.isArray(response)) {
        setAttendanceList(response);
      } else {
        setAttendanceList([]);
      }
      console.log('출퇴근 데이터', response);
    } catch (err) {
      console.error('출퇴근 데이터 에러', err);
    }
  };

  // useEffect 내부에서는 초기 호출만
  useEffect(() => {
    getAttendanceList(0);
  }, []);

  // 페이지 변경 시 호출 가능
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPage) {
      getAttendanceList(page);
    }
  };

  return (
    <AttendanceManagementContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>
          <FaCalendarAlt />
          근태 관리
        </PageTitle>
        <SearchFilterArea>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            placeholder="날짜 검색"
          />
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="직원명 검색" />
          <select value={deptCode} onChange={(e) => setDeptCode(e.target.value)}>
            <option value="">부서/팀 선택</option>
            {departments.map((dept) => (
              <option key={dept.deptName} value={dept.deptName}>
                {dept.deptName}
              </option>
            ))}
          </select>
          <button onClick={handleSearch}>조회</button>
        </SearchFilterArea>
        {attendances.length > 0 && (
          <SummaryCard>
            <SummaryTable>
              <thead>
                <tr>
                  <th>직원명</th>
                  <th>부서명</th>
                  <th>출근 시간</th>
                  <th>퇴근 시간</th>
                  <th>근무 시간</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((att) => (
                  <tr key={att.attendanceNo}>
                    <td>{att.userName}</td>
                    <td>{att.deptName}</td>
                    <td>{new Date(att.attendTime).toLocaleString()}</td>
                    <td>{att.leaveTime ? new Date(att.leaveTime).toLocaleString() : '-'}</td>
                    <td>{att.workHours ? att.workHours.toFixed(2) + '시간' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </SummaryTable>
          </SummaryCard>
        )}
      </PageHeader>

      {/* 상단 요약/대시보드 영역 */}
      <SummaryDashboard>
        <SummaryCard>
          <h3>오늘 근태 현황</h3>{' '}
          <ChartContainer height="120px">
            <Doughnut data={getTodayStatusChart()} options={donutChartOptions} />
          </ChartContainer>
          <p>
            총 {total}명 | 정상 출근 {normal}명 | 결근 {notCome}명 | 지각 {late} 명 | 퇴근 {leave} 명
          </p>
        </SummaryCard>
        <SummaryCard>
          <h3>평균 근무 시간</h3>
          <ChartContainer>
            <Doughnut data={getAvgWorkHourDonutData(weeklyAvg, monthlyAvg)} options={donutChartOptions} />
          </ChartContainer>
          <p>
            주간: {weeklyAvg}시간 | 월간: {monthlyAvg}시간
          </p>
        </SummaryCard>
        <SummaryCard>
          <h3>금주 근태 비율</h3>
          <ChartContainer>
            <Doughnut data={getDonutChartData(attendanceList)} options={donutChartOptions} />
          </ChartContainer>
          <p>
            정상 {normal}명 | 지각 {late}명 | 결근 {notCome}명
          </p>
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
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(attendanceList) && attendanceList.length > 0 ? (
              attendanceList.map((item, index) => (
                <tr key={item.attendanceNo}>
                  <td>{index + 1}</td>
                  <td>{item.userName}</td>
                  <td>{item.deptName}</td>
                  <td>
                    {item.attendTime ? (
                      <TimeInput
                        type="time"
                        value={formatTime(item.attendTime)} // value로 변경
                        onChange={(e) => handleAttendTimeChange(item.attendanceNo, e.target.value)}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {item.leaveTime ? (
                      <TimeInput
                        type="time"
                        value={formatTime(item.leaveTime)}
                        onChange={(e) => handleLeaveTimeChange(item.attendanceNo, e.target.value)}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{item.workHours?.toFixed(1) ?? '-'}</td>
                  <td>{item.status === 'L' ? '퇴근' : item.status === 'W' ? '출근' : '-'}</td>
                  <td>{item.attendTime ? new Date(item.attendTime).toLocaleDateString('ko-KR') : '-'}</td>
                  <td>
                    <TableActionButton onClick={() => handleUpdateAttendTime(item)}>수정</TableActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>
                  출퇴근 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <BottomBar>
          <Pagination>
            <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
              &lt;
            </PageButton>
            {Array.from({ length: totalPage }, (_, idx) => (
              <PageButton
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={currentPage === idx ? 'active' : ''}
              >
                {idx + 1}
              </PageButton>
            ))}
            <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 === totalPage}>
              &gt;
            </PageButton>
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

const TimeInput = styled.input.attrs({ type: 'time' })`
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;
  padding: 6px 12px;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.25s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.6);
  }

  /* 크로스 브라우저 기본 내장 시계 아이콘 간격 맞추기 */
  &::-webkit-inner-spin-button,
  &::-webkit-clear-button {
    display: none;
  }
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  thead tr {
    border-bottom: 2px solid #ccc;
  }

  th,
  td {
    text-align: left;
    padding: 8px;
  }

  tbody tr {
    border-bottom: 1px solid #eee;
  }
`;

export default AdminAttendance;
