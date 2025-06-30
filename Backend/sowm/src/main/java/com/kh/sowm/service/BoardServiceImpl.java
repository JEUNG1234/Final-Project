// BoardServiceImpl.java
package com.kh.sowm.service;

import com.kh.sowm.dto.BoardDto;
import com.kh.sowm.dto.BoardDto.Response;
import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.Board;
import com.kh.sowm.entity.Category;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import com.kh.sowm.repository.BoardRepository;
import com.kh.sowm.repository.CategoryRepository;
import com.kh.sowm.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository; // User 엔티티 조회용
    private final CategoryRepository categoryRepository; // Category 엔티티 조회용


    @Override
    // 검색 조건 추가: title, writer, categoryNo
    public Page<BoardDto.Response> getBoardList(Pageable pageable, String title, String writer, Long categoryNo, String companyCode) {
        // BoardRepositoryImpl의 findBoardsByFilters 메서드 호출
        Page<Board> page = boardRepository.findBoardsByFilters(pageable, title, writer, categoryNo, companyCode, CommonEnums.Status.Y);
        return page.map(BoardDto.Response::fromEntity);
    }

    @Transactional
    @Override
    public BoardDto.Response getBoardDetail(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        return BoardDto.Response.fromEntity(board);
    }

    @Transactional
    @Override
    public Long createBoard(BoardDto.Create dto) throws IOException {
        User user = userRepository.findByUserId(dto.getUserId()) // userRepository는 JpaRepository를 사용한다고 가정
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Category category = categoryRepository.findById(dto.getCategoryNo()) // categoryRepository는 JpaRepository를 사용한다고 가정
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));

        Board board = dto.toEntity(category, user);
        return boardRepository.save(board); // BoardRepositoryImpl의 save 메서드 호출
    }

    @Transactional
    @Override
    public void deleteBoard(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        board.deletedBoard(); // 상태를 'N'으로 변경
        boardRepository.save(board);
    }

    @Transactional
    @Override
    public BoardDto.Response updateBoard(Long boardNo, BoardDto.Update dto) throws IOException {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        board.changeTitle(dto.getBoardTitle());
        board.changeContent(dto.getBoardContent());

        // categoryNo로 category 조회 및 변경
        if (dto.getCategoryNo() != null) {
            Category category = categoryRepository.findById(dto.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("카테고리가 존재하지 않습니다"));
            board.setCategory(category);
        }
        // save 호출하여 변경 사항을 영속성 컨텍스트에 반영하고 DB에 동기화
        boardRepository.save(board);
        return BoardDto.Response.fromEntity(board);
    }

    @Override
    @Transactional
    public boolean increaseViewCount(Long boardId) {
        int updatedRows = boardRepository.increaseViewCount(boardId);
        return updatedRows > 0;
    }

    @Override
    public List<Response> getNoticeTop3(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("계정 정보가 존재하지 않습니다."));

        String companyCode = user.getCompanyCode();

        List<Board> boards = boardRepository.getNoticeTop3(companyCode);
        return boards.stream().map(BoardDto.Response::fromEntity).collect(Collectors.toList());
    }

}