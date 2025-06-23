package com.kh.sowm.repository;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.SubmitWorkation;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class WorkationRepositoryImpl implements WorkationRepository {

    @PersistenceContext
    private EntityManager em;

    //워케이션 생성용
    @Override
    public Workation save(Workation workation) {
        em.persist(workation);
        return workation;
    }

    //워케이션 카드 리스트 가져오는 용도
    @Override
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> findByList(String companyCode) {
        String jpql = "SELECT new com.kh.sowm.dto.WorkationDto.WorkationBasicDto(" +
                "wl.locationNo, wl.address, w.workationTitle, u.userId, w.peopleMin, w.peopleMax, w.workationStartDate, w.workationEndDate) " +
                "FROM Workation w " +
                "JOIN w.workationLocation wl " +
                "JOIN w.user u " +
                "WHERE w.status = :status AND u.companyCode = :companyCode";

        List<WorkationDto.WorkationBasicDto> result = em.createQuery(jpql, WorkationDto.WorkationBasicDto.class)
                .setParameter("status", CommonEnums.Status.Y)
                .setParameter("companyCode", companyCode)
                .getResultList();

        return ResponseEntity.ok(result);
    }

    @Override
    public List<Workation> findByStatus(CommonEnums.Status status, String companyCode) {
        String jpql = "SELECT w FROM Workation w " +
                "JOIN FETCH w.workationLocation wl " +
                "JOIN FETCH w.user u " +
                "WHERE w.status = :status AND u.companyCode = :companyCode";

        return em.createQuery(jpql, Workation.class)
                .setParameter("status", status)
                .setParameter("companyCode", companyCode)
                .getResultList();
    }

    //워케이션 정보조희
    @Override
    public WorkationDto.ResponseDto findByInfo(int locationNo) {
        String jpql = "SELECT w FROM Workation w " +
                "JOIN FETCH w.workationLocation wl " +
                "WHERE wl.locationNo = :locationNo";
        Workation workation = em.createQuery(jpql, Workation.class)
                .setParameter("locationNo", locationNo)
                .getSingleResult();

        return WorkationDto.ResponseDto.toDto(workation);
    }

    //워케이션No 조회용도
    @Override
    public Optional<Workation> findByWorkationNo(Long workationNo) {
        return Optional.ofNullable(em.find(Workation.class, workationNo));
    }

    //워케이션 신청
    @Override
    public SubmitWorkation save(SubmitWorkation subWork) {
         em.persist(subWork);
         return subWork;
    }

    //워케이션 수정용
    @Override
    public void updateWorkation(Workation workation) {
        em.merge(workation);
    }

    @Override
    @Transactional
    public Workation updateWorkationStatus(Long workationNo) {
        Workation workation = em.find(Workation.class, workationNo);
        if (workation == null) throw new EntityNotFoundException("Workation not found");
        workation.setStatus(CommonEnums.Status.N); // 상태만 'N'으로 바꿈
        em.merge(workation);
        return workation;
    }


}
