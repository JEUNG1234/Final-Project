package com.kh.sowm.repository;

import com.kh.sowm.entity.WorkationImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class WorkationImageRepositoryImpl implements WorkationImageRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(WorkationImage image) {
        em.persist(image);

    }

    @Override
    public void updateImage(WorkationImage image) {
        em.merge(image);
    }

    @Override
    public void deleteByworkationNo(Long workationNo) {
        System.out.println("실행되나요?");
        em.createQuery("DELETE FROM WorkationImage w WHERE w.workation.workationNo = :workationNo")
                .setParameter("workationNo", workationNo)
                .executeUpdate();
    }
}
