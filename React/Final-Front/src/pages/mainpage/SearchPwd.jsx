import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { userService } from '../../api/users';
import loginImage from '../../assets/메인페이지사진1.jpg';
import { toast } from 'react-toastify';

const SearchPwd = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !email) {
      toast.warn('아이디와 이메일을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await userService.resetPassword(userId, email); // 이메일 발송 API
      toast.success('비밀번호 재설정 이메일을 전송했습니다. 이메일을 확인해주세요.');
      console.log('현재 데이터 : ', response.data);
    } catch (error) {
      toast.error('일치하는 계정이 없습니다. 다시 확인해주세요.');
      console.error(error);
    }
  };

  return (
    <PageContainer>
      <ImageContainer bgImage={loginImage}></ImageContainer>
      <FormContainer>
        <FormCard>
          <Title>비밀번호 찾기</Title>
          <Subtitle>가입 시 등록한 이메일로 임시 비밀번호를 전송해드립니다.</Subtitle>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="아이디 입력"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">이메일 전송</Button>
            <BackButton to="/login">로그인 페이지로 돌아가기</BackButton>
          </Form>
        </FormCard>
      </FormContainer>
    </PageContainer>
  );
};

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

const BackButton = styled(Link)`
  background-color: #6c757d;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 1rem;
  display: block;
  margin-top: 0.5rem;
  text-decoration: none;

  &:hover {
    background-color: #5a6268;
  }
`;

export default SearchPwd;
