import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/MediaQueries';

import { PageTitle, PageButton } from '../../styles/common/MainContentLayout';

import { MdWork } from 'react-icons/md';

import NaverMapWithGeocoding from '../../components/NaverMapWithGeocoding';

import { FaSquare, FaRulerCombined, FaUsers } from 'react-icons/fa';
import NaverMapStatic from '../../components/NvaerMapStatic';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '../../components/Modal';
import { workationService } from '../../api/workation';
import useUserStore from '../../Store/useStore';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { fileupload } from '../../api/fileupload';
const WorkationUpdate = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [feature, setFeature] = useState('');
  const [placeInfo, setPlaceInfo] = useState('');
  const [facilityInfo, setFacilityInfo] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [peopleMin, setPeopleMin] = useState('');
  const [peopleMax, setPeopleMax] = useState('');
  const [url, setUrl] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [parkingInfo, setParkingInfo] = useState('');
  const [busInfo, setBusInfo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  //유효성 검사
  const schema = yup.object().shape({
    workationTitle: yup.string().required('제목은 필수입니다.'),
    workationStartDate: yup.string().required('계약기간은 필수입니다.'),
    workationEndDate: yup.string().required('계약기간은 필수입니다.'),
    openHours: yup.string().required('운영시간은 필수입니다.'),
  });

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: true,
  });

  //유효성검사 탭 이동시
  const handleNextFromIntro = async () => {
    const valid = await trigger(['workationTitle', 'workationStartDate', 'workationEndDate', 'address']);
    if (valid) {
      setActiveTab('facilities');
    }
    // 포커스는 shouldFocusError: true 옵션으로 자동 이동됨
  };

  //유효성검사 탭 이동시
  const handleNextFromFacilities = async () => {
    const valid = await trigger(['openHours']);
    if (valid) {
      setActiveTab('precautions');
    }
  };

  // 현재 활성화된 탭 상태 관리 (예시)
  const [activeTab, setActiveTab] = React.useState('intro');

  const [showMap] = useState(false); //지도 표시 여부 상태

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [address, setAddress] = useState('');

  // 모달 닫기
  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  const allDays = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState({});

  //워케이션 정보 가져오기
  const { no } = useParams();

  useEffect(() => {
    const workationInfo = async () => {
      console.log(no);
      try {
        const data = await workationService.workationInfo(no);
        console.log('워케이션 정보: ', data);
        reset({
          workationTitle: data.workationTitle,
          workationStartDate: data.workationStartDate,
          workationEndDate: data.workationEndDate,
          openHours: data.openHours,
        });
        setWorkationInfo(data);
        setAddress(data.address);
        setPlaceInfo(data.placeInfo);
        setFeature(data.feature);
        setFacilityInfo(data.facilityInfo);
        setSpaceType(data.spaceType);
        setPeopleMin(data.peopleMin);
        setPeopleMax(data.peopleMax);
        setUrl(data.url);
        setPrecautions(data.precautions);
        setParkingInfo(data.parkingInfo);
        setBusInfo(data.busInfo);
        setArea(data.area);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setSelectedDays(data.dayOffs ? data.dayOffs.map((d) => d.dayOff) : []);
      } catch (error) {
        const apiError = error.response.data.message;

        alert(apiError);
        console.error('워케이션 정보 불러오기 실패:', apiError);
      }
    };
    workationInfo();
  }, []);
  const [workationInfo, setWorkationInfo] = useState([]);

  useEffect(() => {
    if (workationInfo.workationImages && workationInfo.workationImages.length > 0) {
      // PLACE
      const place = workationInfo.workationImages.find((img) => img.tab === 'PLACE');
      setPlaceImage(place ? place.changedName : '');

      // FACILITY
      const facility = workationInfo.workationImages.find((img) => img.tab === 'FACILITY');
      setFacilityImage(facility ? facility.changedName : '');

      // PRECAUTIONS
      const precaution = workationInfo.workationImages.find((img) => img.tab === 'PRECAUTIONS');
      setPrecautionImage(precaution ? precaution.changedName : '');
    }
  }, [workationInfo]);

  const handleDayToggle = (day) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        // 이미 선택된 요일이면 제거
        return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
      } else {
        // 선택되지 않은 요일이면 추가
        return [...prevSelectedDays, day];
      }
    });
  };

  //면적, 평수 상태
  const [area, setArea] = useState('');
  const [areaPyeong, setAreaPyeong] = useState('');

  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value);

    // 숫자인지 확인하고 계산
    const number = parseFloat(value);
    if (!isNaN(number)) {
      const converted = (number * 0.3025).toFixed(2); // 소수점 2자리까지
      setAreaPyeong(converted);
    } else {
      setAreaPyeong('');
    }
  };

  //이미지 필터 저장용
  const [placeImage, setPlaceImage] = useState({ changedName: '', previewUrl: '', file: null });
  const [facilityImage, setFacilityImage] = useState({ changedName: '', previewUrl: '', file: null });
  const [precautionImage, setPrecautionImage] = useState({ changedName: '', previewUrl: '', file: null });

  useEffect(() => {
    if (workationInfo.workationImages && workationInfo.workationImages.length > 0) {
      // PLACE
      const place = workationInfo.workationImages.find((img) => img.tab === 'PLACE');
      setPlaceImage(
        place
          ? {
              changedName: place.changedName,
              originalName: place.originalName,
              size: place.size,
              previewUrl: '',
              file: null,
            }
          : { changedName: '', previewUrl: '', file: null }
      );

      // FACILITY
      const facility = workationInfo.workationImages.find((img) => img.tab === 'FACILITY');
      setFacilityImage(
        facility
          ? {
              changedName: facility.changedName,
              originalName: facility.originalName,
              size: facility.size,
              previewUrl: '',
              file: null,
            }
          : { changedName: '', previewUrl: '', file: null }
      );

      // PRECAUTIONS
      const precaution = workationInfo.workationImages.find((img) => img.tab === 'PRECAUTIONS');
      setPrecautionImage(
        precaution
          ? {
              changedName: precaution.changedName,
              originalName: precaution.originalName,
              size: precaution.size,
              previewUrl: '',
              file: null,
            }
          : { changedName: '', previewUrl: '', file: null }
      );
    }
  }, [workationInfo]);
  // 파일 선택 시 동작 (선택된 파일 정보 콘솔에 출력 예시)
  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const imageInfo = { name: file.name, previewUrl, file, size: file.size };

    if (type === 'place') {
      setPlaceImage(imageInfo);
    } else if (type === 'facility') {
      setFacilityImage(imageInfo);
    } else if (type === 'precaution') {
      setPrecautionImage(imageInfo);
    }
  };

  const [selectedCoords, setSelectedCoords] = useState({ lat: latitude, lng: longitude });

  const handleAddressSelect = (address, lat, lng, e) => {
    e.preventDefault();
    setSelectedCoords({ lat, lng }); // 위도/경도 저장
    setIsMapModalOpen(false); // 모달 닫기

    console.log(selectedCoords);
  };

  const onSubmit = async (data) => {
    try {
      let placeImageInfo = {};
      let facilityImageInfo = {};
      let precautionImageInfo = {};
      // PLACE 이미지
      if (placeImage.file) {
        placeImageInfo = await fileupload.uploadImageToS3(placeImage.file, 'workation/');
        placeImageInfo.size = placeImage.file.size;
        placeImageInfo.originalName = placeImage.file.name;
      } else if (placeImage.changedName) {
        placeImageInfo = {
          filename: placeImage.changedName,
          url: `${import.meta.env.VITE_CLOUDFRONT_URL}/${placeImage.changedName}`,
          originalName: placeImage.originalName || '', // 없으면 빈 문자열
          size: placeImage.size || 0, // 없으면 0
        };
      }

      // FACILITY 이미지
      if (facilityImage.file) {
        facilityImageInfo = await fileupload.uploadImageToS3(facilityImage.file, 'workation/');
        facilityImageInfo.size = facilityImage.file.size;
        facilityImageInfo.originalName = facilityImage.file.name;
      } else if (facilityImage.changedName) {
        facilityImageInfo = {
          filename: facilityImage.changedName,
          url: `${import.meta.env.VITE_CLOUDFRONT_URL}/${facilityImage.changedName}`,
          originalName: facilityImage.originalName || '',
          size: facilityImage.size || 0,
        };
      }

      // PRECAUTIONS 이미지
      if (precautionImage.file) {
        precautionImageInfo = await fileupload.uploadImageToS3(precautionImage.file, 'workation/');
        precautionImageInfo.size = precautionImage.file.size;
        precautionImageInfo.originalName = precautionImage.file.name;
      } else if (precautionImage.changedName) {
        precautionImageInfo = {
          originalName: precautionImage.originalName,
          filename: facilityImage.changedName,
          url: `${import.meta.env.VITE_CLOUDFRONT_URL}/${precautionImage.changedName}`,
          size: precautionImage.size || 0,
        };
      }
      const images = [
        {
          originalName: placeImageInfo.originalName || '',
          changedName: placeImageInfo.filename || '',
          path: placeImageInfo.url || '',
          size: placeImageInfo.size || 0,
          tab: 'PLACE',
        },
        {
          originalName: facilityImageInfo.originalName || '',
          changedName: facilityImageInfo.filename || '',
          path: facilityImageInfo.url || '',
          size: facilityImageInfo.size || 0,
          tab: 'FACILITY',
        },
        {
          originalName: precautionImageInfo.originalName || '',
          changedName: precautionImageInfo.filename || '',
          path: precautionImageInfo.url || '',
          size: precautionImageInfo.size || 0,
          tab: 'PRECAUTIONS',
        },
      ];

      const location = {
        placeInfo,
        address,
        openHours: data.openHours,
        spaceType,
        feature,
        area,
        busInfo,
        parkingInfo,
      };
      const workation = {
        workationTitle: data.workationTitle,
        workationStartDate: data.workationStartDate,
        workationEndDate: data.workationEndDate,
        facilityInfo,
        peopleMin,
        peopleMax,
        url,
        precautions,
      };
      const requestBody = {
        workation,
        location,
        userId: user.userId,
        locationNo: no,
        workationNo: no,
        images: images,
        selectedDays,
      };

      console.log('requestBody', requestBody);

      const workResponse = await workationService.update(requestBody);

      console.log(workResponse);
    } catch (error) {
      console.error('워케이션 생성 에러:', error);
      alert('워케이션 정보 등록 중 에러가 발생했습니다.');
    }
    console.log({ data });
    alert('워케이션정보가 등록되었습니다.');
    navigate('/workationList');
  };

  return (
    <FullWapper>
      <MainContent>
        <Tabs>
          <TabButton className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>
            장소 소개
          </TabButton>
          <TabButton className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}>
            시설 안내
          </TabButton>
          <TabButton
            className={activeTab === 'precautions' ? 'active' : ''}
            onClick={() => setActiveTab('precautions')}
          >
            유의 사항
          </TabButton>
          <TabButton className={activeTab === 'refund' ? 'active' : ''} onClick={() => setActiveTab('refund')}>
            오시는 길
          </TabButton>
        </Tabs>
        {/* 장소소개 탭 */}
        {activeTab === 'intro' && (
          <>
            <ImageSection>
              {placeImage.previewUrl ? (
                <img src={placeImage.previewUrl} alt="새 이미지 미리보기" />
              ) : placeImage.changedName ? (
                <img src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${placeImage.changedName}`} alt="기존 이미지" />
              ) : null}
            </ImageSection>
            <Title>{workationInfo.workationTitle}</Title>
            <Subtitle>{workationInfo.address}</Subtitle>
            <Description>{workationInfo.placeInfo}</Description>
            <Subtitle>주요 특징</Subtitle>
            <FeaturesSection>
              <RefundPolicy>{workationInfo.feature}</RefundPolicy>
            </FeaturesSection>
          </>
        )}
        {/* 시설안내 탭 */}
        {activeTab === 'facilities' && (
          <>
            <ImageSection>
              {facilityImage.previewUrl ? (
                <img src={facilityImage.previewUrl} alt="새 이미지 미리보기" />
              ) : facilityImage.changedName ? (
                <img src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${facilityImage.changedName}`} alt="기존 이미지" />
              ) : null}
            </ImageSection>
            <FacilityContent>
              <FacilityLeftContent>
                <FaciltyLeftFirstInfo>
                  <h2>시설안내</h2>
                  <h3>{workationInfo.facilityInfo}</h3>
                </FaciltyLeftFirstInfo>
                <FaciltyLeftSecondInfo>
                  <h2>영업시간 | 휴무일</h2>
                  <h3>{workationInfo.openHours}</h3>
                  {Array.isArray(workationInfo.dayOffs) && workationInfo.dayOffs.length > 0 && (
                    <h3>{workationInfo.dayOffs.map((item) => item.dayOff).join(', ')}</h3>
                  )}
                </FaciltyLeftSecondInfo>
              </FacilityLeftContent>
              <FacilityRightContent>
                <InfoBlock>
                  <InfoIcon as={FaSquare} /> {/* 공간유형 아이콘 (임시) */}
                  <InfoText>계약기간</InfoText>
                  <DetailText>
                    {workationInfo.workationStartDate} ~ {workationInfo.workationEndDate}
                  </DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaSquare} /> {/* 공간유형 아이콘 (임시) */}
                  <InfoText>공간유형</InfoText>
                  <DetailText>{workationInfo.spaceType}</DetailText>
                </InfoBlock>
                <InfoBlock>
                  <InfoIcon as={FaRulerCombined} /> {/* 공간면적 아이콘 (임시) */}
                  <InfoText>공간면적</InfoText>
                  <DetailText>{workationInfo.area}m²</DetailText>
                </InfoBlock>

                <InfoBlock>
                  <InfoIcon as={FaUsers} /> {/* 수용인원 아이콘 (임시) */}
                  <InfoText>수용인원</InfoText>
                  <DetailText>
                    {workationInfo.peopleMin}명 ~ 최대{workationInfo.peopleMax}
                  </DetailText>
                </InfoBlock>
              </FacilityRightContent>
            </FacilityContent>
          </>
        )}

        {activeTab === 'precautions' && (
          <>
            <Title>유의 사항</Title>
            <ImageSection>
              {precautionImage.previewUrl ? (
                <img src={precautionImage.previewUrl} alt="새 이미지 미리보기" />
              ) : precautionImage.changedName ? (
                <img src={`${import.meta.env.VITE_CLOUDFRONT_URL}/${precautionImage.changedName}`} alt="기존 이미지" />
              ) : null}
            </ImageSection>
            \\
            <RefundPolicy>{workationInfo.precautions}</RefundPolicy>
          </>
        )}

        {/* 위치 정보 탭 */}
        {activeTab === 'refund' && (
          <>
            <Title>오시는 길</Title>
            <MapContainerStyled>
              <NaverMapStatic
                address={workationInfo.address}
                latitude={workationInfo.latitude}
                longitude={workationInfo.longitude}
              />
            </MapContainerStyled>
            <Description style={{ marginTop: '20px' }}>
              <p>주소: {workationInfo.address}</p>
              <RefundPolicy>대중교통: {workationInfo.busInfo}</RefundPolicy>
              <RefundPolicy>주차: {workationInfo.parkingInfo}</RefundPolicy>
            </Description>
          </>
        )}
      </MainContent>
      <DateContent onSubmit={handleSubmit(onSubmit)}>
        {/* 장소소개 탭 */}
        {activeTab === 'intro' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 장소소개
            </PageTitle>

            <FormGroup>
              <Label htmlFor="workationTitle">워케이션제목</Label>
              <Input
                id="workationTitle"
                type="text"
                placeholder={workationInfo.workationTitle}
                {...register('workationTitle')}
              />
              {errors.workationTitle && <ErrorMessage>{errors.workationTitle.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="placeImage">장소 이미지</Label>
              <Input
                id="placeImage"
                onChange={(e) => setPlaceImage(e.target.value)}
                type="text"
                value={placeImage.name}
                readOnly
              />
              <HiddenFileInput id="placeUpload" type="file" onChange={(e) => handleImageUpload(e, 'place')} />
              <StyledUploadButton htmlFor="placeUpload">이미지등록</StyledUploadButton>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">주소(위치)</Label>
              <Input
                id="address"
                type="text"
                placeholder={workationInfo.address}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly
              />
            </FormGroup>

            {showMap && <NaverMapWithGeocoding />}
            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              {' '}
              {/* 텍스트 영역 상단 정렬 */}
              <Label htmlFor="placeInfo">장소소개</Label>
              <TextArea
                id="placeInfo"
                value={placeInfo}
                onChange={(e) => setPlaceInfo(e.target.value)}
                placeholder={workationInfo.placeInfo}
              />
            </FormTextareaGroup>

            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              {' '}
              {/* 텍스트 영역 상단 정렬 */}
              <Label htmlFor="feature">주요특징</Label>
              <TextArea
                id="feature"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder={workationInfo.feature}
              />
            </FormTextareaGroup>

            <SpaceFormGroup>
              <Label htmlFor="workationStartDate">계약기간</Label>
              <SpaceInputGroup>
                <SpaceInput id="workationStartDate" type="date" {...register('workationStartDate')} />
                부터
                <SpaceInput id="workationEndDate" type="date" {...register('workationEndDate')} />
                까지
                {errors.workationStartDate && <ErrorMessage>{errors.workationStartDate.message}</ErrorMessage>}
              </SpaceInputGroup>
            </SpaceFormGroup>

            <ActionButtons>
              <DangerButton onClick={() => navigate(-1)}>취소하기</DangerButton>
              <PrimaryButton type="button" onClick={handleNextFromIntro}>
                다음으로
              </PrimaryButton>
            </ActionButtons>
          </>
        )}

        {/* 시설안내 탭 */}
        {activeTab === 'facilities' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 시설안내
            </PageTitle>

            <FormGroup>
              <Label htmlFor="facilityImage">이미지</Label>
              <Input
                id="facilityImage"
                type="text"
                onChange={(e) => setFacilityImage(e.target.value)}
                value={facilityImage.name}
                readOnly
              />
              <HiddenFileInput id="facilityUpload" type="file" onChange={(e) => handleImageUpload(e, 'facility')} />
              <StyledUploadButton htmlFor="facilityUpload">이미지등록</StyledUploadButton>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="facilityInfo">시설안내</Label>
              <Input
                id="facilityInfo"
                type="text"
                onChange={(e) => setFacilityInfo(e.target.value)}
                value={facilityInfo}
                placeholder={workationInfo.facilityInfo}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="openHours">영업시간</Label>
              <Input id="openHours" type="text" {...register('openHours')} placeholder="ex)08시 ~ 18시" />
              {errors.openHours && <ErrorMessage>{errors.openHours.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>휴무일</Label>
              <DayButtonContainer>
                {allDays.map((day) => (
                  <DayButton
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    isSelected={selectedDays.includes(day)}
                    value={workationInfo.dayOffs}
                  >
                    {day}
                  </DayButton>
                ))}
              </DayButtonContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="spaceType">공간유형</Label>
              <Input
                id="spaceType"
                type="text"
                onChange={(e) => setSpaceType(e.target.value)}
                value={spaceType}
                placeholder={workationInfo.spaceType}
              />
            </FormGroup>

            <SpaceFormGroup>
              <Label htmlFor="area">공간면적</Label>
              <SpaceInputGroup>
                <SpaceInput
                  id="area"
                  type="number"
                  value={area}
                  onChange={handleAreaChange}
                  placeholder={workationInfo.area}
                />
                m²
                <SpaceInput type="number" value={areaPyeong} readOnly />평
              </SpaceInputGroup>
            </SpaceFormGroup>

            <SpaceFormGroup>
              <Label htmlFor="people">수용인원</Label>
              <SpaceInputGroup>
                최소
                <SpaceInput
                  id="peopleMin"
                  type="text"
                  onChange={(e) => setPeopleMin(e.target.value)}
                  value={peopleMin}
                  placeholder={workationInfo.peopleMin}
                />
                최대
                <SpaceInput
                  id="peopleMax"
                  type="text"
                  onChange={(e) => setPeopleMax(e.target.value)}
                  value={peopleMax}
                  placeholder={workationInfo.peopleMax}
                />
              </SpaceInputGroup>
            </SpaceFormGroup>

            <FormGroup>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="text"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder={workationInfo.url}
              />
            </FormGroup>

            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('intro')}>이전으로</DangerButton>
              <PrimaryButton type="button" onClick={handleNextFromFacilities}>
                다음으로
              </PrimaryButton>
            </ActionButtons>
          </>
        )}

        {activeTab === 'precautions' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 유의사항
            </PageTitle>
            <FormTextareaGroup style={{ alignItems: 'flex-start' }}>
              <Label htmlFor="precautions">유의사항</Label>
              <TextArea
                id="precautions"
                onChange={(e) => setPrecautions(e.target.value)}
                value={precautions}
                placeholder={workationInfo.precautions}
              />
            </FormTextareaGroup>
            <FormGroup>
              <Label htmlFor="precautionImage">이미지</Label>
              <Input
                id="precautionImage"
                type="text"
                onChange={(e) => setPrecautionImage(e.target.value)}
                value={precautionImage.name}
                readOnly
              />
              <HiddenFileInput id="precautionUpload" type="file" onChange={(e) => handleImageUpload(e, 'precaution')} />
              <StyledUploadButton htmlFor="precautionUpload">이미지등록</StyledUploadButton>
            </FormGroup>
            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('facilities')}>이전으로</DangerButton>
              <PrimaryButton onClick={() => setActiveTab('refund')}>다음으로</PrimaryButton>
            </ActionButtons>
          </>
        )}

        {activeTab === 'refund' && (
          <>
            <PageTitle>
              {/* 워케이션 아이콘 변경예정 */}
              <MdWork /> 워케이션 &gt; 장소 추가 &gt; 오시는 길
            </PageTitle>
            <FormTextareaGroup style={{ alignItems: 'flex-start', height: '40%' }}>
              <Label htmlFor="busInfo">대중교통</Label>
              <TextArea
                style={{ height: '30%' }}
                id="busInfo"
                onChange={(e) => setBusInfo(e.target.value)}
                value={busInfo}
                placeholder={workationInfo.busInfo}
              />
            </FormTextareaGroup>

            <FormTextareaGroup style={{ alignItems: 'flex-start', height: '40%' }}>
              <Label htmlFor="parkingInfo">주차</Label>
              <TextArea
                style={{ height: '30%' }}
                id="parkingInfo"
                onChange={(e) => setParkingInfo(e.target.value)}
                value={parkingInfo}
                placeholder={workationInfo.parkingInfo}
              />
            </FormTextareaGroup>

            <ActionButtons>
              <DangerButton onClick={() => setActiveTab('precautions')}>이전으로</DangerButton>
              <PrimaryButton type="submit">등록하기</PrimaryButton>
            </ActionButtons>
          </>
        )}
        <Modal isOpen={isMapModalOpen} onClose={handleCloseMapModal} title="장소 주소 검색(정확한 주소를 입력해주세요)">
          <p>ex)서울특별시 강남구 테헤란로 130 남도빌딩</p>
          {/* onAddressSelect 프롭스를 NaverMapWithGeocoding에 전달 */}
          <NaverMapWithGeocoding onAddressSelect={handleAddressSelect} />
        </Modal>
      </DateContent>
    </FullWapper>
  );
};

const FullWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/
  min-height: 80vh;
  margin: 30px auto;
`;

const MainContent = styled.div`
  width: 50%;
  max-width: 1400px; /*너무 넓어지지 않도록 최대 너비 설정*/

  min-height: 80vh;

  background: white;

  padding: 30px 30px 0 30px; /* 내부 패딩 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  text-align: center;
`;

const DayButton = styled(PageButton).withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected',
})`
  background-color: ${({ isSelected }) => (isSelected ? '#267eff' : 'white')};
  color: ${({ isSelected }) => (isSelected ? 'white' : '#267eff')};
`;

const DateContent = styled.form`
  position: relative; /* ActionButtons가 이 요소를 기준으로 위치하게 함 */
  width: 50%;
  max-width: 1400px;
  min-height: 80vh;
  background: white;
  padding: 30px;
  padding-bottom: 100px; /* 하단 버튼을 위한 공간 확보 (버튼 높이 + 여백) */
  margin: 0 0 0 30px;
  border-radius: 10px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤이 생기도록 추가 */
`;

const Tabs = styled.div`
  display: flex;
  /* 탭 스타일 */
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  background: none;
  border-radius: 0;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  &:hover {
    color: #007bff; /* 예시 색상 */
  }
  &.active {
    color: #007bff; /* 예시 색상 */
    border-bottom: 2px solid #007bff; /* 예시 색상 */
    font-weight: bold;
  }
