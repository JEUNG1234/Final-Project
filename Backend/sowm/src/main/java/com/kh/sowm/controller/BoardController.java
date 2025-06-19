package com.kh.sowm.controller;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // ✅ React dev server 주소 허용
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardDto>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{boardNo}")
    public ResponseEntity<BoardDto> getBoard(@PathVariable Long boardNo) {
        return ResponseEntity.ok(boardService.getBoardById(boardNo));
    }
}
