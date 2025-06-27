package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE_COMPLETE")
public class ChallengeComplete {

    //완료인증No
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPLETE_NO")
    private Long completeNo;

    //챌린지 No
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHALLENGE_NO", nullable = false)
    private Challenge challenge;

    //직원아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //완료인증 제목
    @Column(name = "COMPLETE_TITLE", nullable = false)
    private String completeTitle;

    //완료인증 내용
    @Column(name = "COMPLETE_CONTENT")
    private String completeContent;

    // 인증 이미지 URL 필드 추가
    @Column(name = "COMPLETE_IMAGE_URL")
    private String completeImageUrl;

    //작성날짜
    @Column(name = "CREATED_DATE")
    private LocalDate createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDate.now();
    }
}