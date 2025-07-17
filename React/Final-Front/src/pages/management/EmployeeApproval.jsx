import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUsersCog } from 'react-icons/fa';
import { MainContent, PageTitle, PageHeader as BasePageHeader } from '../../styles/common/MainContentLayout';
import { useEffect } from 'react';
import { adminService } from '../../api/admin';
import useUserStore from '../../Store/useStore';

const EmployeeApproval = () => {
  const navigate = useNavigate();
  const [approvalList, setApprovalList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const user = useUserStore((state) => state.user);
  const companyCode = user?.companyCode;

  // 1. 초기 승인 대기자 목록 불러오기
  useEffect(() => {
    const fetchPendingEmployees = async () => {
      try {
        const data = await adminService.getUnapprovedEmployees({ companyCode });
        setApprovalList(data);
      } catch (error) {
        alert('승인 대기자 목록을 불러오는 데 실패했습니다.');
        console.error(error);
      }
    };
    fetchPendingEmployees();
  }, [companyCode]);

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(approvalList.map((req) => req.userId));
    } else {
      setSelectedIds([]);
    }
  };

  // 체크박스 개별 선택/해제
  const handleSelectSingle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // 승인/거부 처리 핸들러
  const handleAction = async (action) => {
    if (selectedIds.length === 0) {
      alert('처리할 항목을 선택해주세요.');
      return;
    }

    try {
      if (action === '승인') {
        const status = 'Y';
        const jobCode = 'J1';
        for (const userId of selectedIds) {
          await adminService.approveUser(userId, status, jobCode);
        }
      } else if (action === '거부') {
        // 거부(삭제) API에 selectedIds 배열 전체를 넘깁니다.
        await adminService.deleteUser(selectedIds);
      }
      setApprovalList((prevList) => prevList.filter((item) => !selectedIds.includes(item.userId)));
      setSelectedIds([]);
      alert(`${selectedIds.length}개의 계정을 ${action} 처리했습니다.`);
    } catch (err) {
      console.error('에러 발생', err);
    }
  };

  useEffect(() => {
    if (user?.jobCode != 'J2') {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/memberdashboard');
      return;
    }
  }, [user, navigate]);

  return (
    <MainContent>
      <PageHeader>
        <Title>
          <FaUsersCog /> 직원 승인
        </Title>
        <TopButton onClick={() => navigate('/employeemanagement')}>직원관리</TopButton>
      </PageHeader>

      <AdminTable>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length === approvalList.length && approvalList.length > 0}
              />
            </TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>회원가입날짜</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>회사코드</TableHeader>
            <TableHeader>이메일</TableHeader>
            <TableHeader>승인 여부</TableHeader>
          </tr>
        </thead>
        <tbody>
          {approvalList.map((req, index) => (
            <tr key={req.userId}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(req.userId)}
                  onChange={() => handleSelectSingle(req.userId)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{req.createdDate}</TableCell>
              <TableCell>{req.userName}</TableCell>
              <TableCell>{req.companyCode}</TableCell>
              <TableCell>{req.email}</TableCell>
              <TableCell>
                <StatusBadge status={req.status || '대기'}>{req.status === 'N' ? '대기' : req.status}</StatusBadge>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      <ButtonContainer>
        <ActionButton variant="reject" onClick={() => handleAction('거부')}>
          거부
        </ActionButton>
        <ActionButton variant="approve" onClick={() => handleAction('승인')}>
          승인
        </ActionButton>
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

const TableCell = styled.td`
  color: #333;

  input[type='checkbox'] {
    cursor: pointer;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 13px;
  color: #9a6700;
  background-color: #fef9c3;
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
