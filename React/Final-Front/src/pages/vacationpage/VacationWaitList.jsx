import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  MainContent as BaseMainContent,
  PageTitle,
  PageButton,
  Pagination,
  BottomBar,
} from '../../styles/common/MainContentLayout';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//달력기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { FaSquare, FaExclamationTriangle, FaUsers } from 'react-icons/fa';

import useUserStore from '../../Store/useStore';
import { useForm } from 'react-hook-form';
import { vacationService } from '../../api/vacation';
import { MdOutlineWbSunny } from 'react-icons/md';

const VacationWaitList = () => {
  const { user } = useUserStore();

  const [vacationData, setVacation] = useState([]);
  //날짜 범위 선택[시작일, 종료일]
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [content, setContent] = useState('');
  const [selectedVacationIds, setSelectedVacationIds] = useState([]);

  //날짜 초기화
  const resetDates = () => setDateRange([null, null]);

  // 페이지네이션 로직
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // 이미지에서 보이는 대로 한 페이지에 7개 항목 표시
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vacationData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vacationData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 체크박스: 현재 페이지의 모든 항목 선택/해제
  const [vacationNo, setVacationNo] = useState([]);

  //전체선택
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentIds = currentItems.map((item) => item.vacationNo);
      setSelectedVacationIds((prev) => [...new Set([...prev, ...currentIds])]);
    } else {
      const currentIds = currentItems.map((item) => item.vacationNo);
      setSelectedVacationIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    }
  };

  const handleCheckboxChange = (vacationNo, status) => {
    if (status === 'Y') {
      alert('승인된 휴가는 취소할 수 없습니다.');
      return;
    }
    setSelectedVacationIds((prev) =>
      prev.includes(vacationNo) ? prev.filter((id) => id !== vacationNo) : [...prev, vacationNo]
    );
  };

  const isAllCurrentItemsSelected =
    currentItems.length > 0 && currentItems.every((item) => selectedVacationIds.includes(item.vacationNo));

  //유효성 검사
  const schema = yup.object().shape({
    dateRange: yup
      .array()
      .of(yup.date().nullable())
      .test('required', '날짜를 선택해주세요', (value) => !!(value && value[0] && value[1]))
      .test('rangeCheck', '시작일은 종료일보다 늦을 수 없습니다.', (value) => {
        if (!value || !value[0] || !value[1]) return true;
        const start = value[0] instanceof Date ? value[0] : new Date(value[0]);
        const end = value[1] instanceof Date ? value[1] : new Date(value[1]);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return start <= end;
      }),
  });

  useEffect(() => {
    const vacationWaitList = async () => {
      try {
        const data = await vacationService.vacationWaitList(user.userId);
        console.log('휴가 내역: ', data);
        setVacation(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    vacationWaitList();
  }, [user.userId]);



  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: true,
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const [startDate, endDate] = data.dateRange;

    const amount = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 0;
    try {
      const submitBody = {
        startDate,
        endDate,
        content,
        amount,
      };
      const requestBody = {
        ...submitBody,
        userId: user.userId,
      };

      console.log(requestBody);

      const response = await vacationService.vacationSubmit(requestBody);

      alert('워케이션 신청되었습니다.');
      console.log(response);
    } catch (error) {
      console.error('워케이션 신청 에러:', error);
      alert('워케이션 신청 중 에러가 발생했습니다.');
    }
    console.log({ data });
  };

  // 신청취소 버튼
  const handleCancelApplication = async () => {
    if (selectedVacationIds.length === 0) {
      alert('취소할 신청을 선택해주세요.');
      return;
    }

    const selectedApplications = vacationData.filter((item) => selectedVacationIds.includes(item.vacationNo));
    const approvedApplications = selectedApplications.filter((item) => item.status === 'Y');

    if (approvedApplications.length > 0) {
      const approvedNames = approvedApplications.map((item) => item.content).join(', ');
      alert(`다음 휴가는 이미 승인되어 취소할 수 없습니다: ${approvedNames}`);
      return;
    }

    const confirmed = window.confirm(`선택된 ${selectedVacationIds.length}개의 휴가를 정말 취소하시겠습니까?`);
    if (!confirmed) return;

    try {
      // ✅ 실제 API에 맞게 이 부분만 수정하세요!
      await vacationService.cancelVacations({ vacationNos: selectedVacationIds });
      alert(`선택된 ${selectedVacationIds.length}개의 신청이 취소되었습니다.`);
      setSelectedVacationIds([]);
      // 목록 새로고침
      console.log()
      const data = await vacationService.vacationWaitList(user.userId);
      setVacation(data);
    } catch (error) {
      alert('휴가 신청 취소 중 에러가 발생했습니다.');
      console.error(error);
    }
  };

  const getStatusText = (status) => {
    if (status === 'W') return '대기';
    if (status === 'Y') return '승인';
    if (status === 'N') return '거절';
    return status;
  };

  return (
    <FullWapper>
      <MainContent>
        <PageTitleWrapper>
          <PageTitle>
            <MdOutlineWbSunny /> 휴가 {'>'} 신청 내역
          </PageTitle>
          <TopRightButtonContainer>
            <CancelButton onClick={handleCancelApplication}>신청취소</CancelButton>
          </TopRightButtonContainer>
        </PageTitleWrapper>
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={isAllCurrentItemsSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedVacationIds.length > 0 && !isAllCurrentItemsSelected;
                      }
                    }}
                  />
                </TableHeader>
                <TableHeader>날짜</TableHeader>
                <TableHeader>이름</TableHeader>
                <TableHeader>사유</TableHeader>
                <TableHeader>휴가일수</TableHeader>
                <TableHeader>증감</TableHeader>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <TableRow key={item.vacationNo}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedVacationIds.includes(item.vacationNo)}
                      onChange={() => handleCheckboxChange(item.vacationNo, item.status)}
                      disabled={item.status === 'Y'}
                    />
                  </TableCell>
                  <TableCell>{item.vacationDate}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.content}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status}>{getStatusText(item.status)}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
              {/* 테이블의 최소 높이 유지 */}
              {Array(itemsPerPage - currentItems.length)
                .fill()
                .map((_, index) => (
                  <TableRow key={`empty-${index}`} style={{ height: '52px' }}>
                    <TableCell colSpan="8">&nbsp;</TableCell>
                  </TableRow>
                ))}
            </tbody>
          </StyledTable>
        </TableContainer>
        <StyledPagination>
          <StyledPageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </StyledPageButton>
          {[...Array(totalPages)].map((_, index) => (
            <StyledPageButton
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </StyledPageButton>
          ))}
          <StyledPageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </StyledPageButton>
        </StyledPagination>
      </MainContent>
      <DateContent>
        <DateMenu>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              setValue('dateRange', update);
            }}
            inline
            calendarContainer={({ children }) => (
              <CalendarWrapper>
                {children}
                <ButtonWrapper>
                  <ControlButton onClick={resetDates}>초기화</ControlButton>
                  <ControlButton>날짜 적용</ControlButton>
                </ButtonWrapper>
              </CalendarWrapper>
            )}
          />
        </DateMenu>
        <FormContent onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <Label>일정</Label>

            <FormField>
              <Input
                type="text"
                placeholder="시작일"
                readOnly
                value={startDate ? startDate.toLocaleDateString() : ''}
              />

              <Tilde>~</Tilde>
              <Input type="text" placeholder="종료일" readOnly value={endDate ? endDate.toLocaleDateString() : ''} />
              {errors.dateRange && (
                <ErrorTooltip>
                  <IconBox>
                    <FaExclamationTriangle />
                  </IconBox>
                  {errors.dateRange.message}
                </ErrorTooltip>
              )}
            </FormField>
          </FormRow>
          <FormRow style={{ alignItems: 'flex-start', flexGrow: 1, marginBottom: '0' }}>
            <Label>사유</Label>
            <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="사유를 입력하세요" />
          </FormRow>
          <SubmitButton type="submit">워케이션 신청</SubmitButton>
        </FormContent>
      </DateContent>
    </FullWapper>
  );
};

