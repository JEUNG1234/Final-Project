package com.kh.sowm.dto;

import com.kh.sowm.entity.BoardImage;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardImageDto {
    private String originalName;
    private String changedName; // ex) uuid.jpg
    private String path; // CloudFront URL or S3 Key
    private Long size;

    public static BoardImageDto fromEntity(BoardImage image) {
        return BoardImageDto.builder()
                .originalName(image.getOriginalName())
                .changedName(image.getChangedName())
                .path(image.getPath())
                .size(image.getSize())
                .build();
    }
}
