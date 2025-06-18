package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE")
public class Challenge {
    @Id
    @Column(name = "CHALLENGE_NO", length = 30, unique = true, nullable = false)
    private Long challengeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_NO", nullable = false)
    private Vote voteNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_CONTENT_N0")
    private VoteContent voteContentNo;

    @Column(name = "CHALLENGE_START_DATE")
    private LocalDate challengeStartDate;

    @Column(name = "CHALLENGE_END_DATE")
    private LocalDate challengeEndDate;

    @Column(name = "CHALLENGE_POINT")
    private int challengePoint;



}