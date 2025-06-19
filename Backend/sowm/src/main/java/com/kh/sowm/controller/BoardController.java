package com.kh.sowm.controller;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

    private final BoardService boardService;
    /*
    page 보고자하는 페이지 번호
    size 몇개씩 가지고 올것인지
    sort 정렬 기준 : 속성, 방향 (boardTitle,desc)
     */
    @GetMapping
    public ResponseEntity<PageResponse<BoardDto.Response>> getBoards(
            @PageableDefault(size = 10, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(boardService.getBoardList(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDto.Response> getBoard(@PathVariable("id") Long boardNo) {
        return ResponseEntity.ok(boardService.getBoardDetail(boardNo));
    }

    @PostMapping
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardDto.Create boardCreate) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardCreate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable("id") Long boardNo) {
        boardService.deleteBoard(boardNo);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BoardDto.Response> updateBoard(
            @PathVariable("id") Long boardNo,
            @ModelAttribute BoardDto.Update updateBoard
    ) throws IOException {
        return ResponseEntity.ok(boardService.updateBoard(boardNo, updateBoard));
    }
}