`;

//이미지 영역
const ImageSection = styled.div`
  width: 70%;
  max-height: 300px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #267eff;
`;

const Subtitle = styled.h3`
  font-size: 22px;
  color: #555;
  height: 6%;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 5px;
  height: 10%;
`;
const RefundPolicy = styled.div`
  white-space: pre-line;
  font-family: inherit;
  font-size: 16px;
  color: #444;
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.p`
  font-size: 15px;
  color: #444;
  height: 15%;
  /* 아이콘이 있다면 여기에 아이콘 스타일 추가 */
`;

//시설안내 정보 영역
const FacilityContent = styled.div`
  width: 100%;
  height: 50%;

  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const FacilityLeftContent = styled.div`
  width: 50%;
  height: 100%;
  ${media.md`
      
      font-size: ${({ theme }) => theme.fontSizes.sm};
    `}
`;

const FacilityRightContent = styled.div`
  width: 50%;
  height: 100%;
`;
const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* 각 정보 블록 간 간격 */
  margin-top: 15px;
  font-size: 1rem;
  color: #333;
`;

const InfoIcon = styled(FaSquare)`
  /* FaSquare를 기본 아이콘으로 사용. 실제는 다른 아이콘 필요 */
  color: #333; /* 아이콘 색상 */
  font-size: 0.8rem;
  margin-right: 10px; /* 아이콘과 텍스트 간 간격 */
`;

