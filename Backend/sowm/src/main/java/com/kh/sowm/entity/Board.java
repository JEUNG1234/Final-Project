package com.kh.sowm.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Board {

    @Id
    private Long boardNo;


    private String boardTitle;


    private String boardContent;
}
