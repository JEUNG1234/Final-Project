package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "VOTE")
public class Vote {
    @Id
    private Long voteNo;
    private String voteWriter;
    private String voteTitle;
    private int totalVotes;
    private String voteType;
    private LocalDate voteCreatedDate;
    private LocalDate voteEndDate;
    private String status;
}