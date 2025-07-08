import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, PageButton, MainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { PiAirplaneTiltFill } from 'react-icons/pi';
import styled from 'styled-components';
import { workationService } from '../../api/workation';
import useUserStore from '../../Store/useStore';

// 테이블 및 관련 요소들을 위한 스타일 컴포넌트
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

const TableHeader = styled.th`
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  font-weight: bold;
  color: #333;
  font-size: 14px;
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

const CheckboxCell = styled(TableCell)`
  width: 40px;
`;


const StatusChip = styled.span`
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

const MyWorkation = () => {
  const navigate = useNavigate();
  // 선택된 항목들의 ID를 관리하는 상태
  // const [selectedIds, setSelectedIds] = useState([]);

  const { user } = useUserStore();

  // 테이블을 위한 더미 데이터
  const [workationData, setWorkationData] = useState([]);

  const getStatusText = (status) => {
    if (status === 'W') return '대기';
    if (status === 'Y') return '승인';
    if (status === 'N') return '거절';
    return status;
  };

  useEffect(() => {
    const workationMySubList = async () => {
      try {
        const data = await workationService.workationMySubList(user.userId);
        console.log('워케이션 신청목록', data);
        setWorkationData(data);
      } catch (error) {
        console.error('워케이션 신청목록 불러오기 실패:', error.message);
      }
    };
    workationMySubList();
  }, []);

  // 페이지네이션 로직
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // 이미지에서 보이는 대로 한 페이지에 7개 항목 표시
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = workationData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(workationData.length / itemsPerPage);

  // 핸들러 함수들
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 선택 사항: 페이지 변경 시 선택된 항목을 초기화하려면 아래 주석을 해제하세요.
    // setSelectedIds([]);
  };

  // 체크박스: 현재 페이지의 모든 항목 선택/해제
  const [workationSubNo, setWorkationSubNo] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 현재 페이지에 표시된 모든 항목의 ID를 가져옴
      const currentItemIds = currentItems.map((item) => item.workationSubNo);
      // 이 ID들만 selectedIds 상태에 추가 (중복 방지를 위해 Set 사용)
      setWorkationSubNo((prev) => [...new Set([...prev, ...currentItemIds])]);
    } else {
      // 현재 페이지에 표시된 항목의 ID들만 selectedIds에서 제거
      const currentItemIds = currentItems.map((item) => item.workationSubNo);
      setWorkationSubNo((prev) => prev.filter((workationSubNo) => !currentItemIds.includes(workationSubNo)));
    }
  };

  // 체크박스: 개별 항목 선택/해제

  const handleCheckboxChange = (workationSubNo, status) => {
    if (status === 'Y') {
      alert('승인된 워케이션은 취소할 수 없습니다.');
      return;
    }
    setWorkationSubNo((prev) =>
      prev.includes(workationSubNo) ? prev.filter((item) => item !== workationSubNo) : [...prev, workationSubNo]
    );
  };

  // '전체 선택' 체크박스가 체크되어야 하는지 여부 (현재 표시된 모든 항목이 선택되었는지)
  const isAllCurrentItemsSelected =
    currentItems.length > 0 && currentItems.every((item) => workationSubNo.includes(item.workationSubNo));

  const handleCancelApplication = async () => {
    // 파라미터에서 workationSubNo 제거, state 사용
    if (workationSubNo.length === 0) {
      alert('취소할 신청을 선택해주세요.');
      return;
    }

    // 승인된 워케이션이 선택되었는지 확인하는 로직 (이전 답변에 포함된 내용)
    const selectedApplications = workationData.filter((item) => workationSubNo.includes(item.workationSubNo));
    const approvedApplications = selectedApplications.filter((item) => item.status === 'Y');

    if (approvedApplications.length > 0) {
      const approvedTitles = approvedApplications.map((item) => item.workationTitle).join(', ');
      alert(`다음 워케이션 신청은 이미 승인되어 취소할 수 없습니다: ${approvedTitles}`);
      return; // 승인된 항목이 있으면 여기서 함수 종료
    }

    const confirmed = window.confirm(`선택된 ${workationSubNo.length}개의 신청을 정말 취소하시겠습니까?`);

    // **** 핵심 변경 부분: 사용자가 '취소'를 눌렀다면 함수를 여기서 종료합니다. ****
    if (!confirmed) {
      // confirmed가 false(취소)인 경우
      return; // 함수 실행을 여기서 중단합니다.
    }

    // '확인'을 눌렀을 경우에만 이 아래 코드가 실행됩니다.
    try {
      await workationService.workationMyDelete({ workationSubNo });
      alert(`선택된 ${workationSubNo.length}개의 신청이 취소되었습니다.`);
      setWorkationSubNo([]); // 성공적으로 취소 후 선택 항목 초기화

      const data = await workationService.workationMySubList(user.userId);
      setWorkationData(data);
    } catch (error) {
      console.error('워케이션 신청 취소 중 에러가 발생했습니다:', error);
      alert('워케이션 신청 취소 중 에러가 발생했습니다.');
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <PiAirplaneTiltFill /> 워케이션 {'>'} 신청목록
      </PageTitle>

      <TopRightButtonContainer>
        <CancelButton onClick={() => handleCancelApplication({ workationSubNo })}>신청취소</CancelButton>
      </TopRightButtonContainer>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <CheckboxCell as={TableHeader}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  // 현재 표시된 모든 항목이 선택되었는지 확인
                  checked={isAllCurrentItemsSelected}
                  // 부분 선택 상태 (선택 사항)
                  // 일부만 선택된 경우 체크박스에 대시 표시
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = workationSubNo.length > 0 && !isAllCurrentItemsSelected;
                    }
                  }}
                />
              </CheckboxCell>
              <TableHeader>번호</TableHeader>
              <TableHeader>일정</TableHeader>
              <TableHeader>이름</TableHeader>
              <TableHeader>장소</TableHeader>
              <TableHeader>사유</TableHeader>
              <TableHeader>인원</TableHeader>
              <TableHeader>상태</TableHeader>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <TableRow key={item.workationSubNo}>
                <CheckboxCell>
                  <input
                    type="checkbox"
                    checked={workationSubNo.includes(item.workationSubNo)} // selectedIds 사용
                    onChange={() => handleCheckboxChange(item.workationSubNo, item.status)}
                    disabled={item.status === 'Y'} // Disable checkbox for approved items
                  />
                </CheckboxCell>
                <TableCell>{item.workationSubNo}</TableCell>
                <TableCell>
                  {item.workationStartDate}~{item.workationEndDate}
                </TableCell>
                <TableCell>{item.userName}</TableCell>
                <TableCell>{item.workationTitle}</TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell>{item.peopleMax}</TableCell>
                <TableCell>
                  <StatusChip status={item.status}>{getStatusText(item.status)}</StatusChip>
                </TableCell>
              </TableRow>
            ))}
            {/* 테이블의 최소 높이를 유지하기 위해 빈 행 추가 */}
            {Array(itemsPerPage - currentItems.length)
              .fill()
              .map((_, index) => (
                <TableRow key={`empty-${index}`} style={{ height: '52px' }}>
                  {/* 각 행의 대략적인 높이로 설정. 실제 행 높이에 맞춰 조절하세요. */}
                  <TableCell colSpan="8">&nbsp;</TableCell> {/* 모든 열을 커버하도록 colspan 설정 */}
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

      <BottomButtonContainer>
        <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>
      </BottomButtonContainer>
    </MainContent>
  );
};

export default MyWorkation;
