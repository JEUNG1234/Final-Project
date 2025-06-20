package com.kh.sowm.dto;

import com.kh.sowm.entity.VoteContent;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

// 투표 기능과 관련된 데이터 전송 객체(DTO)들을 포함하는 클래스.
public class VoteDto {

    //투표 생성을 요청할 때 프론트엔드에서 백엔드로 보내는 데이터를 담는 DTO.
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String voteWriter; // 작성자 ID
        private String voteTitle; // 투표 제목
        private String voteType; // 투표 종류 (장기/단기)
        private LocalDate voteEndDate; // 종료 날짜
        private List<String> options; // 투표 항목 내용 리스트
    }

    //투표 목록 페이지에 필요한 최소한의 정보를 담아 응답하는 DTO.
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoteListResponse {
        private Long voteNo;
        private String voteTitle;
        private LocalDate voteEndDate;
        private String status;
        private int totalVotes;

        //Vote 엔티티를 VoteListResponse DTO로 변환.
        public static VoteListResponse toDto(Vote vote) {
            return VoteListResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteEndDate(vote.getVoteEndDate())
                    .status(vote.getStatus())
                    .totalVotes(vote.getTotalVotes())
                    .build();
        }
    }

    //투표 상세 페이지에 필요한 모든 정보를 담아 응답하는 DTO.
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoteDetailResponse {
        private Long voteNo;
        private String voteTitle;
        private String voteWriter;
        private LocalDate voteEndDate;
        private String status;
        private int totalVotes;
        private List<VoteContentResponse> options; // 투표 항목 목록

        // Vote 엔티티와 VoteContent 리스트를 VoteDetailResponse DTO로 변환.
        public static VoteDetailResponse toDto(Vote vote, List<VoteContent> voteContents) {
            return VoteDetailResponse.builder()
                    .voteNo(vote.getVoteNo())
                    .voteTitle(vote.getVoteTitle())
                    .voteWriter(vote.getVoteWriter())
                    .voteEndDate(vote.getVoteEndDate())
                    .status(vote.getStatus())
                    .totalVotes(vote.getTotalVotes())
                    .options(voteContents.stream()
                            .map(VoteContentResponse::toDto)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    //투표 상세 정보에 포함될 개별 투표 항목의 정보를 담는 DTO.
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoteContentResponse {
        private Long voteContentNo;
        private String voteContent;
        private Integer voteCount;

        //VoteContent 엔티티를 VoteContentResponse DTO로 변환.
        public static VoteContentResponse toDto(VoteContent voteContent) {
            return VoteContentResponse.builder()
                    .voteContentNo(voteContent.getVoteContentNo())
                    .voteContent(voteContent.getVoteContent())
                    .voteCount(voteContent.getVoteCount())
                    .build();
        }
    }
}