const InfoText = styled.span`
  font-weight: 500;
  color: #333;
`;

const DetailText = styled.span`
  color: #929393;
  margin-left: 10px;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 그리드 */
  gap: 20px; /* 아이콘 항목 간 간격 */
  margin-top: 30px; /* 정보 블록과의 간격 */
  padding-left: 10px; /* InfoBlock과 정렬 */
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #555;
  text-align: center;

  svg {
    font-size: 20px; /* 아이콘 크기 */
    color: #666;
    margin-bottom: 8px; /* 아이콘과 텍스트 간 간격 */
  }

  ${media.md`
      
        gap: 10px;
        margin-top: 0;
        font-size: 0px;
      `}
`;

const FaciltyLeftFirstInfo = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;

  h2 {
    margin-bottom: 0;
    text-align: left;
  }
  h3 {
    color: #929393;
    margin-bottom: 0;
    text-align: left;
  }
`;
const FaciltyLeftSecondInfo = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;

  h2 {
    margin-bottom: 0;
    text-align: left;
  }
  h3 {
    color: #929393;
    margin-bottom: 0;
    text-align: left;
  }
`;

const PrecautionContent = styled.div`
  width: 80%;
  height: 50%;
  border: 1px solid black;
  margin: 0 auto;
`;

// 지도의 기본 중심 좌표 (예: 제주 애월)
const MAP_CENTER = [33.4507, 126.5706]; // 위도, 경도
const MAP_ZOOM = 12; // 확대 레벨

