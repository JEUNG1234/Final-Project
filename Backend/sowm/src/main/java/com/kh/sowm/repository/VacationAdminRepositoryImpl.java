package com.kh.sowm.repository;

import com.kh.sowm.dto.VacationAdminDto.ResponseDto;
import com.kh.sowm.entity.VacationAdmin;
import com.kh.sowm.entity.VacationAdmin.StatusType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public class VacationAdminRepositoryImpl implements VacationAdminRepository {

    @PersistenceContext
    EntityManager em;

    @Override
    public List<VacationAdmin> findByStatus(StatusType statusType, String companyCode) {

        String jpql = "SELECT v FROM VacationAdmin v WHERE v.status = :statusType AND v.user.companyCode = :companyCode";
        return em.createQuery(jpql, VacationAdmin.class)
                .setParameter("statusType", statusType)
                .setParameter("companyCode", companyCode)
                .getResultList();
    }

    @Override
    public List<VacationAdmin> findAllById(List<Long> vacationNos) {
        if (vacationNos == null || vacationNos.isEmpty()) {
            return List.of();
        }

        String jpql = "SELECT v FROM VacationAdmin v WHERE v.vacationNo IN :vacationNos";
        return em.createQuery(jpql, VacationAdmin.class)
                .setParameter("vacationNos", vacationNos)
                .getResultList();
    }

    @Override
    public void saveAll(List<VacationAdmin> vacations) {
        // 리스트라서 복수엔티티를 저장해야 하기 때문에 반복문으로 저장
        if (vacations == null || vacations.isEmpty()) {
            return;
        }
        for (VacationAdmin vacation : vacations) {
            em.merge(vacation); // 기존 엔티티면 업데이트, 아니면 새로 저장
        }
        
        em.flush();
    }

    @Override
    public ResponseEntity<List<ResponseDto>> getAllVactionList() {
        String jpql = "SELECT v FROM VacationAdmin v";
        List<VacationAdmin> vacationList = em.createQuery(jpql, VacationAdmin.class).getResultList();

        List<ResponseDto> responseList = vacationList.stream()
                .map(v -> new ResponseDto(v))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
}
