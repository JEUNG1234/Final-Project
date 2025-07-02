package com.kh.sowm.repository;

import com.kh.sowm.entity.Board;
import com.kh.sowm.entity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    List<BoardImage> findByBoard(Board board);
}