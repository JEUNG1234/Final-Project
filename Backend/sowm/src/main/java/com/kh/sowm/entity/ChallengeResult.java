package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE_RESULT")
public class ChallengeResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESULT_NO")
    private Long resultNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHALLENGE_NO", nullable = false)
    private Challenge challenge;

    @Column(name = "IS_SUCCESS", nullable = false)
    private boolean success;

    @Column(name = "FINAL_ACHIEVEMENT_RATE", nullable = false)
    private int finalAchievementRate;
}