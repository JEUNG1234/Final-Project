package com.kh.sowm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.sowm.entity.User;
import com.kh.sowm.entity.Vote;
import com.kh.sowm.entity.VoteContent;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class VoteDto {

    /**
     * 투표 생성을 위한 요청 DTO
     * 프론트엔드에서 userId를 포함하여 전송합니다.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String voteTitle;
        private String voteType; // "LONG" 또는 "SHORT"
        private LocalDate voteEndDate;
        private List<String> options;
        private String userId; // 요청을 보낸 사용자의 ID

        public Vote toVoteEntity(User writer) {
            return Vote.builder()
                    .voteTitle(this.voteTitle)
                    .voteType(Vote.Type.valueOf(this.voteType.toUpperCase()))
                    .voteEndDate(this.voteEndDate)
                    .writer(writer)
                    .build();
        }
    }

    /**
     * 투표하기 요청 DTO
     * 프론트엔드에서 userId를 포함하여 전송합니다.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CastRequest {
        private Long voteContentNo; // 사용자가 선택한 항목의 ID
        private String userId;      // 투표를 하는 사용자의 ID
    }

    /**
     * 투표 목록 조회를 위한 응답 DTO
     */
    @Getter
    @Builder
    public static class ListResponse {
        private Long voteNo;
        private String voteTitle;
        private String voteType;
        private LocalDate voteEndDate;
        private int totalVotes;

        @JsonProperty("isVoted") // ✅ 이 어노테이션을 추가하여 JSON 변환 시 반드시 포함하도록 지정
        private boolean isVoted; // 현재 사용자가 투표했는지 여부

        private List<OptionResponse> options;

        public static ListResponse fromEntity(Vote vote, boolean isVoted) {
            return ListResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteType(vote.getVoteType().name())
                    .voteEndDate(vote.getVoteEndDate())
                    .totalVotes(vote.getTotalVotes())
                    .isVoted(isVoted)
                    .options(vote.getVoteContents().stream()
                            .map(OptionResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    /**
     * 투표 결과 상세 조회를 위한 응답 DTO
     */
    @Getter
    @Builder
    public static class DetailResponse {
        private Long voteNo;
        private String voteTitle;
        private String voteType;
        private LocalDate voteEndDate;
        private int totalVotes;
        private List<OptionResponse> options;

        public static DetailResponse fromEntity(Vote vote) {
            return DetailResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteType(vote.getVoteType().name())
                    .voteEndDate(vote.getVoteEndDate())
                    .totalVotes(vote.getTotalVotes())
                    .options(vote.getVoteContents().stream()
                            .map(OptionResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    /**
     * 투표 항목 정보를 담는 공통 응답 DTO
     */
    @Getter
    @Builder
    public static class OptionResponse {
        private Long voteContentNo;
        private String voteContent;
        private int voteCount;

        public static OptionResponse fromEntity(VoteContent voteContent) {
            return OptionResponse.builder()
                    .voteContentNo(voteContent.getVoteContentNo())
                    .voteContent(voteContent.getVoteContent())
                    .voteCount(voteContent.getVoteCount())
                    .build();
        }
    }
}