//지도 컨테이너 스타일
const MapContainerStyled = styled.div`
  width: 90%; /* MainContent 너비에 맞추기 */
  height: 400px; /* 지도 높이 설정 */
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden; /* 모서리 둥글게 처리 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

//신청 영역
const FormContent = styled.div`
  width: 100%;
  /* height: 400px; */
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex; /* 내부 요소들을 flex로 배치 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  padding: 30px; /* Added padding to give some space from the edges */
  justify-content: space-between; /* Distribute space between items */
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* Slightly reduced margin for fixed height */

  &:last-of-type {
    margin-bottom: 0; /* No margin bottom for the last row (textarea) */
  }
`;

const Label = styled.span`
  font-size: 16px; /* Slightly smaller font size for compactness */
  font-weight: bold;
  color: #333;
  width: 90px; /* Adjust label width as needed for fixed container */
  flex-shrink: 0; /* Prevent label from shrinking */
`;

// Styled input fields
const Input = styled.input`
  padding: 8px 12px; /* Slightly smaller padding */
  border: none;
  border-radius: 8px;
  font-size: 15px; /* Slightly smaller font size */
  outline: none;
  background-color: #ededed; /* Light blue background for inputs */
  width: calc(60% - 80px);

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

//공간 면적 전용 영역
const SpaceFormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
`;

const SpaceInput = styled.input`
  padding: 8px 12px; /* Slightly smaller padding */
  border: none;
  border-radius: 8px;
  font-size: 15px; /* Slightly smaller font size */
  outline: none;
  background-color: #ededed; /* Light blue background for inputs */
  width: calc(35% - 80px);
  min-width: 70px;
  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

const SpaceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3%; /* Input과 "m²", "평" 텍스트 사이에 간격 적용 */
  flex-grow: 1; /* 남은 공간을 차지하여 오른쪽에 정렬 */
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  min-height: 80px; /* Adjusted min-height to fit 400px container */
  resize: vertical; /* Allow vertical resizing */
  outline: none;
  background-color: #ededed; /* Light blue background for textarea */

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #61a5fa;
    box-shadow: 0 0 0 3px rgba(97, 165, 250, 0.2);
  }
`;

// Styled button
const SubmitButton = styled.button`
  background-color: #61a5fa;
  color: white;
  padding: 10px 20px; /* Slightly smaller padding for button */
  border: none;
  border-radius: 8px;
  font-size: 16px; /* Slightly smaller font size */
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px; /* Adjusted margin-top to fit container */
  transition: background-color 0.3s ease;
  align-self: center; /* Center the button */
  width: 160px; /* Adjusted width */
  flex-shrink: 0; /* Prevent button from shrinking if content is too large */

  &:hover {
    background-color: #4a8df1;
  }

  &:active {
    background-color: #3b7ae0;
  }
`;

//우측 정보 입력 영역
const FormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
`;

const FormTextareaGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 15%;
`;

const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
`;

// 파일 업로드 버튼 스타일 (label 태그를 사용)
const StyledUploadButton = styled.label`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto; /* 오른쪽 벽에 붙이기 */
  background-color: #1890ff;
  color: white;
  width: 40%;
  max-width: 120px;
  text-align: center; /* 텍스트 중앙 정렬 */
  line-height: 1; /* 텍스트 세로 중앙 정렬 */
  display: flex; /* flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */

  &:hover {
    background-color: #40a9ff;
  }
`;

