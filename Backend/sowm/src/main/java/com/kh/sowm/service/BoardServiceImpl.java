package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.entity.Board;
import com.kh.sowm.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    @Override
    public List<BoardDto> getAllBoards() {
        List<Board> boards = boardRepository.findAll();
        return boards.stream()
                .map(BoardDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BoardDto getBoardById(Long boardNo) {
        Board board = boardRepository.findById(boardNo);
        return BoardDto.fromEntity(board);
    }
}
