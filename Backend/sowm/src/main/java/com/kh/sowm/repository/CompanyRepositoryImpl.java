package com.kh.sowm.repository;

import com.kh.sowm.entity.Company;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class CompanyRepositoryImpl implements CompanyRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Company company) {em.persist(company);}
}
