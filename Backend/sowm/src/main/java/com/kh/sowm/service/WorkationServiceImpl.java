package com.kh.sowm.service;


import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.repository.UserRepositoryImpl;
import com.kh.sowm.repository.WorkationLocationRepository;
import com.kh.sowm.repository.WorkationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkationServiceImpl implements WorkationService {

    private final WorkationRepository workationRepository;
    private final UserRepositoryImpl userRepositoryImpl;
    private final WorkationLocationRepository workationLocationRepository;

    @Override
    public Workation enrollWorkation(Workation workation, WorkationLocation location, String userId) {

        User user = userRepositoryImpl.findByUserId(userId).orElseThrow(() ->new EntityNotFoundException("회원아이디를 찾을 수 없습니다."));

        WorkationLocation savedLocation = workationLocationRepository.save(location);


        workation.assignUser(user);
        workation.setWorkationLocation(savedLocation);


        return workationRepository.save(workation);
    }
}
