package com.kh.sowm.repository;

import com.kh.sowm.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<User> findByUserId(String userId) {
        return Optional.ofNullable(em.find(User.class, userId));
    }
}
