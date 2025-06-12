// src/components/MyLeafletMap.jsx (예시 파일명)
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS 임포트

// Leaflet의 기본 마커 아이콘이 깨져 보일 수 있으므로, 임포트하여 사용합니다.
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// 기본 마커 아이콘 설정 (없으면 마커가 보이지 않거나 깨져 보일 수 있음)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

function MyLeafletMap() {
  // 지도의 초기 중심 좌표와 확대 레벨
  const position = [33.4507, 126.5706]; // 제주도 (예시)
  const zoomLevel = 12;

  return (
    // 지도가 표시될 컨테이너의 크기를 지정해야 합니다.
    // height와 width를 CSS에서 지정하거나 인라인 스타일로 지정합니다.
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        {/* OpenStreetMap 타일 레이어 (기본 지도 이미지) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 마커 추가 */}
        <Marker position={position}>
          <Popup>
            제주 애월 스테이 <br /> 워케이션 장소입니다.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MyLeafletMap;