const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px;
  min-height: 80vh;
  margin: 30px auto;
`;

const MainContent = styled.div`
  width: 80%;
  max-width: 1400px;
  min-height: 80vh;
  background: white;
  padding: 30px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const DateContent = styled.div`
  position: relative;
  width: 20%;
  max-width: 1400px;
  height: 92%;
  margin: 0 0 0 30px;
  border-radius: 10px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
`;

const PageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

//날짜 선택 영역
const DateMenu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding-bottom: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 100%;
  min-height: 320px;
  margin-bottom: 9%;
  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 1.75vw;
  }

  .react-datepicker {
    font-size: 1.6vw;
    .react-datepicker__header,
    .react-datepicker__day,
    .react-datepicker__current-month {
      width: 1vw;
      font-size: 1px;
    }

    .react-datepicker__day-name {
      width: 1.5vw;
    }

    .react-datepicker__day,
    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      width: 100%;
      padding: 0.8vw;
    }

    .react-datepicker__month,
    .react-datepicker__year {
      font-size: 1.6vw;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;

  gap: 1vw;
  margin: 0.5vw;
`;

const ControlButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.6vw 1.2vw;
  border: none;
  border-radius: 1.2vw;
  font-size: 0.9vw;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  height: 100%;

  &:hover {
    background-color: #2563eb;
  }
`;

//신청 영역
const FormContent = styled.form`
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  padding: 15px;
  justify-content: space-between;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  width: 50px;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  background-color: #dbebff;
  width: 100%;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  min-height: 80px;
  resize: vertical;
  outline: none;
  background-color: #dbebff;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

const Tilde = styled.span`
  margin: 0 8px;
  font-size: 16px;
  color: #555;
`;

const SubmitButton = styled.button`
  background-color: #61a5fa;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
  align-self: center;
  width: 160px;
  flex-shrink: 0;

  &:hover {
    background-color: #4a8df1;
  }

  &:active {
    background-color: #3b7ae0;
  }
`;

// 말풍선 툴팁 스타일
const ErrorTooltip = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: #fff;
  color: #222;
  font-size: 12px;
  padding: 11px 16px 11px 13px;
  border-radius: 7px;
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.11);
  display: flex;
  align-items: center;
  min-width: 100px;
  z-index: 20;

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 18px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.09));
  }
`;
const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 13px;

  color: ${(props) => {
    if (props.status === 'W') return '#9A6700';
    if (props.status === 'Y') return '#047857';
    if (props.status === 'N') return '#991B1B';
    return '#333';
  }};

  background-color: ${(props) => {
    if (props.status === 'W') return '#FEF9C3';
    if (props.status === 'Y') return '#D1FAE5';
    if (props.status === 'N') return '#FEE2E2';
    return '#F3F4F6';
  }};
`;
const IconBox = styled.div`
  background: #ffb300;
  color: #fff;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 17px;
`;

// FormField(최대 인원 입력 부분에만 새로 사용)
const FormField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

const TableContainer = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-top: 20px;
  min-height: 450px; /* 테이블 내용의 높이가 달라져도 전체 컨테이너 높이를 일정하게 유지 */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fcfcfc;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 14px;
  color: #555;
`;

const StatusChip = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) =>
    props.status === '대기' ? '#FFC107' : '#28A745'}; // 대기 상태는 노란색, 승인 상태는 초록색
`;

const StyledPagination = styled(Pagination)`
  margin-top: 20px;
  justify-content: center; /* 페이징 버튼을 중앙 정렬 */
`;

const StyledPageButton = styled(PageButton)`
  min-width: 40px; /* 버튼 너비를 일정하게 유지 */
  &.active {
    background-color: #007bff;
    color: white;
  }
`;

const BottomButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const GoBackButton = styled.button`
  height: 50px;
  background-color: #4d8eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3c75e0;
  }
`;

const TopRightButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  width: 100%;
`;

const CancelButton = styled.button`
  background-color: #f44336; /* 빨간색 */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d64444;
  }
`;

export default VacationWaitList;
