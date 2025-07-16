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

    @PersistenceContext
    private final EntityManager em;

    @Override
    public Vote save(Vote vote) {
        if (vote.getVoteNo() == null) {
            em.persist(vote);
            return vote;
        } else {
            return em.merge(vote);
        }
    }

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


    @Override
    public Optional<Vote> findById(Long voteNo) {
        Vote vote = em.find(Vote.class, voteNo);
        return Optional.ofNullable(vote);
    }

    @Override
    public void delete(Vote vote) {
        // 관련된 VoteUser 엔티티를 먼저 삭제합니다.
        em.createQuery("DELETE FROM VoteUser vu WHERE vu.vote = :vote")
                .setParameter("vote", vote)
                .executeUpdate();

        // 관련된 VoteContent 엔티티를 삭제합니다.
        em.createQuery("DELETE FROM VoteContent vc WHERE vc.vote = :vote")
                .setParameter("vote", vote)
                .executeUpdate();

        // Vote 엔티티를 삭제합니다. (영속성 컨텍스트에 없는 엔티티일 수 있으므로 merge 후 remove)
        em.remove(em.contains(vote) ? vote : em.merge(vote));
    }

    @Override
    public long countUniqueVotersByCompanyCodeInPeriod(String companyCode, LocalDate startDate, LocalDate endDate) {
        //  vu.vote.voteCreatedDate -> vu.votedDate
        return em.createQuery(
                        "SELECT COUNT(DISTINCT vu.user) FROM VoteUser vu " +
                                "WHERE vu.vote.companyCode = :companyCode " +
                                "AND vu.votedDate BETWEEN :startDate AND :endDate", Long.class)
                .setParameter("companyCode", companyCode)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getSingleResult();
    }

    @Override
    public long countTotalUsersByCompanyCode(String companyCode) {
        return em.createQuery(
                        "SELECT COUNT(u) FROM User u WHERE u.companyCode = :companyCode AND u.status = 'Y'", Long.class)
                .setParameter("companyCode", companyCode)
                .getSingleResult();
    }
}