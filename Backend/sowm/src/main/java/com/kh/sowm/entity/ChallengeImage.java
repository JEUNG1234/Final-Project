package com.kh.sowm.entity;

import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CHALLENGE_IMAGE")
public class ChallengeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FILE_NO")
    private Long fileNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHALLENGE_NO") // 챌린지와 연결
    private Challenge challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPLETE_NO") // 챌린지 인증과 연결 (Nullable)
    private ChallengeComplete challengeComplete;

    @Column(name = "ORIGINAL_NAME", nullable = false, length = 255)
    private String originalName;

    @Column(name = "CHANGED_NAME", nullable = false, length = 255)
    private String changedName;

    @Column(name = "PATH", nullable = false, length = 255)
    private String path;

    @Column(name = "SIZE", nullable = false)
    private Long size;

    @Column(name = "UPLOAD_DATE", nullable = false)
    private LocalDate uploadDate;

    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @PrePersist
    public void prePersist() {
        if (this.uploadDate == null) {
            this.uploadDate = LocalDate.now();
        }
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }

    }

}