import React from 'react';
import styled from 'styled-components';

// 모달 배경 (오버레이)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소 위에 표시 */
`;

// 모달 컨텐츠 영역
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%; /* 모달 너비 */
  max-width: 700px; /* 최대 너비 */
  max-height: 90vh; /* 최대 높이 (스크롤 가능하게) */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
  position: relative; /* 닫기 버튼 위치 지정을 위해 */
`;

// 모달 닫기 버튼
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;

  &:hover {
    color: #000;
  }
`;

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null; // isOpen이 false면 아무것도 렌더링하지 않음

  return (
    <ModalOverlay onClick={onClose}> {/* 오버레이 클릭 시 모달 닫기 */}
      <ModalContent onClick={e => e.stopPropagation()}> {/* 모달 컨텐츠 클릭은 전파 중지 */}
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* 닫기 버튼 */}
        {title && <h2>{title}</h2>} {/* 제목이 있다면 표시 */}
        {children} {/* 모달 내부에 렌더링할 내용 */}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;