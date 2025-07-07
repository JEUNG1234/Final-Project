import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaClipboardCheck } from 'react-icons/fa';
import { FaUmbrellaBeach } from 'react-icons/fa';
import {
  MainContent as BaseMainContent,
  PageTitle,
  PageButton,
  Pagination,
  BottomBar,
} from '../../styles/common/MainContentLayout';
import useUserStore from '../../Store/useStore';
import { vacationAdminService } from '../../api/vacationAdmin';

// 1. 스크롤 제거를 위해 기존 MainContent를 확장하고 min-height를 auto로 변경
const MainContent = styled(BaseMainContent)`
  min-height: auto;
`;

const VacationAdmin = () => {
  const { user } = useUserStore();

  const [vacationNo, setVacationNo] = useState([]);
  const [isFullList, setIsFullList] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 전체보기일 땐 전체 데이터, 페이징 중일 땐 현재 페이지 데이터 선택
      const allIds = isFullList ? vacationData.map((req) => req.vacationNo) : pagedData.map((req) => req.vacationNo);
      setVacationNo(allIds);
    } else {
      setVacationNo([]);
    }
  };

  // 개별 선택/해제 핸들러
  const handleSelectSingle = (id) => {
    setVacationNo((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // 휴가 신청 리스트 조회
  useEffect(() => {
    if (!user || !user.companyCode) return;

    const vacationList = async () => {
      try {
        console.log('휴가승인 페이지쪽 유저 정보', user);
        sessionStorage.getItem('token');
        const data = await vacationAdminService.getvactionlist(user.companyCode);
        setVacationData(data);
      } catch (error) {
        console.error('휴가 신청 리스트 불러오기 실패:', error.message);
      }
    };
    vacationList();
  }, [user]);

  const getStatusText = (status) => {
    if (status === 'W') return '대기';
    if (status === 'Y') return '승인';
    if (status === 'N') return '거절';
    return status;
  };

  const [vacationData, setVacationData] = useState([]);

  console.log('vacationNo', vacationNo);

  // 승인 처리 함수
  const handleApprovedAction = async (selectedVacationNos) => {
    if (selectedVacationNos.length === 0) {
      alert('항목을 먼저 선택해주세요.');
      return;
    }

    try {
      const requestData = {
        vacationNos: selectedVacationNos,
        status: 'Y',
      };
      const response = await vacationAdminService.updateVacationStatus(requestData);
      console.log('response', response);
      alert('성공적으로 승인 처리되었습니다.');

      // 승인 후 리스트 다시 불러오기
      if (user && user.companyCode) {
        const updatedData = await vacationAdminService.getvactionlist(user.companyCode);
        setVacationData(updatedData);
        setVacationNo([]); // 선택 초기화
      }
    } catch (error) {
      console.error('휴가 승인 중 에러:', error);
      alert('휴가 승인 중 에러가 발생했습니다.', error);
    }
  };

  // 거부 처리 함수 (임시 예시)
  const handleReturnAction = async (selectedVacationNos) => {
    if (selectedVacationNos.length === 0) {
      alert('항목을 먼저 선택해주세요.');
      return;
    }

    try {
      const response = await vacationAdminService.handleReturnAction(selectedVacationNos);
      console.log('성공 거부', response);
      alert('성공적으로 거부 처리되었습니다.');
      // 리스트 다시 불러오기
      const updatedData = await vacationAdminService.getvactionlist(user.companyCode);
      setVacationData(updatedData);
      setVacationNo([]);
    } catch (error) {
      console.error('휴가 거부 중 에러:', error);
      alert('휴가 거부 중 에러가 발생했습니다.');
    }
  };

  // 전체 보기 토글 핸들러 (임시)
  const handleFullList = async () => {
    try {
      const allData = await vacationAdminService.getAllVacationList(); // 전체 데이터 API
      setVacationData(allData);
      setIsFullList(true);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };
  // 돌아가기 시에는 페이징된 데이터만 불러오기
  const handleGoBack = async () => {
    try {
      const data = await vacationAdminService.getvactionlist(user.companyCode); // 페이징 데이터 API
      setVacationData(data);
      setIsFullList(false);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1); // 1페이지부터 시작
  const itemsPerPage = 7; // 한 페이지에 10개씩

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(vacationData.length / itemsPerPage);
  // 렌더링 데이터는 항상 페이징 처리
  const pagedData = vacationData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 이전/다음 버튼 활성화 여부
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <MainContent>
      <PageTitleWrapper>
        <PageTitle>
          <FaUmbrellaBeach /> 휴가 승인
        </PageTitle>

        {isFullList ? (
          <FullSearchButton variant="default" onClick={handleGoBack}>
            돌아가기
          </FullSearchButton>
        ) : (
          <FullSearchButton variant="approve" onClick={handleFullList}>
            전체 보기
          </FullSearchButton>
        )}
      </PageTitleWrapper>

      <AdminTable>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={vacationNo.length === setVacationData.length && setVacationData.length > 0}
                disabled={isFullList}
              />
            </TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>일정</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>사유</TableHeader>
            <TableHeader>상태 ↓</TableHeader>
          </tr>
        </thead>
        <tbody>
          {pagedData.map((req) => (
            <TableRow key={req.vacationNo}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={vacationNo.includes(req.vacationNo)}
                  onChange={() => handleSelectSingle(req.vacationNo)}
                  disabled={isFullList}
                />
              </TableCell>
              <TableCell>{req.vacationNo}</TableCell>
              <TableCell>
                {req.startDate}~{req.endDate}
              </TableCell>
              <TableCell>{req.userName}</TableCell>
              <TableCell>{req.content}</TableCell>
              <TableCell>
                {console.log(req.status, getStatusText(req.status))}
                <StatusBadge status={req.status}>{getStatusText(req.status)}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </AdminTable>

      <ButtonContainer>
        <ActionButton variant="reject" onClick={() => handleReturnAction(vacationNo)}>
          거부
        </ActionButton>
        <ActionButton variant="approve" onClick={() => handleApprovedAction(vacationNo)}>
          승인
        </ActionButton>
      </ButtonContainer>
      <BottomBar>
        <Pagination>
          <PageButton disabled={!hasPrevious} onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              style={{ background: currentPage === i + 1 ? '#2563eb' : '#3b82f6' }}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton disabled={!hasNext} onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </PageButton>
        </Pagination>
      </BottomBar>
    </MainContent>
  );
};

export default VacationAdmin;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 15px;
  text-align: center;

  th,
  td {
    padding: 12px 8px;
    border-bottom: 1px solid #eee;
  }
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  color: #555;
  font-weight: 600;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  color: #333;

  input[type='checkbox'] {
    cursor: pointer;
  }
`;

// 2. '거부' 상태에 대한 스타일 조건 추가
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

const PageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 25px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.variant === 'approve' ? '#2563EB' : '#9CA3AF')};

  &:hover {
    opacity: 0.9;
  }
`;

const FullSearchButton = styled(ActionButton)`
  background-color: ${(props) => (props.variant === 'approve' ? '#2563EB' : '#9CA3AF')};
`;
