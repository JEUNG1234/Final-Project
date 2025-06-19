package com.kh.sowm.service;

import com.kh.sowm.dto.CategoryDto;
import com.kh.sowm.entity.Category;
import com.kh.sowm.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDto> findAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto findCategoryById(Long categoryNo) {
        Category category = categoryRepository.findById(categoryNo)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return CategoryDto.fromEntity(category);
    }
}
