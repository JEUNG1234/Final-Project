package com.kh.sowm.repository;

import com.kh.sowm.dto.BoardImageDto;
import com.kh.sowm.entity.BoardImage;

public interface BoardImageRepository {
    void save(BoardImage image);

    void updateImage(BoardImageDto image);

    void deleteByboardNo(Long BoardNo);
}