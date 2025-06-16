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
  const [message, setMessage] = useState('');

  // ... (initializeMap, useEffect 기존 코드 동일) ...
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.naver || !window.naver.maps) {
      console.warn("Naver Maps API가 아직 로드되지 않았습니다.");
      return;
    }

    const initialCenter = new window.naver.maps.LatLng(37.5665, 126.9780); // 서울 시청

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
  }, []);

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap();
    } else {
      const timer = setTimeout(() => {
        initializeMap();
      }, 500);
      return () => clearTimeout(timer);
    }
    return () => {
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
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      setMessage("네이버 지도 서비스가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (!addressInput.trim()) {
      setMessage("주소를 입력해주세요.");
      return;
    }

    window.naver.maps.Service.geocode({
      query: addressInput,
    }, function(status, response) {
      if (status === window.naver.maps.Service.Status.ERROR) {
        setMessage('지오코딩 중 오류가 발생했습니다.');
        setCurrentAddress('');
        setCurrentCoords({ lat: null, lng: null });
        if (markerInstance.current) markerInstance.current.setMap(null);
        return;
      }

      if (response.v2.meta.totalCount === 0) {
        setMessage('검색 결과가 없습니다.');
        setCurrentAddress('');
        setCurrentCoords({ lat: null, lng: null });
        if (markerInstance.current) markerInstance.current.setMap(null);
        return;
      }

      const item = response.v2.addresses[0];
      const newLat = parseFloat(item.y);
      const newLng = parseFloat(item.x);
      const newAddress = item.roadAddress || item.jibunAddress || addressInput; // 도로명 주소 우선, 없으면 지번, 없으면 검색어

      setCurrentAddress(newAddress);
      setCurrentCoords({ lat: newLat, lng: newLng });
      setMessage(`"${newAddress}" 주소를 찾았습니다.`);

      if (mapInstance.current && markerInstance.current) {
        const newPosition = new window.naver.maps.LatLng(newLat, newLng);
        markerInstance.current.setPosition(newPosition);
        markerInstance.current.setMap(mapInstance.current);
        mapInstance.current.setCenter(newPosition);
        mapInstance.current.setZoom(15);
      }
    });
  }, [addressInput]);

  // '이 주소 선택' 버튼 클릭 핸들러
  const handleSelectAddress = () => {
    if (onAddressSelect && currentCoords.lat && currentCoords.lng && currentAddress) {
      onAddressSelect(currentAddress, currentCoords.lat, currentCoords.lng);
    } else {
      setMessage("먼저 주소를 검색하여 선택해주세요.");
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: 'auto' }}> {/* 모달 내부에 맞게 패딩 조절 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="주소를 입력하세요"
          value={addressInput}
          onChange={handleAddressInputChange}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSearchAddress}
          style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
        >
          검색
        </button>
      </div>

      {message && <p style={{ color: currentCoords.lat ? 'green' : 'red' }}>{message}</p>}

      <MapContainer ref={mapRef} />

      {currentCoords.lat && currentCoords.lng && (
        <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>선택된 주소:</h3>
          <p><strong>{currentAddress}</strong></p>
          <p>위도: {currentCoords.lat}, 경도: {currentCoords.lng}</p>
          <SelectAddressButton onClick={handleSelectAddress}>
            이 주소 선택
          </SelectAddressButton>
        </div>
      )}
    </div>
  );
};

export default NaverMapWithGeocoding;