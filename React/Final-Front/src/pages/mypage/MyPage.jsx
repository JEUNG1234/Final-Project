import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ProfileImg from '../../assets/ronaldo.jpg';
import { userService } from '../../api/users';

// MyPage Component
const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  // 부서 코드 매핑
  const deptMap = {
    10: '개발팀',
    20: '디자인팀',
    30: '영업팀',
    40: '인사팀',
    50: '마케팅팀',
  };

  // 직급 코드 매핑
  const jobMap = {
    0: '관리자',
    1: '직원',
    2: '대리',
    3: '과장',
    4: '팀장',
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('저장된 유저 ID:', storedUserId);
    if (storedUserId) {
      userService
        .getUserInfo(storedUserId)
        .then((data) => {
          console.log('받은 유저 정보:', data);
          setUserInfo(data);
        })
        .catch((err) => {
          console.error('유저 정보 가져오기 실패:', err);
          setUserInfo(null);
        });
    }
  }, []);

  const handleImageChange = () => {
    alert('이미지 변경 기능 구현 예정');
    console.log({ setUserInfo });
  };

  const handleEdit = () => {
    alert('정보 수정 기능 구현 예정');
  };

  const handleWithdrawal = () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) {
      alert('회원 탈퇴 처리 예정');
    }
  };

  return (
    <MyPageContainer>
      <ContentCard>
        <ProfileSection>
          <ProfileImageWrapper>
            <ProfileImage src={ProfileImg} alt="프로필 이미지" />
            <ImageChangeButton onClick={handleImageChange}>이미지 변경</ImageChangeButton>
          </ProfileImageWrapper>

          <UserInfoSection>
            <WelcomeMessage>{userInfo?.userName}님, 환영합니다!</WelcomeMessage>
            <Divider />

            <UserDetailRow>
              <Label>아이디</Label>
              <UserInfoValue>: {userInfo?.userId}</UserInfoValue>
            </UserDetailRow>

            <UserDetailRow>
              <Label>이메일</Label>
              <UserInfoValue>: {userInfo?.email}</UserInfoValue>
            </UserDetailRow>

            <UserDetailRow>
              <Label>부서</Label>
              <UserInfoValue>: {deptMap[userInfo?.deptCode] || '미정'}</UserInfoValue>
            </UserDetailRow>

            <UserDetailRow>
              <Label>직급</Label>
              <UserInfoValue>: {jobMap[userInfo?.jobCode] || '미정'}</UserInfoValue>

            </UserDetailRow>
            <UserDetailRow>
              <Label>누적 포인트</Label>
              <UserInfoValue>: {userInfo?.point} | 1500 점당 휴가 하루 | 현재 추가 휴가 : 2일</UserInfoValue>
            </UserDetailRow>

            <ActionButton onClick={handleEdit}>수정하기</ActionButton>
          </UserInfoSection>
        </ProfileSection>

        <PostListSection>
          <SectionTitle>작성 글 목록</SectionTitle>
          <Divider />

          <NoPostsMessage>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
            작성한 게시글이 존재하지 않습니다.
          </NoPostsMessage>
          {/* ButtonGroup을 PostListSection 내부로 이동 */}
          <ButtonGroup>
            <WithdrawButton onClick={handleWithdrawal}>회원 탈퇴</WithdrawButton>
            <ReturnButton to="/">돌아가기</ReturnButton>
          </ButtonGroup>
        </PostListSection>
      </ContentCard>
    </MyPageContainer>
  );
};

const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #e6f1ff; // 연한 배경색
  min-height: calc(100vh - 100px - 68px); // Header(100px)와 Footer(68px)를 제외한 최소 높이
  font-family: 'Pretendard', sans-serif; // 폰트 지정
  box-sizing: border-box;
`;

const ContentCard = styled.div`
  background-color: #f7f9fc; // 카드 배경색 (이미지와 유사하게)
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1200px; // 최대 너비 설정
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 30px; // 각 섹션 간의 간격

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start; // 이미지와 정보 블록 상단 정렬
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 300px;
  height: 320px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #e0e0e0;
`;

const ImageChangeButton = styled.button`
  background-color: #ffffff;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ebebeb;
  }
`;

const UserInfoSection = styled.div`
  background: #ffffff; // 흰색 배경으로 변경 (이미지 참고)
  border-radius: 5px;
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const WelcomeMessage = styled.h3`
  color: #2378ff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

const UserDetailRow = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 16px;
  color: #555;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 10px;
  min-width: 60px;
`;

const UserInfoValue = styled.span`
  font-weight: 400;
  color: #333;
`;

const ActionButton = styled.button`
  background-color: #2378ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 20px;
  width: 100%; // 너비 100%로 설정하여 부모 컨테이너에 맞춤

  &:hover {
    background-color: #1a60cc;
  }
`;

const PostListSection = styled.div`
  background: #ffffff; // 흰색 배경으로 변경 (이미지 참고)
  border-radius: 5px;
  padding: 20px;
  margin-top: 30px; // 이전 섹션과의 간격
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const SectionTitle = styled.h4`
  font-size: 20px;
  color: #333;
  font-weight: 600;
  text-align: left;
  width: 100%;
`;

const NoPostsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #888;
  font-size: 16px;
  padding: 30px;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  width: 80%;
  text-align: center;

  svg {
    font-size: 30px;
    color: #ccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px; // 작성 글 목록 아래 간격
  width: 100%; // PostListSection의 내부 너비에 맞춤
  justify-content: center; // 버튼들을 가운데 정렬

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const WithdrawButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
  max-width: 300px; // 버튼 최대 너비

  &:hover {
    background-color: #e05252;
  }

  @media (max-width: 768px) {
    width: 80%;
    max-width: none;
  }
`;

const ReturnButton = styled(Link)`
  background-color: #63d471;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  max-width: 300px; // 버튼 최대 너비

  &:hover {
    background-color: #4caf50;
  }

  @media (max-width: 768px) {
    width: 80%;
    max-width: none;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
`;

export default MyPage;
