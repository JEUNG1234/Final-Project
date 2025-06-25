package com.kh.sowm.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

public class ChallengeDto {

    @Getter
    @NoArgsConstructor
    public static class CreateRequest {
        private String userId; // 챌린지를 생성한 관리자 ID
        private Long voteNo; // 원본 투표 ID
        private Long voteContentNo; // 1등으로 선정된 투표 항목 ID

        private String challengeTitle;
        private LocalDate challengeStartDate;
        private LocalDate challengeEndDate;
        private int challengePoint;
    }
}