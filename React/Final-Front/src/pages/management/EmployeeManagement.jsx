import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUsersCog } from 'react-icons/fa';
// 1. useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
import { MainContent, PageTitle, PageHeader as BasePageHeader } from '../../styles/common/MainContentLayout';
import { useEffect } from 'react';
import { adminService } from '../../api/admin';
import useUserStore from '../../Store/useStore';

const EmployeeManagement = () => {
  // 2. useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const user = useUserStore((state) => state.user);
  const companyCode = user?.companyCode;

  // 부서 코드 매핑
  const deptMap = {
    D1: '개발팀',
    D2: '디자인팀',
    D3: '영업팀',
    D4: '인사팀',
    D5: '마케팅팀',
  };

  // 직급 코드 매핑
  const jobMap = {
    J0: '외부인',
    J1: '사원',
    J2: '관리자',
    J3: '팀장',
    J4: '과장',
  };

  useEffect(() => {
    console.log('API 호출할 회사 코드:', companyCode);
    const fetchEmployees = async () => {
      try {
        const data = await adminService.MemberManagement({ companyCode });
        setEmployees(data);
        console.log('현재 로그인 된 계정 정보 : ', data);
      } catch (error) {
        console.error('직원 정보 불러오기 실패', error);
      }
    };

    fetchEmployees();
  }, [companyCode]);

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(employees.map((emp) => emp.userId));
    } else {
      setSelectedIds([]);
    }
  };

  // 체크박스 개별 선택/해제
  const handleSelectSingle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // 직급 또는 부서 변경 핸들러
  const handleFieldChange = async (userId, field, value) => {
    const updatedEmployee = employees.find((emp) => emp.userId === userId);
    if (!updatedEmployee) return;

    const updatedData = {
      ...updatedEmployee,
      [field]: value,
    };

    try {
      await adminService.UpdateMemberRole(userId, {
        jobCode: updatedData.jobCode,
        deptCode: updatedData.deptCode,
      });

      setEmployees((prev) => prev.map((emp) => (emp.userId === userId ? { ...emp, [field]: value } : emp)));
    } catch (error) {
      console.error('직급/부서 변경 실패:', error);
      alert('변경에 실패했습니다.');
    }
  };

  // 계정 삭제 핸들러
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 계정을 선택해주세요.');
      return;
    }
    if (window.confirm(`${selectedIds.length}개의 계정을 정말 삭제하시겠습니까?`)) {
      setEmployees((prev) => prev.filter((emp) => !selectedIds.includes(emp.userId)));
      setSelectedIds([]);
      alert('선택한 계정이 삭제되었습니다.');
      // 실제 앱에서는 여기서 API를 호출하여 서버 데이터를 삭제합니다.
    }
  };

  return (
    <MainContent>
      <PageHeader>
        <Title>
          <FaUsersCog /> 직원 관리
        </Title>
        {/* 3. TopButton에 onClick 이벤트를 추가하여 페이지 이동 기능을 연결합니다. */}
        <TopButton onClick={() => navigate('/employeeapproval')}>직원승인</TopButton>
      </PageHeader>

      <AdminTable>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length === employees.length && employees.length > 0}
              />
            </TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>회원가입날짜</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>직급</TableHeader>
            <TableHeader>부서</TableHeader>
            <TableHeader>이메일</TableHeader>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp.userId}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.userId)}
                  onChange={() => handleSelectSingle(emp.userId)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{emp.createdDate}</TableCell>
              <TableCell>{emp.userName}</TableCell>
              <TableCell>
                <StyledSelect
                  value={emp.jobCode}
                  onChange={(e) => handleFieldChange(emp.userId, 'jobCode', e.target.value)}
                >
                  {Object.entries(jobMap).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </StyledSelect>
              </TableCell>
              <TableCell>
                <StyledSelect
                  value={emp.deptCode}
                  onChange={(e) => handleFieldChange(emp.userId, 'deptCode', e.target.value)}
                >
                  <option value="">-</option>
                  {Object.entries(deptMap).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </StyledSelect>
              </TableCell>
              <TableCell>{emp.email}</TableCell>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      <BottomActionContainer>
        <DeleteButton onClick={handleDelete}>계정 삭제</DeleteButton>
      </BottomActionContainer>
    </MainContent>
  );
};

export default EmployeeManagement;

// --- Styled Components ---

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

const StyledSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const BottomActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  padding: 10px 25px;
  font-size: 15px;
  font-weight: 600;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
  background-color: #f8f9fa;

  &:hover {
    background-color: #e2e6ea;
  }
`;
