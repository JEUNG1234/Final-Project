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
    @Id
    private Long voteContentNo;
    private Long voteNo;
    private String voteContent;
    private Integer voteCount;
}