package com.kh.sowm.dto;


import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class MedicalCheckDto {


    /**
     * 클라이언트에서 서버로 전송하는 심리검사 요청 데이터 DTO
     * - 사용자의 ID와 각 질문에 대한 점수 리스트를 포함
     * - 서버에서 AI 분석 및 점수 집계 시 사용
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class MentalQuestionRequestDto {
        private String userId;
        private List<QuestionScore> questionScores;
        private String guideMessage;

        /**
         * 질문과 점수를 쌍으로 묶은 내부 DTO
         */
        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class QuestionScore{
            private String question;
            private int score;
            private String guideMessage;
        }
    }

    /**
     * 서버에서 클라이언트로 응답하는 심리검사 결과 DTO
     * - 총점과 AI가 생성한 맞춤형 건강 가이드 메시지를 포함
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class MentalQuestionDto {
        private int totalScore;
        private String guideMessage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MentalResultDto {
        private int totalScore;
        private String guideMessage;
        private List<QuestionScoreDto> questionScores;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class QuestionScoreDto {
            private Long questionNo;
            private String questionText;
            private int score;
        }
    }

    /**
     * 클라이언트에서 서버로 전송하는 심리검사 요청 데이터 DTO
     * - 사용자의 ID와 각 질문에 대한 점수 리스트를 포함
     * - 서버에서 AI 분석 및 점수 집계 시 사용
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class PhysicalQuestionRequestDto {
        private String userId;
        private List<QuestionScore> questionScores;
        private String guideMessage;

        /**
         * 질문과 점수를 쌍으로 묶은 내부 DTO
         */
        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class QuestionScore {
            private String question;
            private int score;
            private String guideMessage;
        }
    }

    /**
     * 서버에서 클라이언트로 응답하는 심리검사 결과 DTO
     * - 총점과 AI가 생성한 맞춤형 건강 가이드 메시지를 포함
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class PhysicalQuestionDto {
        private int totalScore;
        private String guideMessage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PhysicalResultDto {
        private int totalScore;
        private String guideMessage;
        private List<QuestionScoreDto> questionScores;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class QuestionScoreDto {
            private Long questionNo;
            private String questionText;
            private int score;
        }
    }
}
