package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import com.kh.sowm.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
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

}
