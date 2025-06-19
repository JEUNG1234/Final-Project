package com.kh.sowm.dto;

import com.kh.sowm.entity.Category;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {
    private Long categoryNo;
    private String categoryName;

    public static CategoryDto fromEntity(Category category) {
        return CategoryDto.builder()
                .categoryNo(category.getCategoryNo())
                .categoryName(category.getCategoryName())
                .build();
    }
}
