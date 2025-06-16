package com.kh.sowm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "BOARD")
public class Board {
    @Id
    private Long boardNo;
    private String boardTitle;
    private String boardContent;
    private LocalDate createdDate;
    private LocalDate updatedDate;
    private String status;
    private Long categoryNo;

    @Column(name = "BOARD-WRITER")
    private String boardWriter;
}