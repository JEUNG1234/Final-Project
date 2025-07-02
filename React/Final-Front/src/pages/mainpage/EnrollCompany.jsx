import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import loginImage from '../../assets/메인페이지사진1.jpg';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../api/company';

const EnrollCompany = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  const createCompanyCode = () => {
    const letters = Array.from(
      { length: 3 },
      () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
    ).join('');

    const numbers = Math.floor(100 + Math.random() * 900); // 100~999

    return letters + numbers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const companyCode = createCompanyCode();

    try {
      const response = await companyService.enrollCompany({
        companyCode,
        companyName,
        companyPhone,
        companyAddress,
      });

      if (response.status === 200 || response.status === 201) {
        alert('회사신청이 성공적으로 처리되었습니다. 대표님은 계정생성 해주세요.');
        navigate('/enrolladmin', { state: { companyCode } });
      } else {
        alert('회사신청 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회사신청 중 오류 발생:', error);
      alert('오류가 발생했습니다. 관리자에게 문의해주세요.');
    }
  };

  return (
    <LoginPageContainer>
      <ImageContainer bgImage={loginImage}></ImageContainer>
      <LoginFormContainer>
        <FormCard>
          <LoginTitle>회사신청</LoginTitle>
          <LoginSubtitle>회사코드 생성을 위해 신청해주세요.</LoginSubtitle>
          <LoginForm onSubmit={handleSubmit}>
            <InputField
              type="text"
              id="companyName"
              placeholder="회사명"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <InputField
              type="text"
              id="phone"
              placeholder="전화번호"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              required
            />
            <InputField
              type="textarea"
              id="address"
              placeholder="매장주소"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
            />
            <LoginButton type="submit">신청하기</LoginButton>
            <BackButton to="/">뒤로가기</BackButton>
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
  font-family: 'Pretendard', sans-serif;
  &:focus {
    outline: none;
    border-color: #024b98;
    box-shadow: 0 0 5px rgba(0, 123, 255, 60);
  }
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

export default EnrollCompany;
