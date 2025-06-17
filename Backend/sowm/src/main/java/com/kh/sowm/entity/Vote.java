package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VOTE")
public class Vote {

    //투표 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VOTE_NO")
    private Long voteNo;

    //투표 작성자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VOTE_WRITER", nullable = false)
    private User writer;

    //투표 제목
    @Column(name = "VOTE_TITLE", nullable = false, length = 100)
    private String voteTitle;

    //총 투표 수
    @Column(name = "TOTAL_VOTES", nullable = false)
    private int totalVotes;

    //투표 유형(장기, 단기)
    @Column(name = "VOTE_TYPE",nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Type voteType;

    //시작날짜 AND 생성날짜
    @Column(name = "VOTE_CREATED_DATE", nullable = false)
    private LocalDate voteCreatedDate;

    //투표 종료 날짜
    @Column(name = "VOTE_END_DATE", nullable = false)
    private LocalDate voteEndDate;

    @OneToMany(mappedBy = "voteNo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteContent> voteContents = new ArrayList<>();

    //진행상태 값
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @PrePersist
    public void prePersist() {
        this.voteCreatedDate = LocalDate.now();
        this.voteType = Type.SHORT;
        this.totalVotes = 0;
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }

    public enum Type{
        SHORT, LONG;
    }



}