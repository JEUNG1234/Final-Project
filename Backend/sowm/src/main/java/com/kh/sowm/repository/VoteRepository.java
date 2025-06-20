package com.kh.sowm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

//Vote 엔티티에 대한 데이터베이스 작업을 처리하는 JpaRepository
public interface VoteRepository extends JpaRepository<Vote, Long> {
}