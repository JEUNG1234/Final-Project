package com.kh.sowm.repository;

import com.kh.sowm.entity.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Category> findAll() {
        String jpql = "SELECT c FROM Category c";
        return em.createQuery(jpql, Category.class).getResultList();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return Optional.ofNullable(em.find(Category.class, id));
    }
}
