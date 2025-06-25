// BoardRepositoryImpl.java
package com.kh.sowm.repository;

import com.kh.sowm.entity.Board;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils; // Spring 5.x+부터 사용 가능

import java.util.List;
import java.util.Optional;

@Repository
public class BoardRepositoryImpl implements BoardRepository { // BoardRepository 인터페이스 구현

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<Board> findBoardsByFilters(Pageable pageable, String title, String writer, Long categoryNo, String companyCode, CommonEnums.Status status) {
        StringBuilder jpql = new StringBuilder("SELECT b FROM Board b WHERE b.status = :status");
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(b) FROM Board b WHERE b.status = :status");

        // 검색 조건 추가 (동적으로 WHERE 절 구성)
        if (StringUtils.hasText(title)) {
            jpql.append(" AND b.boardTitle LIKE :title");
            countJpql.append(" AND b.boardTitle LIKE :title");
        }
        if (StringUtils.hasText(writer)) {
            jpql.append(" AND b.user.userName LIKE :writer"); // userName 필드가 Board 엔티티에 직접 있다고 가정
            countJpql.append(" AND b.user.userName LIKE :writer");
        }
        if (categoryNo != null) {
            jpql.append(" AND b.category.categoryNo = :categoryNo"); // category 엔티티와의 관계를 통해 필터링
            countJpql.append(" AND b.category.categoryNo = :categoryNo");
        }

        if (StringUtils.hasText(companyCode)) {
            jpql.append(" AND b.user.company.companyCode = :companyCode");
            countJpql.append(" AND b.user.company.companyCode = :companyCode");
        }

        // 정렬 조건 추가
        // Spring Data JPA의 Pageable.getSort()를 활용하여 동적으로 정렬 쿼리 생성
        if (pageable.getSort().isSorted()) {
            jpql.append(" ORDER BY ");
            for (Sort.Order order : pageable.getSort()) {
                jpql.append("b.").append(order.getProperty()).append(" ").append(order.getDirection().name()).append(", ");
            }
            jpql.setLength(jpql.length() - 2); // 마지막 ", " 제거
        } else {
            // 기본 정렬: 정렬 조건이 없으면 createdDate 내림차순 (Controller의 @PageableDefault와 일치)
            jpql.append(" ORDER BY b.createdDate DESC");
        }

        // 게시글 데이터 조회
        TypedQuery<Board> boardQuery = em.createQuery(jpql.toString(), Board.class)
                .setParameter("status", status);

        // 파라미터 설정
        if (StringUtils.hasText(title)) {
            boardQuery.setParameter("title", "%" + title + "%");
        }
        if (StringUtils.hasText(writer)) {
            boardQuery.setParameter("writer", "%" + writer + "%");
        }
        if (categoryNo != null) {
            boardQuery.setParameter("categoryNo", categoryNo);
        }

        if (StringUtils.hasText(companyCode)) { // 🔽 추가
            boardQuery.setParameter("companyCode", companyCode);
        }

        // 페이징 적용
        boardQuery.setFirstResult((int) pageable.getOffset());
        boardQuery.setMaxResults(pageable.getPageSize());

        List<Board> boards = boardQuery.getResultList();

        // 총 개수 조회
        TypedQuery<Long> countQuery = em.createQuery(countJpql.toString(), Long.class)
                .setParameter("status", status);

        // 파라미터 설정 (count 쿼리에도 동일하게 적용)
        if (StringUtils.hasText(title)) {
            countQuery.setParameter("title", "%" + title + "%");
        }
        if (StringUtils.hasText(writer)) {
            countQuery.setParameter("writer", "%" + writer + "%");
        }
        if (categoryNo != null) {
            countQuery.setParameter("categoryNo", categoryNo);
        }

        if (StringUtils.hasText(companyCode)) { // 🔽 추가
            countQuery.setParameter("companyCode", companyCode);
        }

        Long totalCount = countQuery.getSingleResult();

        return new PageImpl<>(boards, pageable, totalCount);
    }

    @Override
    public Optional<Board> findById(Long id) {
        if(id == null) return Optional.empty();
        return Optional.ofNullable(em.find(Board.class, id));
    }

    @Override
    public Long save(Board board) {
        if (board.getBoardNo() == null) { // 새로운 엔티티인 경우 persist
            em.persist(board);
        } else { // 기존 엔티티인 경우 merge (update)
            em.merge(board);
        }
        return board.getBoardNo();
    }

//    @Override
//    public void delete(Board board) {
//        // 영속성 컨텍스트에 없는 엔티티를 삭제하려 하면 예외 발생
//        // merge를 통해 영속성 컨텍스트에 엔티티를 로드한 후 삭제
//        Board managedBoard = em.merge(board);
//        em.remove(managedBoard);
//    }

    @Override
    public int increaseViewCount(Long boardId) {
        String jpql = "UPDATE Board b SET b.views = b.views + 1 WHERE b.boardNo = :boardId";
        Query query = em.createQuery(jpql);
        query.setParameter("boardId", boardId);
        return query.executeUpdate();
    }
}