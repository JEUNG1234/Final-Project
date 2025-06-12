import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUserCheck } from 'react-icons/fa';
import { MainContent, PageTitle, PageHeader as BasePageHeader } from '../styles/common/MainContentLayout';

// Mock 데이터: 승인을 기다리는 직원 목록
const mockApprovalList = [
  { id: 10, joinDate: '5.29', name: '최지원', companyCode: 'A001', email: 'abc@naver.com', status: '대기' },
  { id: 9, joinDate: '5.29', name: 'alice', companyCode: 'A001', email: 'assd@naver.com', status: '대기' },
  { id: 8, joinDate: '5.29', name: 'james', companyCode: 'A001', email: 'qwer@gmail.com', status: '대기' },
  { id: 7, joinDate: '5.29', name: 'kim', companyCode: 'A001', email: 'qwer@gmail.com', status: '대기' },
  { id: 6, joinDate: '5.29', name: '박지성', companyCode: 'A001', email: 'asd@naver.com', status: '대기' },
];

const EmployeeApproval = () => {
  const navigate = useNavigate();
  const [approvalList, setApprovalList] = useState(mockApprovalList);
  const [selectedIds, setSelectedIds] = useState([]);

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(approvalList.map((req) => req.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 체크박스 개별 선택/해제
  const handleSelectSingle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 승인/거부 처리 핸들러
  const handleAction = (action) => {
    if (selectedIds.length === 0) {
      alert('처리할 항목을 선택해주세요.');
      return;
    }
    
    // 실제로는 여기서 API를 호출하여 서버에 상태 변경을 요청합니다.
    console.log(`선택된 ID: ${selectedIds}, 처리: ${action}`);
    
    // 처리 후 목록에서 제거
    setApprovalList((prevList) =>
      prevList.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]); // 선택 초기화
    alert(`${selectedIds.length}개의 계정을 ${action} 처리했습니다.`);
  };

  return (
    <MainContent>
      <PageHeader>
        <Title>
          <FaUserCheck /> 직원 승인
        </Title>
        <TopButton onClick={() => navigate('/employeemanagement')}>직원관리</TopButton>
      </PageHeader>

      <AdminTable>
        <thead>
          <tr>
            <TableHeader><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === approvalList.length && approvalList.length > 0}/></TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>회원가입날짜</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>회사코드</TableHeader>
            <TableHeader>이메일</TableHeader>
            <TableHeader>승인 여부</TableHeader>
          </tr>
        </thead>
        <tbody>
          {approvalList.map((req) => (
            <tr key={req.id}>
              <TableCell><input type="checkbox" checked={selectedIds.includes(req.id)} onChange={() => handleSelectSingle(req.id)} /></TableCell>
              <TableCell>{req.id}</TableCell>
              <TableCell>{req.joinDate}</TableCell>
              <TableCell>{req.name}</TableCell>
              <TableCell>{req.companyCode}</TableCell>
              <TableCell>{req.email}</TableCell>
              <TableCell>
                <StatusBadge status={req.status}>{req.status}</StatusBadge>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </AdminTable>
      
      <ButtonContainer>
        <ActionButton variant="reject" onClick={() => handleAction('거부')}>거부</ActionButton>
        <ActionButton variant="approve" onClick={() => handleAction('승인')}>승인</ActionButton>
      </ButtonContainer>
    </MainContent>
  );
};

export default EmployeeApproval;

// --- Styled Components (기존 페이지들과 거의 동일한 스타일 재사용) ---

const PageHeader = styled(BasePageHeader)`
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(PageTitle)`
  margin-bottom: 0;
`;

const TopButton = styled.button`
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 15px;
  text-align: center;
  
  th, td {
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

const TableCell = styled.td`
  color: #333;
  
  input[type="checkbox"] {
    cursor: pointer;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 13px;
  color: #9A6700;
  background-color: #FEF9C3;
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