// 실제 input type="file"을 숨기기 위한 스타일
const HiddenFileInput = styled.input`
  display: none; /* 화면에서 숨김 */
`;

const PrimaryButton = styled(Button)`
  background-color: #1890ff;
  color: white;

  &:hover {
    background-color: #40a9ff;
  }
`;

const DangerButton = styled(Button)`
  background-color: #ff4d4f;
  color: white;

  &:hover {
    background-color: #ff7875;
  }
`;
const ActionButtons = styled.div`
  position: absolute; /* DateContent를 기준으로 절대 위치 */
  bottom: 30px; /* 바닥에서 30px 위로 */
  left: 0;
  right: 0;
  width: 100%; /* 부모 DateContent의 전체 너비 */
  display: flex;
  justify-content: center;
  /* margin-top: 40px; 제거: absolute 포지셔닝에서는 margin-top이 의미 없음 */

  ${Button} {
    margin: 0 10px;
    width: 150px;
    padding: 15px;
  }
`;

// 요일 버튼 컨테이너
const DayButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* 요일 버튼 간 간격 */
  flex-wrap: wrap; /* 내용이 넘칠 경우 다음 줄로 넘어가도록 */
  flex-grow: 1; /* 가능한 공간을 차지하도록 */
  justify-content: center;
  width: 80%;
`;

//에러메시지
const ErrorMessage = styled.p`
  color: red;
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;
export default WorkationUpdate;
