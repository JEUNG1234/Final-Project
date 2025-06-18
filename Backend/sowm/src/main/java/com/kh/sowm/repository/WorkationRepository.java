package com.kh.sowm.repository;

import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;


public interface WorkationRepository {
    void save (Workation workation);
    void save (WorkationLocation location);
}

