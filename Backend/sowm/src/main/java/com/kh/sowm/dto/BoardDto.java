package com.kh.sowm.dto;

import com.kh.sowm.entity.Board;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardDto {

    private Long boardNo;
    private String boardTitle;
    private String boardContent;
    private LocalDate createdDate;
    private String categoryName;
    private String userId;
    private String userName;

    public static BoardDto fromEntity(Board board) {
        return BoardDto.builder()
                .boardNo(board.getBoardNo())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .createdDate(board.getCreatedDate())
                .categoryName(board.getCategory().getCategoryName())
                .userId(board.getUser().getUserId())
                .userName(board.getUser().getUserName())
                .build();
    }
}
