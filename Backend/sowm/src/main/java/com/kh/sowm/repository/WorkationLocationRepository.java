package com.kh.sowm.repository;

import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import org.springframework.http.ResponseEntity;

public interface WorkationLocationRepository {
    //워케이션 생성용
    WorkationLocation save (WorkationLocation location);

    //워케이션 수정용
    WorkationLocation updateLocation(WorkationLocation location);
}
