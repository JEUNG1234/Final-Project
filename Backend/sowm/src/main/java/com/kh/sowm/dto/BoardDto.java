package com.kh.sowm.dto;

import com.kh.sowm.entity.Board;
import com.kh.sowm.entity.Category;
import com.kh.sowm.entity.User;
import lombok.*;

import java.time.LocalDate;

public class BoardDto {

    @Getter
    @AllArgsConstructor
    public static class Create {
        private String boardTitle;
        private String boardContent;
        private Long categoryNo;
        private String userId;

        public Board toEntity(Category category, User user) {
            return Board.builder()
                    .boardTitle(this.boardTitle)
                    .boardContent(this.boardContent)
                    .category(category)
                    .user(user)
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    public static class Update {
        private String boardTitle;
        private String boardContent;

        // ✅ [추가] 카테고리 이름
        private Long categoryNo;

        // ⛔ 더 이상 필요 없음: toEntity() 제거
        // 수정은 기존 엔티티 필드 수정 방식으로 처리
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long boardNo;
        private String boardTitle;
        private String boardContent;
        private LocalDate createdDate;
        private LocalDate updatedDate;
        private String categoryName;
        private String userId;
        private String userName;
        private int views;

        public static Response fromEntity(Board board) {
            return Response.builder()
                    .boardNo(board.getBoardNo())
                    .boardTitle(board.getBoardTitle())
                    .boardContent(board.getBoardContent())
                    .createdDate(board.getCreatedDate())
                    .updatedDate(board.getUpdatedDate())
                    .categoryName(board.getCategory().getCategoryName())
                    .userId(board.getUser().getUserId())
                    .userName(board.getUser().getUserName())
                    .views(board.getViews())
                    .build();
        }
    }
}
