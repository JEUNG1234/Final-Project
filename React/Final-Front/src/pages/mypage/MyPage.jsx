import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ProfileImg from '../../assets/ronaldo.jpg';
import { userService } from '../../api/users';
import { toast } from 'react-toastify';
import BoardAPI from '../../api/board';
import { fileupload } from '../../api/fileupload';
import defaultProfile from '../../assets/profile.jpg';

// MyPage Component
const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [myPosts, setMyPosts] = useState([]); // 유저 게시글 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) return;

    userService
      .getUserInfo(storedUserId)
      .then((data) => {
        setUserInfo(data);
        return BoardAPI.getBoardList({
          page: 0,
          size: 1000,
          sort: 'createdDate,desc',
          companyCode: data.companyCode,
        });
      })
      .then((res) => {
        const allPosts = res.data.content;
        const filtered = allPosts.filter((post) => post.userId === storedUserId);
        setMyPosts(filtered);
      })
      .catch((err) => {
        console.error('유저 정보 또는 게시글 조회 실패:', err);
        setUserInfo(null);
        setMyPosts([]);
      });
  }, []);

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      // 이미지 s3 에 mypage 폴더로 업로드
      const res = await fileupload.uploadImageToS3(file, 'mypage/');
      const uploadUrl = res.url;

      // 백엔드로 프로필 이미지 변경 요청
      if (userInfo) {
        await userService.uploadProfileImage(userInfo.userId, {
          imgUrl: uploadUrl,
          size: file.size,
          changedName: res.filename, // 가능하면 추가
          originalName: file.name,
        });
      }

      // 유저 정보가 존재할때만 업데이트
      if (userInfo) {
        setUserInfo((prev) => ({
          ...prev,
          profileImageUrl: uploadUrl,
          profileImagePath: res.filename,
        }));
      }
      toast.success('프로필 이미지가 변경되었습니다.');
      console.log('이미지 업로드 성공', uploadUrl, res);
    } catch (err) {
      console.log('이미지 업로드 실패', err);
    }
    console.log({ setUserInfo });
  };

  const handleEdit = () => {
    navigate('/updatemyinfo');
  };

  const handleWithdrawal = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await userService.deleteUser(userId);
      console.log('회원 탈퇴 성공', response);
      toast.success('회원 탈퇴하셨습니다.');
      // 인덱스 화면으로 넘기기
      navigate('/');
    } catch (err) {
      console.log('회원 탈퇴에 실패했습니다.', err);
    }
  };
  console.log('프로필 이미지 URL:', userInfo?.profileImageUrl);

  return (
    <MyPageContainer>
      <ContentCard>
        <ProfileSection>
          <ProfileImageWrapper>
            <ProfileImage
              src={
                userInfo?.profileImagePath
                  ? `https://d1qzqzab49ueo8.cloudfront.net/${userInfo.profileImagePath}`
                  : defaultProfile
              }
              alt="프로필 이미지"
            />

            <ImageChangeButton onClick={handleButtonClick}>이미지 변경</ImageChangeButton>

            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
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
              <UserInfoValue>: {userInfo?.deptName || '-'}</UserInfoValue>
            </UserDetailRow>

            <UserDetailRow>
              <Label>직급</Label>
              <UserInfoValue>: {userInfo?.jobName || '-'}</UserInfoValue>
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
          {myPosts.length === 0 ? (
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
          ) : (
            <PostItemArea>
              <PostHeader>
                <PostCell>카테고리</PostCell>
                <PostCell>제목</PostCell>
                <PostCell>작성일</PostCell>
                <PostCell>조회수</PostCell>
              </PostHeader>

              {myPosts.map((post) => (
                <PostItem key={post.boardNo} onClick={() => navigate(`/communityboard/${post.boardNo}`)}>
                  <PostCell>{post.categoryName}</PostCell>
                  <PostCell>{post.boardTitle}</PostCell>
                  <PostCell>{(post.updatedDate ?? post.createdDate).split('T')[0]}</PostCell>
                  <PostCell>{post.views}</PostCell>
                </PostItem>
              ))}
            </PostItemArea>
          )}
          {/* ButtonGroup을 PostListSection 내부로 이동 */}
          <ButtonGroup>
            <WithdrawButton onClick={handleWithdrawal}>회원 탈퇴</WithdrawButton>
            <ReturnButton to="/memberdashboard">돌아가기</ReturnButton>
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
  width: 320px;
  height: 320px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #eaeaea;
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

const PostItemArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid #dee2e6;
`;

const PostHeader = styled.div`
  display: grid;
  grid-template-columns: 20% 40% 20% 20%;
  padding: 12px 16px;
  background: #f1f3f5;
  font-weight: 600;
  color: #212529;
  border-bottom: 1px solid #dee2e6;
`;

const PostItem = styled.div`
  display: grid;
  grid-template-columns: 20% 40% 20% 20%;
  padding: 14px 16px;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  border-bottom: 1px solid #e9ecef;
`;

const PostCell = styled.div`
  font-size: 0.95rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

export default MyPage;
