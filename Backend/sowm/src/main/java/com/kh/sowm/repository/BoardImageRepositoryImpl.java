package com.kh.sowm.repository;

import com.kh.sowm.dto.BoardImageDto;
import com.kh.sowm.entity.BoardImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class BoardImageRepositoryImpl implements BoardImageRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(BoardImage image) {
        em.persist(image);

    }

    @Override
    public void updateImage(BoardImageDto image) {
        em.merge(image);
    }

    @Override
    public void deleteByboardNo(Long boardNo) {
        System.out.println("실행되나요?");
        em.createQuery("DELETE FROM BoardImage b WHERE b.board.boardNo = :boardNo")
                .setParameter("boardNo", boardNo)
                .executeUpdate();
    }
}
