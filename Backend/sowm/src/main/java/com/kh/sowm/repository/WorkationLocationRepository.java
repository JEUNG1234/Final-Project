package com.kh.sowm.repository;

import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import org.springframework.http.ResponseEntity;

public interface WorkationLocationRepository {
    WorkationLocation save (WorkationLocation location);

    WorkationLocation updateLocation(WorkationLocation location);
}
