package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import com.kh.sowm.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class MedicalCheckRepositoryImpl implements MedicalCheckRepository {

    @PersistenceContext
    EntityManager em;
    @Override
    public void save(MedicalCheckResult medicalCheckResult) {
        em.persist(medicalCheckResult);
    }

    @Override
    public Optional<MedicalCheckResult> findResultByUserId(User user, Type type) {
        List<MedicalCheckResult> result = em.createQuery(
                        "SELECT r FROM MedicalCheckResult r " +
                                "WHERE r.user = :user AND r.medicalCheckType = :type " +
                                "ORDER BY r.medicalCheckResultNo DESC", // 변경된 부분
                        MedicalCheckResult.class)
                .setParameter("user", user)
                .setParameter("type", type)
                .setMaxResults(1)
                .getResultList();

        return result.stream().findFirst();
    }

    @Override
    public List<MedicalCheckHeadScore> findByMedicalCheckResult(MedicalCheckResult result) {
        return em.createQuery(
                        "SELECT s FROM MedicalCheckHeadScore s WHERE s.medicalCheckResult = :result ORDER BY s.headNo",
                        MedicalCheckHeadScore.class)
                .setParameter("result", result)
                .getResultList();
    }

    @Override
    public Page<MedicalCheckResult> findResults(Pageable pageable, LocalDate createDate, Type type) {
        StringBuilder jpql = new StringBuilder("SELECT r FROM MedicalCheckResult r WHERE 1=1");
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(r) FROM MedicalCheckResult r WHERE 1=1");

        Map<String, Object> params = new HashMap<>();

        if (createDate != null) {
            jpql.append(" AND r.medicalCheckCreateDate = :createDate");
            countJpql.append(" AND r.medicalCheckCreateDate = :createDate");
            params.put("createDate", createDate);
        }

        if (type != null) {
            jpql.append(" AND r.medicalCheckType = :type");
            countJpql.append(" AND r.medicalCheckType = :type");
            params.put("type", type);
        }

        jpql.append(" ORDER BY r.medicalCheckCreateDate DESC");

        // 본 쿼리 실행
        TypedQuery<MedicalCheckResult> query = em.createQuery(jpql.toString(), MedicalCheckResult.class);
        params.forEach(query::setParameter);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<MedicalCheckResult> resultList = query.getResultList();

        // 카운트 쿼리 실행
        TypedQuery<Long> countQuery = em.createQuery(countJpql.toString(), Long.class);
        params.forEach(countQuery::setParameter);
        Long total = countQuery.getSingleResult();

        return new PageImpl<>(resultList, pageable, total);
    }



}
