package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.Formula; // Formula 어노테이션 임포트

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE")
public class Challenge {
    //챌린지No
    @Id
    @Column(name = "CHALLENGE_NO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeNo;

    //챌린지 제목
    @Column(name = "CHALLENGE_TITLE", nullable = false)
    private String challengeTitle;

    //직원아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //투표번호
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_NO", nullable = false)
    private Vote vote;

    //투표항목번호
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_CONTENT_NO")
    private VoteContent voteContent;

    //  챌린지 대표 이미지 URL
    @Column(name = "CHALLENGE_IMAGE_URL")
    private String challengeImageUrl;

    //챌린지시작날
    @Column(name = "CHALLENGE_START_DATE")
    private LocalDate challengeStartDate;

    //챌린지 종료날
    @Column(name = "CHALLENGE_END_DATE")
    private LocalDate challengeEndDate;

    //포인트
    @Column(name = "CHALLENGE_POINT")
    private int challengePoint;

    // 참여자 수를 계산하는 Formula 필드 추가
    @Formula("(select count(*) from challenge_complete cc where cc.challenge_no = challenge_no)")
    private int participantCount;
}