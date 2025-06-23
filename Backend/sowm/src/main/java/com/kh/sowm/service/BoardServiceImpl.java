package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.entity.Board;
import com.kh.sowm.entity.Category;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.BoardRepository;
import com.kh.sowm.repository.CategoryRepository;
import com.kh.sowm.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;


    @Override
    public Page<BoardDto.Response> getBoardList(Pageable pageable) {
        /*
            getContent() 실제 데이터 리스트 반환
            getTotalPages() 전체 페이지 개수
            getTotalelements() 전체 데이터 수
            getSize() 페이지당 데이터 수
            ...
         */
        Page<Board> page = boardRepository.findByStatus(CommonEnums.Status.Y, pageable);

        return page.map(BoardDto.Response::fromEntity);
    }

    @Transactional
    @Override
    public BoardDto.Response getBoardDetail(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        board.increaseViews();
        return BoardDto.Response.fromEntity(board);
    }

    @Transactional
    @Override
    public Long createBoard(BoardDto.Create dto) throws IOException {
        User user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Category category = categoryRepository.findById(dto.getCategoryNo())
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));



        Board board = dto.toEntity(category, user);


        boardRepository.save(board);
        return board.getBoardNo();
    }

    @Transactional
    @Override
    public void deleteBoard(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));


        boardRepository.delete(board);
    }

    @Transactional
    @Override
    public BoardDto.Response updateBoard(Long boardNo, BoardDto.Update dto) throws IOException {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        board.changeTitle(dto.getBoardTitle());
        board.changeContent(dto.getBoardContent());

        // ✅ categoryName으로 category 조회 및 변경
        if (dto.getCategoryNo() != null) {
            Category category = categoryRepository.findById(dto.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("카테고리가 존재하지 않습니다"));
            board.setCategory(category);
        }

        return BoardDto.Response.fromEntity(board);
    }
}
