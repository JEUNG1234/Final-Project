package com.kh.sowm.entity;


import com.kh.sowm.enums.CommonEnums;


import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "BOARD")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_NO")
    private Long boardNo;


    @Column(name = "BOARD_TITLE", nullable = false, length = 50)
    private String boardTitle;

    @Column(name = "BOARD_CONTENT")
    @Lob
    private String boardContent;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;


    @Column(name = "UPDATED_DATE")
    private LocalDateTime updatedDate;


    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_NO", nullable = false)
    private Category category;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_WRITER")
    private User user;




}
