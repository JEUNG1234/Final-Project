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
@Table(name = "WORKATION_IMAGE")
public class WorkationImage {

    //파일 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FILE_NO")
    private Long fileNo;

    //워케이션 고유 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKATION_NO", nullable = false)
    private Board workation;

    //원본 파일명
    @Column(name = "ORIGINAL_NAME", nullable = false, length = 255)
    private String originalName;

    //저장될 파일명
    @Column(name = "CHANGED_NAME", nullable = false, length = 255)
    private String changedName;

    //경로
    @Column(name = "PATH", nullable = false, length = 255)
    private String path;

    //파일 크기
    @Column(name = "SIZE", nullable = false)
    private Long size;

    //업로드 날짜
    @Column(name = "UPLOAD_DATE", nullable = false)
    private LocalDate uploadDate;

    //상태
    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    //워케이션 이미지 종류
    @Column(length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private Tab tab;


    //PLACE = 장소 이미지, FACILTY= 시설이미지, PRECAUTIONS=유의사항 이미지
    public enum Tab{
        PLACE, FACILTY, PRECAUTIONS

    }

    @PrePersist
    public void prePersist() {
        this.uploadDate = LocalDate.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }

    }
}