package com.kh.sowm.repository;

import com.kh.sowm.entity.Job;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JobRepositoryImpl implements JobRepository {

    @PersistenceContext
    private EntityManager em;

    // 직급별 유저 정보 조회
    @Override
    public Optional<Job> findById(String jobCode) {
        Job job = em.find(Job.class, jobCode);
        return Optional.ofNullable(job);
    }
}
