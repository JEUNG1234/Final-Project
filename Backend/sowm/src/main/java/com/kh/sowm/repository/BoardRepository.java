package com.kh.sowm.repository;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.entity.Board;
import com.kh.sowm.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository {
    Page<Board> findByStatus(CommonEnums.Status status, Pageable pageable);
    Optional<Board> findById(Long id);
    Long save(Board board);
    void delete(Board board);
}