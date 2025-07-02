package com.kh.sowm.repository;

import com.kh.sowm.entity.Vacation;

public interface VacationRepository {
    void save(Vacation vacation);
    long countByUserId(String userId); // 추가된 메서드
}