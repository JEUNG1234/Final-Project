package com.kh.sowm.repository;

import com.kh.sowm.entity.Vote;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryImpl implements VoteRepository {

    private final EntityManager em;

    // 투표 저장 또는 수정
    @Override
    public Vote save(Vote vote) {
        if (vote.getVoteNo() == null) {
            em.persist(vote);
            return vote;
        } else {
            return em.merge(vote);
        }
    }

    // 모든 투표 조회 (페이징 및 회사 코드로 필터링)
    @Override
    public Page<Vote> findAll(String companyCode, Pageable pageable) {
        // 데이터 조회를 위한 JPQL
        TypedQuery<Vote> query = em.createQuery("SELECT v FROM Vote v WHERE v.companyCode = :companyCode ORDER BY v.voteNo DESC", Vote.class)
                .setParameter("companyCode", companyCode);

        // 페이징 적용
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Vote> votes = query.getResultList();

        // 전체 카운트 조회를 위한 JPQL
        TypedQuery<Long> countQuery = em.createQuery("SELECT COUNT(v) FROM Vote v WHERE v.companyCode = :companyCode", Long.class)
                .setParameter("companyCode", companyCode);

        long total = countQuery.getSingleResult();

        return new PageImpl<>(votes, pageable, total);
    }


    // ID로 투표 조회
    @Override
    public Optional<Vote> findById(Long voteNo) {
        Vote vote = em.find(Vote.class, voteNo);
        return Optional.ofNullable(vote);
    }

    // 특정 투표에 연결된 모든 VoteUser 기록 삭제
    @Override
    public void deleteVoteUsersByVote(Vote vote) {
        em.createQuery("DELETE FROM VoteUser vu WHERE vu.vote = :vote")
                .setParameter("vote", vote)
                .executeUpdate();
    }

    // 투표 삭제 (연관된 VoteUser 먼저 삭제)
    @Override
    public void delete(Vote vote) {
        // VoteUser 기록을 먼저 삭제
        deleteVoteUsersByVote(vote);
        // 그 다음 Vote를 삭제
        em.remove(em.contains(vote) ? vote : em.merge(vote));
    }

    // 특정 기간 내에 투표한 유니크한 사용자 수 조회
    @Override
    public long countUniqueVotersByCompanyCodeInPeriod(String companyCode, LocalDate startDate, LocalDate endDate) {
        // VoteUser를 통해 연결된 Vote의 companyCode로 필터링하도록 수정
        return em.createQuery(
                        "SELECT COUNT(DISTINCT vu.user) FROM VoteUser vu " +
                                "WHERE vu.vote.companyCode = :companyCode " +
                                "AND vu.votedDate BETWEEN :startDate AND :endDate", Long.class)
                .setParameter("companyCode", companyCode)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getSingleResult();
    }

    // 회사 코드에 해당하는 전체 활성 사용자 수 조회
    @Override
    public long countTotalUsersByCompanyCode(String companyCode) {
        return em.createQuery(
                        "SELECT COUNT(u) FROM User u WHERE u.companyCode = :companyCode AND u.status = 'Y'", Long.class)
                .setParameter("companyCode", companyCode)
                .getSingleResult();
    }
}