import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaClipboardCheck } from 'react-icons/fa';
// MainContent를 BaseMainContent로 가져와서 확장합니다.
import { MainContent as BaseMainContent, PageTitle } from '../../styles/common/MainContentLayout';
import useUserStore from '../../Store/useStore';
import { workationService } from '../../api/workation';

// 1. 스크롤 제거를 위해 기존 MainContent를 확장하고 min-height를 auto로 변경
const MainContent = styled(BaseMainContent)`
  min-height: auto;
`;

const WorkationAdmin = () => {
  const { user } = useUserStore();

  const [workationSubNo, setWorkationSubNo] = useState([]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = workationData.map((req) => req.workationSubNo);
      console.log("allIds", allIds)
      setWorkationSubNo(allIds);

    } else {
      setWorkationSubNo([]);
    }
  };

  useEffect(() => {
    const workationSubList = async () => {
      try {
        const data = await workationService.workationSubList(user.companyCode);
        console.log('워케이션 신청 리스트:', data);

        setWorkationData(data);
      } catch (error) {
        console.error('워케이션 신청 리스트 불러오기 실패:', error.message);
      }
    };
    workationSubList();
    console.log(workationData);
  }, []);

  const getStatusText = (status) => {
    if (status === 'W') return '대기';
    if (status === 'Y') return '승인';
    if (status === 'N') return '거절';
    return status;
  };

  const [workationData, setWorkationData] = useState([]);

  // 개별 선택/해제 핸들러
  const handleSelectSingle = (id) => {
    setWorkationSubNo((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  console.log('workationSubNo', workationSubNo);

  const handleReturnAction = async (workationSubNo) => {
    console.log('workationSubNo', workationSubNo);

    if (workationSubNo.length === 0) {
      alert('항목을 먼저 선택해주세요.');
      return;
    }
    try {
      const workResponse = await workationService.handleReturnAction(workationSubNo);

      console.log(workResponse);
      alert('성공적으로 처리되었습니다.');

      const updatedData = await workationService.workationSubList(user.companyCode);
      setWorkationData(updatedData);
      setWorkationSubNo([]);
    } catch (error) {
      console.error('워케이션 신청 승인 에러', error);
      alert('워케이션 신청 승인 중 에러가 발생했습니다.');
    }
  };

  const handleApprovedAction = async (workationSubNo) => {
    console.log('workationSubNo', workationSubNo);

    if (workationSubNo.length === 0) {
      alert('항목을 먼저 선택해주세요.');
      return;
    }
    try {
      const workResponse = await workationService.workationApprovedUpdate(workationSubNo);

      console.log(workResponse);
      alert('성공적으로 처리되었습니다.');

      const updatedData = await workationService.workationSubList(user.companyCode);
      setWorkationData(updatedData);
      setWorkationSubNo([]);
    } catch (error) {
      console.error('워케이션 신청 승인 에러', error);
      alert('워케이션 신청 승인 중 에러가 발생했습니다.');
    }
  };

  return (
    <MainContent>
      <PageTitle>
        <FaClipboardCheck /> 워케이션 승인
      </PageTitle>

      <AdminTable>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={workationSubNo.length === workationData.length && workationData.length > 0}
              />
            </TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>일정</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>제목</TableHeader>
            <TableHeader>사유</TableHeader>
            <TableHeader>상태 ↓</TableHeader>
          </tr>
        </thead>
        <tbody>
          {workationData.map((req) => (
            
            <TableRow key={req.workationSubNo}>
              
              <TableCell>
                <input
                  type="checkbox"
                  checked={workationSubNo.includes(req.workationSubNo)}
                  onChange={() => handleSelectSingle(req.workationSubNo)}
                />
              </TableCell>
              <TableCell>{req.workationSubNo}</TableCell>
              <TableCell>
                {req.workationStartDate}~{req.workationEndDate}
              </TableCell>
              <TableCell>{req.userName}</TableCell>
              <TableCell>{req.workationTitle}</TableCell>
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
        <ActionButton variant="reject" onClick={() => handleReturnAction({ workationSubNo })}>
          거부
        </ActionButton>
        <ActionButton variant="approve" onClick={() => handleApprovedAction({ workationSubNo })}>
          승인
        </ActionButton>
      </ButtonContainer>
    </MainContent>
  );
};

export default WorkationAdmin;

// --- Styled Components ---

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
