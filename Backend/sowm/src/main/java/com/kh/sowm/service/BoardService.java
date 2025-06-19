package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import java.util.List;

public interface BoardService {
    List<BoardDto> getAllBoards();
    BoardDto getBoardById(Long boardNo);
}
