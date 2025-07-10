import React, { useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/메인페이지사진1.jpg';
import { userService } from '../../api/users';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.warn('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await userService.updatePassword(token, newPassword);
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다. 토큰이 유효하지 않거나 만료되었을 수 있습니다.');
      console.error(error);
    }
  };

  return (
    <PageContainer>
      <ImageContainer bgImage={loginImage} />
      <FormContainer>
        <FormCard>
          <Title>비밀번호 재설정</Title>
          <Subtitle>새 비밀번호를 입력해주세요.</Subtitle>
          <Form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">비밀번호 변경</Button>
          </Form>
        </FormCard>
      </FormContainer>
    </PageContainer>
  );
};

// 스타일 컴포넌트는 SearchPwd와 동일하게 복사

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ImageContainer = styled.div`
  width: 70%;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  width: 30%;
  background: #f3fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: #ffffff;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  background: #e9e9e9;
  border-radius: 10px;
  font-size: 0.9rem;
  height: 60px;

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.6);
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

export default ResetPassword;
