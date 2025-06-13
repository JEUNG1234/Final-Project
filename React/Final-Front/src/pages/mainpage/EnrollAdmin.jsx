import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import loginImage from '../../assets/메인페이지사진1.jpg';
import { useNavigate } from 'react-router-dom';

const EnrollAdmin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [companyCode, setCompanyCode] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.companyCode) {
      setCompanyCode(location.state.companyCode);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== checkPassword) {
      setPasswordMismatchError(true);
      return;
    } else {
      setPasswordMismatchError(false);
    }

    alert('대표님 회원가입 성공 (실제 로직 및 백엔드 연동 필요)');
    navigate('/login');
  };

  return (
    <LoginPageContainer>
      <ImageContainer bgImage={loginImage}></ImageContainer>
      <LoginFormContainer>
        <FormCard>
          <LoginTitle>대표자 생성</LoginTitle>
          <LoginSubtitle>대표님께서는 회원가입해주세요.</LoginSubtitle>
          <LoginForm onSubmit={handleSubmit}>
            <InputField
              type="text"
              id="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <InputField
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputField
              type="password"
              id="checkPassword"
              placeholder="비밀번호 확인"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              required
            />
            {passwordMismatchError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
            <InputField
              type="text"
              id="userName"
              placeholder="이름"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <InputField
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              type="text"
              id="companycode"
              placeholder="회사코드"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              required
              readOnly
            />
            <LoginButton type="submit">회원가입</LoginButton>
            <BackButton to="/login">뒤로가기</BackButton>
          </LoginForm>
        </FormCard>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

const LoginPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ImageContainer = styled.div`
  width: 70%;
  background-image: url(${(props) => props.bgImage});
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
  padding: 32px; /* 2rem -> 32px */
`;

const LoginTitle = styled.h2`
  font-size: 32px; /* 2rem -> 32px */
  margin-bottom: 8px; /* 0.5rem -> 8px */
  text-align: center;
  color: #333;
  width: 100%;
`;

const LoginSubtitle = styled.p`
  font-size: 13px; /* 0.8rem -> 12.8px (반올림) */
  color: #777;
  margin-bottom: 32px; /* 2rem -> 32px */
  text-align: center;
  width: 100%;
`;

const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  margin-bottom: 19px;
`;

const InputField = styled.input`
  padding: 10px;
  border: none;
  background: #e9e9e9;
  color: black;
  border-radius: 10px;
  font-size: 14px;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
`;

const LoginButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 13px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;

export default EnrollAdmin;
