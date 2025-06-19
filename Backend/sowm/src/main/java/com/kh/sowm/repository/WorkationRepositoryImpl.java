package com.kh.sowm.repository;

import com.kh.sowm.dto.WorkationDto;
import com.kh.sowm.entity.Attendance;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WorkationRepositoryImpl implements WorkationRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Workation save(Workation workation) {
        em.persist(workation);
        return workation;
    }

    @Override
    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> findByList() {
        String jpql = "SELECT new com.kh.sowm.dto.WorkationDto.WorkationBasicDto(" +
                "wl.locationNo, wl.address, w.workationTitle) " +
                "FROM Workation w " +
                "JOIN w.workationLocation wl " +
                "WHERE w.status = :status";
        List<WorkationDto.WorkationBasicDto> result = em.createQuery(jpql, WorkationDto.WorkationBasicDto.class)
                .setParameter("status", CommonEnums.Status.Y)
                .getResultList();

        return ResponseEntity.ok(result);
    }

    @Override
    public List<Workation> findByStatus(CommonEnums.Status status) {
        return em.createQuery(
                        "SELECT w FROM Workation w JOIN FETCH w.workationLocation wl WHERE w.status = :status",
                        Workation.class)
                .setParameter("status", status)
                .getResultList();
    }


//    @Override
//    public ResponseEntity<List<WorkationDto.WorkationBasicDto>> findByList() {
//        List<WorkationDto.WorkationBasicDto> result = em.createQuery(
//                        "SELECT new com.kh.sowm.dto.WorkationDto$WorkationBasicDto(" +
//                                "w.location.locationNo, w.location.address, w.workationTitle) " +
//                                "FROM Workation w", WorkationDto.WorkationBasicDto.class)
//                .getResultList();
//
//        return ResponseEntity.ok(result);
//    }
}
