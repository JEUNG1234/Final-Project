package com.kh.sowm.repository;

import com.kh.sowm.entity.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    List<Category> findAll();
    Optional<Category> findById(Long id);
}
