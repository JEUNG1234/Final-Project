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
@Table(name = "PROFILE_IMAGE")
public class ProfileImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FILE_NO")
    private Long fileNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

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
        this.uploadDate = LocalDate.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
        }
}