package com.kh.sowm.service;

import com.kh.sowm.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> findAllCategories();
    CategoryDto findCategoryById(Long categoryNo);
}
