import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';

// 지도 컨테이너 스타일 (필수)
const MapContainer = styled.div`
  width: 100%;
  height: 400px; /* 지도의 높이를 설정합니다. */
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 20px;
`;

// 추가: 선택 버튼 스타일
const SelectAddressButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745; /* 초록색 버튼 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  &:hover {
    background-color: #218838;
  }
`;

// onAddressSelect prop을 받도록 수정
const NaverMapWithGeocoding = ({ onAddressSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  const [addressInput, setAddressInput] = useState(''); // 검색할 주소 입력 필드
  const [currentAddress, setCurrentAddress] = useState(''); // 검색된 주소 (선택용)
  const [currentCoords, setCurrentCoords] = useState({ lat: null, lng: null }); // 검색된 좌표 (선택용)
  const [currentZipCode, setCurrentZipCode] = useState(''); // 검색된 우편번호 (선택용)
  const [message, setMessage] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false); // API 로드 상태 추가!

  const initializeMap = useCallback(() => {
    // API가 로드되지 않았거나 mapRef가 없으면 리턴
    if (!window.naver || !window.naver.maps || !mapRef.current) {
      console.warn('Naver Maps API 또는 MapContainer DOM이 아직 준비되지 않았습니다.');
      // setIsApiLoaded(false); // API 로딩 실패로 설정 (이 부분은 없어도 됨)
      return;
    }

    // 이미 지도가 초기화되었다면 다시 초기화하지 않음
    if (mapInstance.current) {
      setIsApiLoaded(true); // 이미 초기화되어 있다면 API 로드된 것으로 간주
      return;
    }

    const initialCenter = new window.naver.maps.LatLng(37.5665, 126.978); // 서울 시청

    const mapOptions = {
      center: initialCenter,
      zoom: 15,
      minZoom: 6,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

    markerInstance.current = new window.naver.maps.Marker({
      position: initialCenter,
      map: mapInstance.current,
    });

    setMessage('지도가 성공적으로 로드되었습니다.');
    setIsApiLoaded(true); // API 로딩 성공으로 설정
  }, []);

  useEffect(() => {
    let timer;

    const checkNaverMaps = () => {
      if (window.naver && window.naver.maps) {
        initializeMap();
      } else {
        timer = setTimeout(checkNaverMaps, 100);
      }
    };

    checkNaverMaps();

    return () => {
      if (timer) clearTimeout(timer); // <- 타이머 정리
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [initializeMap]);

  // 주소 입력 핸들러
  const handleAddressInputChange = (e) => {
    setAddressInput(e.target.value);
    setMessage('');
  };

  // 주소 검색 (지오코딩) 핸들러
  const handleSearchAddress = useCallback(() => {
    // API가 로드되지 않았다면 바로 메시지 표시
    if (!isApiLoaded || !window.naver.maps.Service) {
      // isApiLoaded 상태 확인
      setMessage('네이버 지도 서비스가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!addressInput.trim()) {
      setMessage('주소를 입력해주세요.');
      return;
    }

    window.naver.maps.Service.geocode(
      {
        query: addressInput,
      },
      function (status, response) {
        // 응답 전체를 문자열로 변환하여 메시지로 설정 (디버깅용)
        setMessage(JSON.stringify(response, null, 2));

        if (status === window.naver.maps.Service.Status.ERROR) {
          setMessage('지오코딩 중 오류가 발생했습니다. 다시 시도해주세요.');
          // setCurrentAddress(''); // 이 부분 주석 처리!
          // setCurrentCoords({ lat: null, lng: null }); // 이 부분 주석 처리!
          if (markerInstance.current) markerInstance.current.setMap(null); // 마커는 제거
          return;
        }

        if (response.v2.meta.totalCount === 0) {
          setMessage('검색 결과가 없습니다.');
          // setCurrentAddress(''); // 이 부분 주석 처리!
          // setCurrentCoords({ lat: null, lng: null }); // 이 부분 주석 처리!
          if (markerInstance.current) markerInstance.current.setMap(null); // 마커는 제거
          return;
        }

        const item = response.v2.addresses[0];
        const newLat = parseFloat(item.y);
        const newLng = parseFloat(item.x);
        const newZipCode = item.zipCode || ''; // 우편번호 추출

        // 상세 주소 조합
        let detailedAddress = item.roadAddress;
        if (!detailedAddress) {
          detailedAddress = item.jibunAddress;
        }

        // 건물 이름 찾기
        const buildingNameElement = item.addressElements.find((el) => el.types.includes('BUILDING_NAME'));
        const buildingName = buildingNameElement ? buildingNameElement.longName : '';

        // 도로명 주소에 건물 이름이 포함되어 있지 않으면 추가
        if (detailedAddress && buildingName && !detailedAddress.includes(buildingName)) {
          detailedAddress += ` (${buildingName})`;
        }

        const newAddress = detailedAddress || addressInput;

        setCurrentAddress(newAddress);
        setCurrentCoords({ lat: newLat, lng: newLng });
        setCurrentZipCode(newZipCode); // 우편번호 상태 업데이트
        setMessage(`"${newAddress}" 주소를 찾았습니다.`);

        if (mapInstance.current && markerInstance.current) {
          const newPosition = new window.naver.maps.LatLng(newLat, newLng);
          markerInstance.current.setPosition(newPosition);
          markerInstance.current.setMap(mapInstance.current);
          mapInstance.current.setCenter(newPosition);
          mapInstance.current.setZoom(15);
        }
      }
    );
  }, [addressInput, isApiLoaded]); // isApiLoaded를 의존성 배열에 추가!

  // '이 주소 선택' 버튼 클릭 핸들러
  const handleSelectAddress = () => {
    if (onAddressSelect && currentCoords.lat && currentCoords.lng && currentAddress) {
      onAddressSelect(currentAddress, currentCoords.lat, currentCoords.lng, currentZipCode);
    } else {
      setMessage('먼저 주소를 검색하여 선택해주세요.');
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="주소를 입력하세요"
          value={addressInput}
          onChange={handleAddressInputChange}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="button"
          onClick={handleSearchAddress}
          style={{
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          검색
        </button>
      </div>

      {message && <p style={{ color: currentCoords.lat ? 'green' : 'red' }}>{message}</p>}

      {/* isApiLoaded 상태에 따라 MapContainer를 조건부 렌더링 */}
      <MapContainer ref={mapRef} />
      {!isApiLoaded && <p style={{ textAlign: 'center', color: '#555' }}>지도를 불러오는 중입니다...</p>}

      {currentCoords.lat && currentCoords.lng && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3>선택된 주소:</h3>
          <p>
            <strong>{currentAddress}</strong>
          </p>
          {currentZipCode && <p>우편번호: {currentZipCode}</p>}
          <p>
            위도: {currentCoords.lat}, 경도: {currentCoords.lng}
          </p>
          <SelectAddressButton onClick={handleSelectAddress}>이 주소 선택</SelectAddressButton>
        </div>
      )}
    </div>
  );
};

export default NaverMapWithGeocoding;
