package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VOTE_CONTENT")
public class VoteContent {

    //투표 항목 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VOTE_CONTENT_NO")
    private Long voteContentNo;

    //투표 고유 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_NO", nullable = false)
    private Vote vote;

    //항목
    @Column(name = "VOTE_CONTENT", nullable = false, length = 200)
    private String voteContent;

    //항목에 대한 투표 수
    @Column(name = "VOTE_COUNT")
    private Integer voteCount;


    @PrePersist
    public void prePersist() {
        this.voteCount = 0;
    }
}
