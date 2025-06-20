package com.kh.sowm.entity;


import com.kh.sowm.enums.CommonEnums;


import jakarta.persistence.*;


import lombok.*;

import java.time.LocalDate;
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

    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDate createdDate;


    @Column(name = "UPDATED_DATE", nullable = false)
    private LocalDate updatedDate;

    @Column(length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_NO", nullable = false)
    private Category category;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_WRITER")
    private User user;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardImage> boardImages = new ArrayList<>();

    @Column(name = "VIEWS", nullable = false)
    private int views;

    public void increaseViews() {
        this.views++;
    }

    public void changeContent(String boardContent) {
        if(boardContent != null && !boardContent.isEmpty()) {
            this.boardContent = boardContent;
        }
    }

    public void changeTitle(String boardTitle) {
        if(boardTitle != null && !boardTitle.isEmpty()) {
            this.boardTitle = boardTitle;
        }
    }

    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            this.createdDate = LocalDate.now();
        }
        if (updatedDate == null) {
            this.updatedDate = LocalDate.now();
        }
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
            this.views = 0;
        }

    }

    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDate.now(); // 👈 업데이트 시점 자동 반영
    }



}
