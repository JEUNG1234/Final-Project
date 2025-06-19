package com.kh.sowm.repository;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository {
    List<Board> findAll();       // 전체 목록 조회
    Board findById(Long boardNo);
}