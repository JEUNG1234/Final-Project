package com.kh.sowm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Entity
@Table(name = "CATEGORY")
public class Category {
    @Id
    private Long categoryNo;
    private String categoryName;
}