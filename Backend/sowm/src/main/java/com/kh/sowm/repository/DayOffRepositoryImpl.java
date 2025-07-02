package com.kh.sowm.repository;

import com.kh.sowm.entity.DayOff;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class DayOffRepositoryImpl implements DayOffRepository {

    @PersistenceContext
    private EntityManager em;


    @Override
    public void save(DayOff dayOff) {
        em.persist(dayOff);
    }

    @Override
    public void updateDay(DayOff dayOff) {
        em.merge(dayOff);

    }

    @Override
    public void deleteByworkationNo(Long workationNo) {
        em.createQuery("DELETE FROM DayOff d WHERE d.workation.workationNo = :workationNo")
                .setParameter("workationNo", workationNo)
                .executeUpdate();
    }
}
