import React, { useState } from 'react';
import styled from 'styled-components';
import { MainContent } from '../../styles/common/MainContentLayout';
import { userService } from '../../api/users';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle } from 'react-icons/fi';
import useUserStore from '../../Store/useStore';

const UpdateMyInfo = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const { updateUser } = useUserStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const userId = localStorage.getItem('userId');
    e.preventDefault();

    if (newPwd !== newPwdConfirm) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPwd.length < 8) {
      toast.error('비밀번호는 최소 8자리 이상이어야 합니다.');
      return;
    }

    try {
      await userService.updateUser({
        userId,
        password,
        newPwd,
        userName,
      });

      updateUser({ userName });
      toast.success('회원 정보가 수정되었습니다.');
      setTimeout(() => navigate('/MemberDashBoard'), 1500);
    } catch (err) {
      toast.error('수정에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <MainContent>
      <Container>
        <Card>
          <Title>내 정보 수정</Title>
          <Form onSubmit={handleSubmit}>
            <FieldWrapper>
              <Label>이름</Label>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
              <HelpText>회원님의 이름을 입력해 주세요.</HelpText>
            </FieldWrapper>

            <FieldWrapper>
              <Label>현재 비밀번호</Label>
              <Input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호"
                required
              />
              <HelpText>회원님의 현재 비밀번호를 입력해 주세요.</HelpText>
            </FieldWrapper>

            <FieldWrapper>
              <Label>새 비밀번호</Label>
              <Input
                type="password"
                value={newPwd}
                autoComplete="new-password"
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="새 비밀번호 (최소 8자)"
                required
              />
              <HelpText>안전한 비밀번호를 위해 8자 이상으로 설정하세요.</HelpText>
            </FieldWrapper>

            <FieldWrapper>
              <Label>새 비밀번호 확인</Label>
              <Input
                type="password"
                value={newPwdConfirm}
                autoComplete="new-password"
                onChange={(e) => setNewPwdConfirm(e.target.value)}
                placeholder="새 비밀번호 확인"
                required
              />
              <HelpText>새 비밀번호를 다시 한 번 입력해 주세요.</HelpText>
            </FieldWrapper>

            <SubmitButton type="submit">
              <FiCheckCircle size={20} style={{ marginRight: '8px' }} />
              정보 수정
            </SubmitButton>
          </Form>
        </Card>
      </Container>
    </MainContent>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;

  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: #f9fafd;
  padding: 3.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 1.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #ccc;
  border-radius: 12px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 8px rgba(0, 102, 255, 0.3);
  }

  &::placeholder {
    color: #bbb;
  }
`;

const HelpText = styled.small`
  margin-top: 4px;
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 16px;
  background: linear-gradient(45deg, #0066ff, #0052cc);
  color: white;
  font-weight: 700;
  font-size: 1.15rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.04em;
  transition:
    background 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background: linear-gradient(45deg, #0052cc, #003d99);
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
`;

export default UpdateMyInfo;
