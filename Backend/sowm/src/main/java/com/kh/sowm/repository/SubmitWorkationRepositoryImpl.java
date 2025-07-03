package com.kh.sowm.repository;


import com.kh.sowm.dto.WorkationDto.WorkationNoDto;
import com.kh.sowm.dto.WorkationDto.WorkationSubNoDto;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.SubmitWorkation.StatusType;
import com.kh.sowm.entity.Workation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class SubmitWorkationRepositoryImpl implements SubmitWorkationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<SubmitWorkation> findByStatus(StatusType statusType, String companyCode) {
        String jpql = "SELECT w FROM SubmitWorkation w " +
                "JOIN FETCH w.user u " +
                "WHERE w.status = :status AND u.companyCode = :companyCode";
        return em.createQuery(jpql, SubmitWorkation.class)
                .setParameter("status", statusType)
                .setParameter("companyCode", companyCode)
                .getResultList();
    }

    @Override
    public List<WorkationSubNoDto> findByworkationSubNo(List<WorkationNoDto> workationNoDtos) {
        SubmitWorkation submitWorkation = em.find(SubmitWorkation.class, workationNoDtos.get(0).getWorkationNo());
        submitWorkation.setStatus(StatusType.Y);
        em.merge(submitWorkation);
        return null;
    }

    @Override
    public Optional<SubmitWorkation> findById(Long subNo) {
        return Optional.ofNullable(em.find(SubmitWorkation.class, subNo));
    }

    @Override
    @Transactional
    public void approvedUpdate(SubmitWorkation submit) {
        em.merge(submit);
    }

    @Override
    @Transactional
    public void returnUpdate(SubmitWorkation submit) {
        em.merge(submit);
    }

    //워케이션 유저가 신청한 신청목록 가져오기
    @Override
    public List<SubmitWorkation> findById(String userId) {
        String jpql = "SELECT w FROM SubmitWorkation w " +
                "WHERE w.user.userId = :userId";
        return em.createQuery(jpql, SubmitWorkation.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    //유저가 신청한 워케이션 신청취소
    @Override
    public void delete(Long subNo) {
        em.remove(em.find(SubmitWorkation.class, subNo));
    }

    @Override
    public List<SubmitWorkation> findByList(String companyCode) {
        String jpql = "SELECT w FROM SubmitWorkation w " +
                "JOIN Fetch w.user u " +
                "WHERE u.companyCode = :companyCode";
        return em.createQuery(jpql, SubmitWorkation.class)
                .setParameter("companyCode", companyCode)
                .getResultList();
    }

    @Override
    public List<SubmitWorkation> findApprovedByUserId(String userId) {
        String jpql = "SELECT sw FROM SubmitWorkation sw " +
                "WHERE sw.user.userId = :userId AND sw.status = :status";
        return em.createQuery(jpql, SubmitWorkation.class)
                .setParameter("userId", userId)
                .setParameter("status", SubmitWorkation.StatusType.Y)
                .getResultList();
    }

}