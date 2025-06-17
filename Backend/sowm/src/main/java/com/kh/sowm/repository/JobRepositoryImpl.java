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


    @Override
    public Optional<Job> findById(String jobCode) {
        Job job = em.find(Job.class, jobCode);
        return Optional.ofNullable(job);
    }
}
