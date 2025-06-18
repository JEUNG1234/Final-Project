package com.kh.sowm.service;

import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;


public interface WorkationService {

    Workation enrollWorkation(Workation workation, WorkationLocation location, String userId);
}
