import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/메인페이지사진1.jpg'; // 상대 경로로 변경!

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User ID:', userId);
    console.log('Password:', password);
    alert('로그인 시도! (실제 로직 필요)');
    navigate('/votelist');
  };

  return (
    <LoginPageContainer>
      <ImageContainer bgImage={loginImage}></ImageContainer>
      <LoginFormContainer>
        <FormCard>
          <LoginTitle>로그인</LoginTitle>
          <LoginSubtitle>서비스를 이용하시려면 로그인해주세요.</LoginSubtitle>
          <LoginForm onSubmit={handleSubmit}>
            <InputField
              type="text"
              id="userId"
              placeholder="아이디를 입력하세요."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <InputField
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit">로그인</LoginButton>
            <BackButton to="/">뒤로가기</BackButton>
          </LoginForm>
          <SignUpLink to="/signup">회원가입</SignUpLink>
        </FormCard>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

const LoginPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const FormCard = styled.div`
  background: #ffffff; /* 흰색 배경 */
  width: 100%;
  border-radius: 15px; /* 둥근 모서리 */
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); /* 그림자 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  z-index: 10;
  position: relative;
  @media (max-width: 768px) {
    width: 90%; /* 모바일에서 더 넓게 사용 */
    padding: 30px;
  }
`;

const ImageContainer = styled.div`
  width: 70%;
  background-image: url(${(props) => props.bgImage}); /* props.bgImage 값을 사용합니다. */
  background-size: cover;
  background-position: center;
`;

const LoginFormContainer = styled.div`
  width: 30%;
  background: #f3fbff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #333;
  width: 100%;
`;

const LoginSubtitle = styled.p`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
`;

const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;

const InputField = styled.input`
  padding: 10px;
  border: none;
  background: #e9e9e9;
  color: black;
  border-radius: 10px;
  font-size: 0.9rem;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
`;

const LoginButton = styled.button`
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 13px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 8px;
  text-decoration: none;

  &:hover {
    background-color: #5a6268;
    color: white;
  }
`;

const SignUpLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
