package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE_COMPLETE")
public class ChallengeComplete {
    @Id
    private Long completeNo;
    private Long challengeNo;
    private String userId;
    private String completeTitle;
    private String completeContent;
}