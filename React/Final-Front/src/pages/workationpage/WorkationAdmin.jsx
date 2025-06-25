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

// Mock 데이터 (실제로는 API를 통해 받아옵니다)
const mockData = [
  { id: 1, schedule: '5.29 - 5.31', name: '황동준', location: '부산', reason: '모름', status: '승인' },
  { id: 2, schedule: '5.29 - 5.31', name: '카리나', location: '경기도', reason: '커피 감', status: '승인' },
  { id: 3, schedule: '5.29 - 5.31', name: '윈터', location: '제주도', reason: '바다 보러 감', status: '승인' },
  { id: 4, schedule: '5.29 - 5.31', name: '정인구', location: '제주도', reason: '흑돼지 먹으러 감', status: '승인' },
  { id: 5, schedule: '5.29 - 5.31', name: '황윤창', location: '집', reason: '치킨 먹을거임', status: '승인' },
  { id: 6, schedule: '5.29 - 5.31', name: '박지성', location: '일본', reason: '라면 먹으러 감', status: '대기' },
  { id: 7, schedule: '5.29 - 5.31', name: 'kim', location: '방콕', reason: '방에서 콕 있을거임', status: '대기' },
  { id: 8, schedule: '5.29 - 5.31', name: 'james', location: '부산', reason: '국밥 먹으러 감', status: '대기' },
  { id: 9, schedule: '5.29 - 5.31', name: 'alice', location: '제주도', reason: '그냥2', status: '대기' },
  { id: 10, schedule: '5.29 - 5.31', name: '최지원', location: '제주도', reason: '그냥', status: '대기' },
];

const WorkationAdmin = () => {
  const { user } = useUserStore();
  const [requests, setRequests] = useState(mockData);
  const [selectedIds, setSelectedIds] = useState([]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = requests.map((req) => req.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const [workationData, setWorkationData] = useState([]);
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
    workationSubList;
    console.log(workationData);
  }, []);

  // 개별 선택/해제 핸들러
  const handleSelectSingle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // 승인/거부 처리 핸들러
  const handleAction = (action) => {
    if (selectedIds.length === 0) {
      alert('항목을 먼저 선택해주세요.');
      return;
    }
    // 실제 로직: API 호출로 선택된 ID들의 상태를 변경합니다.
    console.log(`${action}할 ID:`, selectedIds);
    // UI 업데이트 (예시)
    setRequests((prevReqs) => prevReqs.map((req) => (selectedIds.includes(req.id) ? { ...req, status: action } : req)));
    setSelectedIds([]); // 선택 해제
    alert(`${selectedIds.length}개의 항목을 ${action} 처리했습니다.`);
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
                checked={selectedIds.length === requests.length && requests.length > 0}
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
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(req.id)}
                  onChange={() => handleSelectSingle(req.id)}
                />
              </TableCell>
              <TableCell>{req.id}</TableCell>
              <TableCell>{req.schedule}</TableCell>
              <TableCell>{req.name}</TableCell>
              <TableCell>{req.location}</TableCell>
              <TableCell>{req.reason}</TableCell>
              <TableCell>
                <StatusBadge status={req.status}>{req.status}</StatusBadge>
              </TableCell>
            </TableRow>
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
    if (props.status === '대기') return '#9A6700';
    if (props.status === '승인') return '#047857';
    if (props.status === '거부') return '#991B1B';
    return '#333';
  }};

  background-color: ${(props) => {
    if (props.status === '대기') return '#FEF9C3';
    if (props.status === '승인') return '#D1FAE5';
    if (props.status === '거부') return '#FEE2E2';
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
