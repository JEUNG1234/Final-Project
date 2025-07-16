package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.Formula;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE")
public class Challenge {
    @Id
    @Column(name = "CHALLENGE_NO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeNo;

    @Column(name = "CHALLENGE_TITLE", nullable = false)
    private String challengeTitle;

    @Lob
    @Column(name = "CHALLENGE_CONTENT")
    private String challengeContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_NO", nullable = false)
    private Vote vote;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_CONTENT_NO")
    private VoteContent voteContent;

    @Builder.Default // 추가
    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChallengeImage> challengeImages = new ArrayList<>();

    @Column(name = "CHALLENGE_START_DATE")
    private LocalDate challengeStartDate;

    @Column(name = "CHALLENGE_END_DATE")
    private LocalDate challengeEndDate;

    @Column(name = "CHALLENGE_POINT")
    private int challengePoint;

    @Builder.Default // 추가
    @OneToMany(mappedBy = "challenge", fetch = FetchType.LAZY)
    private List<ChallengeComplete> completions = new ArrayList<>();

    @Formula("(SELECT COUNT(DISTINCT cc.USER_ID) FROM CHALLENGE_COMPLETE cc WHERE cc.CHALLENGE_NO = CHALLENGE_NO)")
    private int participantCount;

    @Column(name = "POINTS_AWARDED", nullable = false)
    private boolean pointsAwarded;

    public void markAsPointsAwarded() {
        this.pointsAwarded = true;
    }

    public void addChallengeImage(ChallengeImage challengeImage) {
        this.challengeImages.add(challengeImage);
        challengeImage.setChallenge(this);
    }
}