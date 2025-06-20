// src/components/NaverMapStatic.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const NaverMapStatic = ({ latitude, longitude, address }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.naver || !window.naver.maps || !mapRef.current) return;

      const location = new window.naver.maps.LatLng(latitude, longitude);

      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      });

      markerInstance.current = new window.naver.maps.Marker({
        position: location,
        map: mapInstance.current,
        title: address || '',
      });
    };

    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 100);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, address]);

  return <MapContainer ref={mapRef} />;
};

export default NaverMapStatic;
