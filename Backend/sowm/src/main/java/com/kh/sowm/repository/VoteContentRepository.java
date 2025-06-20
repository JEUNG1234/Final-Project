package com.kh.sowm.repository;

import com.kh.sowm.entity.VoteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

//VoteContent 엔티티에 대한 데이터베이스 작업을 처리하는 JpaRepository
public interface VoteContentRepository extends JpaRepository<VoteContent, Long> {
    //특정 투표(voteNo)에 속한 모든 항목들을 조회.
    List<VoteContent> findByVoteNo(Long voteNo);
}