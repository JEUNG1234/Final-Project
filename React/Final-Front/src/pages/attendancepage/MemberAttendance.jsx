import React, { useState } from 'react'; // useState 추가
import {
  MainContent,
  PageTitle,
  BottomBar,
  PageButton,
  Pagination,
  SearchInput,
  PageHeader,
} from '../../styles/common/MainContentLayout';
import { FaCalendarAlt, FaSearch, FaSortDown } from 'react-icons/fa'; // FaSearch, FaPlus, FaSortDown 추가
import styled from 'styled-components';
import { useEffect } from 'react';
import { attendanceService } from '../../api/attendance';
import useUserStore from '../../Store/useStore';

const MemberAttendance = () => {
  const { user } = useUserStore();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  // 날짜 선택 상태 (날짜 검색 기능을 위한)
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredRecords, setFilteredRecords] = useState(attendanceRecords);

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const data = await attendanceService.attendanceList(user.userId, user.userName);
        console.log('출근 데이터:', data);
        setAttendanceRecords(data);
        setFilteredRecords(data);
      } catch (error) {
        console.error('출근 리스트 불러오기 실패:', error.message);
      }
    };

    if (user && user.userId && user.userName) fetchAttendanceList();
  }, [user]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {
    console.log('선택된 날짜로 조회:', selectedDate);
    if (!selectedDate) {
      setFilteredRecords(attendanceRecords); // 선택 안 하면 전체
    } else {
      const filtered = attendanceRecords.filter((record) => record.date === selectedDate);
      setFilteredRecords(filtered);
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <FaCalendarAlt />
        근태관리
      </PageTitle>
      <BoardActions>
        {/* 날짜 검색 input */}
        <SearchInput type="date" placeholder="날짜검색" value={selectedDate} onChange={handleDateChange} />
        <ActionButton primary onClick={handleSearch}>
          {' '}
          {/* 조회 버튼에 핸들러 연결 */}
          <FaSearch /> 조회
        </ActionButton>
      </BoardActions>

      <AttendanceTable>
        {' '}
        <thead>
          <tr>
            <TableHeaderCell>번호</TableHeaderCell>
            <TableHeaderCell sortable>
              출근 시간
              <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell sortable>
              퇴근 시간
              <FaSortDown />
            </TableHeaderCell>
            <TableHeaderCell>상태</TableHeaderCell>
            <TableHeaderCell sortable>
              날짜 <FaSortDown />
            </TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <AttendanceRow key={record.id}>
              <AttendanceCell>{record.attendanceNo}</AttendanceCell>
              <AttendanceCell>{record.attendTime}</AttendanceCell>
              <AttendanceCell>{record.leaveTime}</AttendanceCell>
              <AttendanceCell status={record.status}>{record.status}</AttendanceCell>
              <AttendanceCell>{record.attendTime}</AttendanceCell>
            </AttendanceRow>
          ))}
        </tbody>
      </AttendanceTable>

      <BottomBar>
        <Pagination>
          <PageButton>&lt;</PageButton>
          <PageButton className="active">1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>&gt;</PageButton>
        </Pagination>
      </BottomBar>
    </MainContent>
  );
};

const BoardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.primary ? '#007bff' : '#6c757d')};
  color: white;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#5a6268')};
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 15px;
  text-align: left;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
`;

const TableHeaderCell = styled.th`
  background-color: #f8f9fa;
  color: #555;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;

  ${(props) =>
    props.sortable &&
    `
    &:hover {
      background-color: #e9ecef;
    }
  `}

  svg {
    margin-left: 5px;
    font-size: 12px;
  }
`;

const AttendanceRow = styled.tr`
  &:hover {
    background-color: #fefefe;
  }
`;

const AttendanceCell = styled.td`
  text-align: center;

  color: #333;
  ${(props) =>
    props.status === '지각' &&
    `
    color: red;
    font-weight: bold;
  `}
  ${(props) =>
    props.status === '조퇴' &&
    `
    color: orange;
    font-weight: bold;
  `}
  ${(props) =>
    props.status === '정상' &&
    `
    color: green;
  `}
`;

export default MemberAttendance;
