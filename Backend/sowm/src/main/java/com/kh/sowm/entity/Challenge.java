package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE")
public class Challenge {
    @Id
    private Long challengeNo;
    private String userId;
    private Long voteNo;
    private Long voteContentNo;
    private LocalDate challengeStartDate;
    private LocalDate challengeEndDate;
    private int challengePoint;
    private String field;
}