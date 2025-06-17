package com.kh.sowm.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Category {

    @Id
    @Column(name = "CATEGORY_NO")
    private Integer categoryNo;


    @Column(name = "CATEGORY_NAME", length = 30, nullable = false)
    private String categoryName;

}
