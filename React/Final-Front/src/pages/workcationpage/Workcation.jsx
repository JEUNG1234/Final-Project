import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MainContent, PageTitle } from '../../styles/common/MainContentLayout';

//달력기능
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { MdWork } from 'react-icons/md';

import image from '../../assets/돌하르방.jpg';

const workcationData = [
  { id: 1, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 2, title: '속초 마운틴 리트릿', location: '강원도 속초', availability: 6, img: '/images/sokcho.jpg' },
  { id: 3, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 4, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 5, title: '속초 마운틴 리트릿', location: '강원도 속초', availability: 6, img: '/images/sokcho.jpg' },
  { id: 6, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
];

const Workcation = () => {
  //필터(지역, 인원, 날짜) 상태 관리
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeople, setSelectedPeople] = useState('');

  //날짜 범위 선택[시작일, 종료일]
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  //날짜 초기화
  const resetDates = () => setDateRange([null, null]);

  //드롭다운 오픈/클로즈 상태
  const [regionOpen, setRegionOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  //드롭다운 외부 클릭 처리용 ref
  const regionRef = useRef();
  const peopleRef = useRef();
  const dateRef = useRef();

  const regionList = [
    '전체',
    '서울',
    '경기',
    '인천',
    '부산',
    '광주',
    '대구',
    '대전',
    '울산',
    '제주',
    '강원',
    '경남',
    '경북',
    '전남',
    '전북',
    '충남',
    '세종',
    '충북',
  ];
  const peopleList = ['1명', '2명', '3명', '4명 이상'];

  //날짜 적용후 달력 닫기
  const applyDates = () => {
    console.log('적용된 날짜:', startDate, endDate);
    setDateOpen(false); // 달력 닫기
  };

  //외부 클릭 시 모든 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        regionRef.current &&
        !regionRef.current.contains(e.target) &&
        peopleRef.current &&
        !peopleRef.current.contains(e.target) &&
        dateRef.current &&
        !dateRef.current.contains(e.target)
      ) {
        setRegionOpen(false);
        setPeopleOpen(false);
        setDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container>
      <MainContent>
        {/* 상단 로고 및 타이틀 */}
        <PageTitle>
          {/* 워케이션 아이콘 변경예정 */}
          <MdWork /> 워케이션
        </PageTitle>
        {/* 필터 영역 */}
        <Filters>
          {/* 지역 선택 드롭다운 */}
          <FilterWrapper ref={regionRef}>
            <DropdownToggle type="button" onClick={() => setRegionOpen(!regionOpen)}>
              {selectedRegion || '전체지역'}
            </DropdownToggle>
            {regionOpen && (
              <DropdownMenu>
                {regionList.map((region) => (
                  <DropdownItem
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setRegionOpen(false);
                    }}
                  >
                    {region}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </FilterWrapper>

          {/* 인원 선택 드롭다운 */}
          <FilterWrapper ref={peopleRef}>
            <DropdownToggle type="button" onClick={() => setPeopleOpen(!peopleOpen)}>
              {selectedPeople || '인원'}
            </DropdownToggle>
            {peopleOpen && (
              <DropdownMenu>
                {peopleList.map((people) => (
                  <DropdownItem
                    key={people}
                    onClick={() => {
                      setSelectedPeople(people);
                      setPeopleOpen(false);
                    }}
                  >
                    {people}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </FilterWrapper>

          {/* 날짜 선택 드롭다운 */}
          <FilterWrapper ref={dateRef}>
            <DropdownToggle type="button" onClick={() => setDateOpen(!dateOpen)}>
              {/* 선택된 날짜 범위 텍스트 */}
              {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : '날짜'}
            </DropdownToggle>
            {dateOpen && (
              <DateMenu>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  inline
                  calendarContainer={({ children }) => (
                    <CalendarWrapper>
                      {children}
                      <DateInfo>
                        <Dot color="#facc15" /> 오늘
                        <Dot color="#a78bfa" /> 선택
                      </DateInfo>
                      <ButtonWrapper>
                        <ControlButton onClick={resetDates}>초기화</ControlButton>
                        <ControlButton onClick={applyDates}>날짜 적용</ControlButton>
                      </ButtonWrapper>
                    </CalendarWrapper>
                  )}
                />
              </DateMenu>
            )}
          </FilterWrapper>
        </Filters>

        {/* 장소 목록 섹션 */}
        <SectionTitle>장소</SectionTitle>

        <CardGrid>
          {workcationData.map((place) => (
            <Card key={place.id}>
              {/* 워케이션 장소 리스트 출력 */}
              <CardImage src={image} alt={place.title} />
              <CardTitle>{place.title}</CardTitle>
              <CardLocationWrapper>
                <CardLocation>
                  {place.location} <CardAvailability>남은 예약: {place.availability}</CardAvailability>
                </CardLocation>
              </CardLocationWrapper>
            </Card>
          ))}
        </CardGrid>
        <RegisterDiv>
          <RegisterButton>워크케이션 신청목록</RegisterButton>
        </RegisterDiv>
        {/* 페이지 버튼 영역 */}
        <BottomBar>
          <Pagination>
            {[1, 2, 3, 4].map((num) => (
              <PageButton key={num}>{num}</PageButton>
            ))}
          </Pagination>
        </BottomBar>
      </MainContent>
    </Container>
  );
};

//사이드바, 헤더바를 제외한 전체 화면
const Container = styled.div`
  height: 100%;
  width: 100%;

  background: #f0f7ff;
`;

//메인 콘텐츠 div



//검색 창
const Filters = styled.form`
  display: flex;
  gap: 50px;
  padding: 3% 7% 0 7%;
<<<<<<< HEAD:React/Final-Front/src/pages/Workcation.jsx
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  width: 150px;
  height: 50px;
=======
  width: 100%;
>>>>>>> 971b9885cefcecaf6350c1aea9696657e06a15f7:React/Final-Front/src/pages/workcationpage/Workcation.jsx
`;

//지역 선택 창
const FilterWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const DropdownToggle = styled.button`
  padding: 0;

  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;

  height: 50px;
  width: 100%;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  padding: 5% 5% 5% 5%;
  position: absolute;
  top: 40px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 1rem;
  gap: 10px;
  z-index: 10;
  min-width: 270px;
`;

const DateMenu = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 15;
`;

const DropdownItem = styled.button`
  padding: 0.4rem 0.6rem;
  border: none;
  background: #f0f7ff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  width: 50px;

  &:hover {
    background: #d0e8ff;
  }
`;

//날짜 선택 창
const DateInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #555;
`;

const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color || '#000'};
  border-radius: 50%;
  margin-right: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ControlButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;
const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding-bottom: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

//장소 목록 세션
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05);
  background: #f0f7ff;
`;

const CardImage = styled.img`
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
`;

const CardTitle = styled.div`
  margin-top: 0.5rem;
  font-weight: 600;
  text-align: center;
`;
const CardLocationWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const CardLocation = styled.p`
  font-size: 0.875rem;
  color: #555;
  text-align: right;
`;

const CardAvailability = styled.span`
  font-size: 0.875rem;
  color: #e74c3c;
  padding-left: 20px;
`;

//워케이션 신청 목록 div
const RegisterDiv = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: end;
`;
//워케이션 신청 목록 버튼
const RegisterButton = styled.button`
  padding: 0.6rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

//페이지 버튼 영역
const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #3b82f6;
  color: white;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

export default Workcation;
