package com.kh.sowm.controller;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.dto.PageResponse;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.Board;
import com.kh.sowm.entity.User;
import com.kh.sowm.service.BoardService;
import com.kh.sowm.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 💡 포트 5174 -> 5173으로 수정
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;

    /*
    page: 보고자 하는 페이지 번호 (0부터 시작)
    size: 한 페이지당 몇 개씩 가지고 올 것인지
    sort: 정렬 기준 (예: "createdDate,desc")
    title: 검색할 게시글 제목
    writer: 검색할 작성자 이름
    categoryNo: 검색할 카테고리 번호
     */
    @GetMapping
    public ResponseEntity<PageResponse<BoardDto.Response>> getBoards(
            @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable, // sort 필드명 'createdDate'로 수정
            @RequestParam(required = false) String title, // 검색 조건: 제목
            @RequestParam(required = false) String writer, // 검색 조건: 작성자
            @RequestParam(required = false) Long categoryNo, // 검색 조건: 카테고리 번호
            @RequestParam String companyCode
    ) {
        // BoardService의 getBoardList 메서드에 검색 조건 파라미터 전달
        return ResponseEntity.ok(new PageResponse<>(boardService.getBoardList(pageable, title, writer, categoryNo, companyCode)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDto.Response> getBoard(@PathVariable("id") Long boardNo) {
        return ResponseEntity.ok(boardService.getBoardDetail(boardNo));
    }

    @PostMapping
    public ResponseEntity<Long> createBoard(@RequestBody BoardDto.Create boardCreate) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardCreate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable("id") Long boardNo) {
        boardService.deleteBoard(boardNo);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BoardDto.Response> updateBoard(
            @PathVariable("id") Long boardNo,
            @RequestBody BoardDto.Update updateBoard
    ) throws IOException {
        return ResponseEntity.ok(boardService.updateBoard(boardNo, updateBoard));
    }

    @PatchMapping("/{id}/views")
    public ResponseEntity<Void> increaseBoardViewCount(@PathVariable Long id) {
        boolean success = boardService.increaseViewCount(id);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/getnotice/{userId}")
    public ResponseEntity<List<BoardDto.Response>> getNotice(@PathVariable String userId) {
        List<BoardDto.Response> notices = boardService.getNoticeTop3(userId);
        return ResponseEntity.ok(notices);
    }
}