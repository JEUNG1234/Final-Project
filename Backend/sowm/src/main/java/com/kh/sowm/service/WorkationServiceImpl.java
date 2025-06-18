package com.kh.sowm.service;


import com.kh.sowm.entity.Workation;
import com.kh.sowm.entity.WorkationLocation;
import com.kh.sowm.repository.WorkationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkationServiceImpl implements WorkationService {

    private final WorkationRepository workationRepository;

    @Override
    public void enrollWorkation(Workation workation, WorkationLocation location) {
        workationRepository.save(workation);
        workationRepository.save(location);

    }
}
