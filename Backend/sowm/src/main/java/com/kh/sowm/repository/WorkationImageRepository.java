package com.kh.sowm.repository;

import com.kh.sowm.entity.WorkationImage;

public interface WorkationImageRepository {
    void save(WorkationImage image);

    void updateImage(WorkationImage image);

    void deleteByworkationNo(Long workationNo);
}
