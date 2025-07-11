package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VOTE_USER")
public class VoteUser {

    //투표자 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VOTE_DO_NO")
    private Long voteDoNo;

    //투표자 아이디(직원아이디)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    //투표 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_NO", nullable = false)
    private Vote vote;

    //투표 항목 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_CONTENT_NO", nullable = false)
    private VoteContent voteContent;

    //  투표 날짜 필드 추가 및 기본값 설정
    @Column(name = "VOTED_DATE", nullable = false, columnDefinition = "DATE DEFAULT (CURRENT_DATE)")
    private LocalDate votedDate;

    @PrePersist
    public void prePersist() {
        if (this.votedDate == null) {
            this.votedDate = LocalDate.now();
        }
    }
}