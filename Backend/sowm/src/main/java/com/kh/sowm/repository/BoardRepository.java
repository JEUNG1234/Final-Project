package com.kh.sowm.repository;

import com.kh.sowm.entity.Board;
import com.kh.sowm.enums.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

// JpaRepository를 상속받지 않습니다.
public interface BoardRepository {

    // 검색 조건과 페이징을 포함한 게시글 목록 조회 메서드
    Page<Board> findBoardsByFilters(Pageable pageable, String title, String writer, Long categoryNo, CommonEnums.Status status);

    // ID로 게시글 조회
    Optional<Board> findById(Long id);

    // 게시글 저장 (생성 및 수정)
    Long save(Board board);

    // 게시글 삭제
    void delete(Board board);

    // 조회수 증가
    int increaseViewCount(Long boardId);

    // (필요하다면) userId로 사용자 게시글 목록 조회 등 추가 메서드 정의 가능
}