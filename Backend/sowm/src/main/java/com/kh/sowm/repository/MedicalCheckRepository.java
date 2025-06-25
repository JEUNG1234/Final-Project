package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import com.kh.sowm.entity.User;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MedicalCheckRepository {
    void save(MedicalCheckResult medicalCheckResult);

    Optional<MedicalCheckResult> findResultByUserId(User user, Type type);

    List<MedicalCheckHeadScore> findByMedicalCheckResult(MedicalCheckResult result);
}
