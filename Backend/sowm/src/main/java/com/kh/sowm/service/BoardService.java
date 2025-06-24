package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;

public interface BoardService {
    // getBoardList 메서드에 검색 조건 (title, writer, categoryNo) 파라미터 추가
    Page<BoardDto.Response> getBoardList(Pageable pageable, String title, String writer, Long categoryNo);

    BoardDto.Response getBoardDetail(Long boardNo);

    Long createBoard(BoardDto.Create boardDto) throws IOException;

    void deleteBoard(Long boardNo);

    BoardDto.Response updateBoard(Long boardNo, BoardDto.Update boardDto) throws IOException;

    // 게시글 조회수 증가 메서드 선언은 그대로 유지
    boolean increaseViewCount(Long boardId);
}