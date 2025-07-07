package com.kh.sowm.repository;

import com.kh.sowm.dto.VacationDto.VacationResponseDto;
import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class VacationRepositoryImpl implements VacationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Vacation vacation) {
        em.persist(vacation);
    }

    @Override
    public long countByUserId(String userId) {
        return em.createQuery("SELECT COUNT(v) FROM Vacation v WHERE v.user.userId = :userId", Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }

    @Override
    public void save(VacationAdmin vacationAdmin) { em.persist(vacationAdmin); }

    @Override
    public Optional<VacationResponseDto> findBylist(String userId, StatusType y) {
        return Optional.empty();
    }

    @Override
    public List<VacationAdmin> findBySubmitList(String userId, StatusType StatusType) {
        String jpql = "SELECT v FROM VacationAdmin v WHERE v.user.userId = :userId " +
                "AND v.status = :statusType";
        return em.createQuery(jpql, VacationAdmin.class)
        .setParameter("userId", userId)
        .setParameter("statusType", StatusType)
                .getResultList();


    }

    @Override
    public List<Vacation> findBySubmitList(String userId) {
        String jpql = "SELECT v FROM Vacation v WHERE v.user.userId = :userId";

        return em.createQuery(jpql, Vacation.class)
                .setParameter("userId", userId)
                .getResultList();

    }


}