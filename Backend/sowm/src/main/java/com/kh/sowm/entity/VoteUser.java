package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VOTE_USER")
public class VoteUser {
    @Id
    private String voteDoNo;
    private String userId;
    private Long voteContentNo;
    private Long voteNo;
}