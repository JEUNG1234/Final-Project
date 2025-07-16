package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE_COMPLETE")
public class ChallengeComplete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPLETE_NO")
    private Long completeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHALLENGE_NO", nullable = false)
    private Challenge challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "COMPLETE_TITLE", nullable = false)
    private String completeTitle;

    @Column(name = "COMPLETE_CONTENT")
    private String completeContent;

    @Builder.Default // 추가
    @OneToMany(mappedBy = "challengeComplete", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChallengeImage> challengeImages = new ArrayList<>();

    @Column(name = "CREATED_DATE")
    private LocalDate createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDate.now();
    }

    public void addChallengeImage(ChallengeImage challengeImage) {
        this.challengeImages.add(challengeImage);
        challengeImage.setChallengeComplete(this);
    }
}