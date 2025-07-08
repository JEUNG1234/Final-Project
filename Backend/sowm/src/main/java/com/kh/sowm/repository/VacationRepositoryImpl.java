package com.kh.sowm.repository;

import com.kh.sowm.dto.VacationDto.VacationResponseDto;

import com.kh.sowm.entity.Vacation;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

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

    //
    @Override
    public long countByUserId(String userId) {
        return em.createQuery("SELECT COUNT(v) FROM Vacation v WHERE v.user.userId = :userId", Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }

    //휴가 신청
    @Override
    public void save(VacationAdmin vacationAdmin) { em.persist(vacationAdmin); }

    @Override
    public Optional<VacationResponseDto> findBylist(String userId, StatusType y) {
        return Optional.empty();
    }

    //휴가 내역 가져오기(승인된 휴가만)
    @Override
    public List<VacationAdmin> findBySubmitList(String userId, StatusType StatusType) {
        String jpql = "SELECT v FROM VacationAdmin v WHERE v.user.userId = :userId " +
                "AND v.status = :statusType";
        return em.createQuery(jpql, VacationAdmin.class)
        .setParameter("userId", userId)
        .setParameter("statusType", StatusType)
                .getResultList();
    }

    //휴가 내역 가져오기(포인트적립 등)
    @Override
    public List<Vacation> findBySubmitList(String userId) {
        String jpql = "SELECT v FROM Vacation v WHERE v.user.userId = :userId";

        return em.createQuery(jpql, Vacation.class)
                .setParameter("userId", userId)
                .getResultList();

    }

    //휴가 신청 내역(대기인것만 가져오기)
    @Override
    public List<VacationAdmin> findByWaitList(String userId) {
        String jpql =("SELECT v FROM VacationAdmin v WHERE v.user.userId = :userId ORDER BY CASE WHEN v.status = 'W' THEN 0 ELSE 1 END, v.vacationNo DESC");

        return em.createQuery(jpql, VacationAdmin.class)
                .setParameter("userId", userId)
                .getResultList();
    }


    @Override
    public Optional<VacationAdmin> findById(Long vacationNos) {

        return Optional.ofNullable(em.find(VacationAdmin.class, vacationNos));
    }

    //신청한 휴가 취소
    @Override
    public void delete(Long vacationNos) {
        em.remove(em.find(VacationAdmin.class, vacationNos));
    }

    //보유 휴가일 수
    @Override
    public Integer amount(String userId) {

        String jpql = "SELECT U.vacation FROM User U WHERE U.userId = :userId";

            return em.createQuery(jpql, Integer.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
    }
}