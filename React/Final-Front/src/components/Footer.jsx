// src/components/Footer.jsx
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #333; /* 어두운 배경색 */
  color: #f0f0f0; /* 밝은 글자색 */
  padding: 2.5rem 3rem;
  box-sizing: border-box;
  text-align: center;
  font-size: 0.9rem;
  margin-top: auto; /* Footer가 페이지 하단에 붙도록 (Flexbox 부모와 함께 사용 시) */

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactInfo = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #ccc;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <ContactInfo>
          (주)SOWM | 대표: 황동준 | 사업자등록번호: 123-45-67890
          <br />
          주소: 서울특별시 강남구 테헤란로 123 헬스빌딩 10층
          <br />
          전화: 02-1234-5678 | 이메일: nikihwangg@naver.com
        </ContactInfo>
        <Copyright>&copy; {new Date().getFullYear()} SOWM. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
