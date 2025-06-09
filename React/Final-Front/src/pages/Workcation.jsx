import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { MdWork } from 'react-icons/md';
import image from '../assets/돌하르방.jpg';

const workcationData = [
  { id: 1, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 2, title: '속초 마운틴 리트릿', location: '강원도 속초', availability: 6, img: '/images/sokcho.jpg' },
  { id: 3, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 4, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
  { id: 5, title: '속초 마운틴 리트릿', location: '강원도 속초', availability: 6, img: '/images/sokcho.jpg' },
  { id: 6, title: '제주 애월 스테이', location: '제주도', availability: 6, img: '/images/jeju.jpg' },
];

const Workcation = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeople, setSelectedPeople] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Date object

  const [regionOpen, setRegionOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const regionRef = useRef();
  const peopleRef = useRef();
  const dateRef = useRef();

  const regionList = ['전체','서울', '경기', '인천', '부산', '광주', '대구', '대전', '울산', '제주', '강원', '경남', '경북', '전남', '전북', '충남','세종', '충북'];
  const peopleList = ['1명', '2명', '3명', '4명 이상'];



 useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        regionRef.current && !regionRef.current.contains(e.target) &&
        peopleRef.current && !peopleRef.current.contains(e.target) &&
        dateRef.current && !dateRef.current.contains(e.target)
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
          <Logodiv>
            {/* 워케이션 아이콘 변경예정 */}
            <MdWork /> 워케이션  
          </Logodiv>
      <Filters>
  {/* 지역 선택 */}
  <FilterWrapper ref={regionRef}>
    <DropdownToggle type='button' onClick={() => setRegionOpen(!regionOpen)}>
      {selectedRegion || '전체지역'}
    </DropdownToggle>
    {regionOpen && (
      <DropdownMenu>
        {regionList.map((region) => (
          <DropdownItem key={region} onClick={() => {
            setSelectedRegion(region);
            setRegionOpen(false);
          }}>
            {region}
          </DropdownItem>
        ))}
      </DropdownMenu>
    )}
  </FilterWrapper>

  {/* 인원 선택 */}
  <FilterWrapper ref={peopleRef}>
    <DropdownToggle type='button' onClick={() => setPeopleOpen(!peopleOpen)}>
      {selectedPeople || '인원'}
    </DropdownToggle>
    {peopleOpen && (
      <DropdownMenu>
        {peopleList.map((people) => (
          <DropdownItem key={people} onClick={() => {
            setSelectedPeople(people);
            setPeopleOpen(false);
          }}>
            {people}
          </DropdownItem>
        ))}
      </DropdownMenu>
    )}
  </FilterWrapper>

  {/* 날짜 선택 */}
  <FilterWrapper ref={dateRef}>
    <DropdownToggle type='button' onClick={() => setDateOpen(!dateOpen)}>
      {selectedDate ? selectedDate.toLocaleDateString() : '날짜'}
    </DropdownToggle>
    {dateOpen && (
      <DateMenu>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setDateOpen(false);
          }}
          inline
        />
      </DateMenu>
    )}
  </FilterWrapper>
</Filters>
      <SectionTitle>장소</SectionTitle>

      <CardGrid>
        {workcationData.map((place) => (
          <Card key={place.id}>
            {/* 워케이션 장소 리스트 출력 */}
            <CardImage src={image} alt={place.title} />
            <CardTitle>{place.title}</CardTitle>
            <CardLocationWrapper>
            <CardLocation>{place.location} <CardAvailability>남은 예약: {place.availability}</CardAvailability></CardLocation>
           </CardLocationWrapper>
          </Card>
        ))}
      </CardGrid>

      <BottomBar>
        <Pagination>
          {[1, 2, 3, 4].map((num) => (
            <PageButton key={num}>{num}</PageButton>
          ))}
        </Pagination>
        <RegisterButton>워크케이션 신청목록</RegisterButton>
      </BottomBar>
      </MainContent>
    </Container>
  );
};

//사이드바, 헤더바를 제외한 전체 화면
const Container = styled.div`
height: 100%;
width: 100%;
    padding: 3%;
    background: #F0F7FF;
`;

//메인 콘텐츠 div
const MainContent = styled.div`
    height: 90%;
    width: 80%;
    background: #ffffff;
    margin: 0 auto;

    h2{
      
        padding: 3% 7% 0 7%;
    }

    div{
         padding: 3% 3% 0 3%;
    }

    
      svg {
   font-size: 22px;
    margin-right: 20px;
    color: #4d8eff;
  }
    
`
const Logodiv = styled.div`
width: 100%;
height: 7%;

  font-size: 18px;
font-weight: 600;
     color: #929393;
`

//검색 창
const Filters = styled.form`
  display: flex;
  gap: 70px;
      padding: 3% 7% 0 7%;

  
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  width: 150px;
  height: 50px;
`;


//지역 선택 창

const FilterWrapper = styled.div`
  position: relative;
`;

const DropdownToggle = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
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
  margin-bottom: 2rem;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05);

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

const BottomBar = styled.div`
  display: flex;
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
  background: white;
  cursor: pointer;

  &:hover {
    background: #e6f0ff;
  }
`;

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

export default Workcation;
