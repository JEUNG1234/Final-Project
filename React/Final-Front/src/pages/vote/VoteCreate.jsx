import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainContent as BaseMainContent, PageTitle } from '../../styles/common/MainContentLayout';
import { voteService } from '../../api/voteService';
import useUserStore from '../../Store/useStore';

const VoteCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state;
  const isPrefilled = !!prefillData;

  const [title, setTitle] = useState(prefillData?.title || '이벤트달 건강 챌린지 투표');
  const [options, setOptions] = useState([
    { id: 1, text: '헬스장 매일 가기' },
    { id: 2, text: '주말마다 등산 가기' },
    { id: 3, text: '점심메뉴 다 같이 식단하기' },
    { id: 4, text: '1일 10000보 걷기' },
  ]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(prefillData?.endDate || '2025-07-04');
  const [voteType, setVoteType] = useState(prefillData?.type === 'LONG' ? '장기' : '단기');
  const [points, setPoints] = useState(prefillData?.points || '300');
  const { user } = useUserStore();

  const handleAddOption = () => {
    const newId = options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions([...options, { id: newId, text: '' }]);
  };

  const handleRemoveOption = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (id, text) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !endDate) {
      alert('제목과 종료 날짜를 모두 입력해주세요.');
      return;
    }
    if (options.some((opt) => !opt.text.trim())) {
      alert('비어있는 투표 항목이 있습니다.');
      return;
    }
    if (!user?.userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 날짜 유효성 검사 추가
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert('종료일은 시작일보다 빠를 수 없습니다. 날짜를 다시 확인해주세요.');
      return;
    }

    const payload = {
      userId: user.userId,
      voteTitle: title,
      voteType: voteType === '장기' ? 'LONG' : 'SHORT',
      voteEndDate: endDate,
      options: options.map((opt) => opt.text),
      anonymous: isAnonymous,
      points: parseInt(points, 10) || 0,
    };

    try {
      await voteService.createVote(payload);
      alert('투표가 성공적으로 생성되었습니다.');
      navigate('/votelist');
    } catch (error) {
      alert('투표 생성에 실패했습니다. 서버 상태를 확인하거나 다시 시도해주세요.');
      console.error('투표 생성 실패:', error);
    }
  };

  return (
    <MainContent>
      <ComponentHeader>
        <ComponentTitle>투표 생성</ComponentTitle>
        <Line />
      </ComponentHeader>
      <Form>
        <FormGroup>
          <Label>투표 제목</Label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>투표 기간</Label>
          <DateWrapper>
            <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} readOnly={isPrefilled} />
            <span>–</span>
            <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} readOnly={isPrefilled} />
            <CheckboxWrapper>
              <CheckboxLabel disabled={isPrefilled}>
                <input
                  type="radio"
                  name="voteType"
                  value="장기"
                  checked={voteType === '장기'}
                  onChange={(e) => setVoteType(e.target.value)}
                  disabled={isPrefilled}
                />{' '}
                장기
              </CheckboxLabel>
              <CheckboxLabel disabled={isPrefilled}>
                <input
                  type="radio"
                  name="voteType"
                  value="단기"
                  checked={voteType === '단기'}
                  onChange={(e) => setVoteType(e.target.value)}
                  disabled={isPrefilled}
                />{' '}
                단기
              </CheckboxLabel>
            </CheckboxWrapper>
          </DateWrapper>
        </FormGroup>
        <FormGroup>
          <Label>투표 항목</Label>
          <OptionsList>
            {options.map((option) => (
              <OptionItem key={option.id}>
                <Input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                />
                <DeleteButton onClick={() => handleRemoveOption(option.id)}>×</DeleteButton>
              </OptionItem>
            ))}
          </OptionsList>
        </FormGroup>
        <BottomControlsWrapper>
          <AddButton onClick={handleAddOption}>+ 항목 추가</AddButton>
          <RightControls>
            <ToggleWrapper>
              <ToggleButton $active={isAnonymous} onClick={() => setIsAnonymous(true)}>
                익명
              </ToggleButton>
              <ToggleButton $active={!isAnonymous} onClick={() => setIsAnonymous(false)}>
                비익명
              </ToggleButton>
            </ToggleWrapper>
            <PointWrapper>
              <Label>포인트</Label>
              <PointInput type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
            </PointWrapper>
          </RightControls>
        </BottomControlsWrapper>
        <ActionButtons>
          <SubmitButton onClick={handleSubmit}>투표 생성</SubmitButton>
          <CancelButton onClick={() => navigate(-1)}>취소하기</CancelButton>
        </ActionButtons>
      </Form>
    </MainContent>
  );
};

const MainContent = styled(BaseMainContent)`
  margin: 30px auto;
  padding: 30px 40px;
`;
const ComponentHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;
const ComponentTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
`;
const Line = styled.div`
  width: 100%;
  height: 2px;
  background-color: #007bff;
  margin: 16px auto 0;
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div``;
const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f8f9fa;
`;
const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    font-size: 18px;
  }
`;
const DateInput = styled(Input)`
  width: auto;
  flex-grow: 1;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-left: 20px;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 5px;
  color: ${(props) => (props.disabled ? '#aaa' : 'inherit')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
`;
const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const DeleteButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background-color: #dc3545;
  color: white;
  font-size: 24px;
  font-weight: bold;
  line-height: 45px;
  text-align: center;
`;
const AddButton = styled.button`
  padding: 10px 15px;
  font-size: 15px;
  font-weight: 600;
  background-color: #20c997;
  color: white;
  border-radius: 8px;
`;
const BottomControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid #007bff;
  border-radius: 8px;
  overflow: hidden;
`;
const ToggleButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  ${(props) =>
    props.$active
      ? css`
          background-color: #007bff;
          color: white;
        `
      : css`
          background-color: white;
          color: #007bff;
        `}
`;
const PointWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  label {
    margin-bottom: 0;
  }
`;
const PointInput = styled(Input)`
  width: 150px;
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
`;
const BaseButton = styled.button`
  padding: 14px 40px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;
const SubmitButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;
  border: none;
`;
const CancelButton = styled(BaseButton)`
  background-color: #6c757d;
  color: white;
  border: none;
`;

export default VoteCreate;