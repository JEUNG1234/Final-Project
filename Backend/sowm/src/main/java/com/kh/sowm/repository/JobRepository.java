package com.kh.sowm.repository;

import com.kh.sowm.entity.Job;

import java.util.Optional;

public interface JobRepository {
    Optional<Job> findById(String j2);
}
