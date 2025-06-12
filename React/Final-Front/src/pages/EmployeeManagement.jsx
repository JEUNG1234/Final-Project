import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUsersCog } from 'react-icons/fa';
// 1. useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
import { MainContent, PageTitle, PageHeader as BasePageHeader } from '../styles/common/MainContentLayout';

// Mock 데이터
const initialEmployees = [
  { id: 1, joinDate: '5.29', name: '최지원', position: '대표', department: '-', email: 'nikihwangg@naver.com' },
  { id: 2, joinDate: '5.29', name: 'alice', position: '팀장', department: '개발팀', email: 'abc@naver.com' },
  { id: 3, joinDate: '5.29', name: 'james', position: '사원', department: '개발팀', email: 'abc@naver.com' },
  { id: 4, joinDate: '5.29', name: 'kim', position: '사원', department: '개발팀', email: 'abc@naver.com' },
  { id: 5, joinDate: '5.29', name: '박지성', position: '사원', department: '개발팀', email: 'abc@naver.com' },
];
const positions = ['대표', '팀장', '사원', '인턴'];
const departments = ['개발팀', '기획팀', '디자인팀', '인사팀'];

const EmployeeManagement = () => {
  // 2. useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedIds, setSelectedIds] = useState([]);

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(employees.map((emp) => emp.id));
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

  // 직급 또는 부서 변경 핸들러
  const handleFieldChange = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
    // 실제 앱에서는 여기서 API를 호출하여 서버 데이터를 업데이트합니다.
  };

  // 계정 삭제 핸들러
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 계정을 선택해주세요.');
      return;
    }
    if (window.confirm(`${selectedIds.length}개의 계정을 정말 삭제하시겠습니까?`)) {
      setEmployees((prev) => prev.filter((emp) => !selectedIds.includes(emp.id)));
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
            <TableHeader><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === employees.length && employees.length > 0} /></TableHeader>
            <TableHeader>번호 ↓</TableHeader>
            <TableHeader>회원가입날짜</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>직급</TableHeader>
            <TableHeader>부서</TableHeader>
            <TableHeader>이메일</TableHeader>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <TableCell><input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => handleSelectSingle(emp.id)} /></TableCell>
              <TableCell>{emp.id}</TableCell>
              <TableCell>{emp.joinDate}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>
                <StyledSelect value={emp.position} onChange={(e) => handleFieldChange(emp.id, 'position', e.target.value)}>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </StyledSelect>
              </TableCell>
              <TableCell>
                <StyledSelect value={emp.department} onChange={(e) => handleFieldChange(emp.id, 'department', e.target.value)}>
                  <option value="-">-</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
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