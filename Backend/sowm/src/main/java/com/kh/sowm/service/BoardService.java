package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BoardService {
    Page<BoardDto.Response> getBoardList(Pageable pageable);

    BoardDto.Response getBoardDetail(Long boardNo);

    Long createBoard(BoardDto.Create boardDto) throws IOException;

    void deleteBoard(Long boardNo);

    BoardDto.Response updateBoard(Long boardNo, BoardDto.Update boardDto) throws IOException;
}
