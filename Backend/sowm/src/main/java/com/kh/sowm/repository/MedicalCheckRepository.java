package com.kh.sowm.repository;

import com.kh.sowm.entity.MedicalCheckHeadScore;
import com.kh.sowm.entity.MedicalCheckResult;
import com.kh.sowm.entity.MedicalCheckResult.Type;
import com.kh.sowm.entity.User;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MedicalCheckRepository {
    void save(MedicalCheckResult medicalCheckResult);

    Optional<MedicalCheckResult> findResultByUserId(User user, Type type);

    List<MedicalCheckHeadScore> findByMedicalCheckResult(MedicalCheckResult result);

    Page<MedicalCheckResult> findResults(Pageable pageable, LocalDate createDate, Type type, User user);
}
