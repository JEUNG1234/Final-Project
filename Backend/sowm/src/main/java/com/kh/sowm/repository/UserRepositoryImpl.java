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

    // 계정 저장
    @Override
    public void save(User user) {
        em.persist(user);
    }

    // 아이디 중복검사
    @Override
    public boolean existsByUserId(String userId) {
        String jpql = "SELECT COUNT(u) FROM User u WHERE u.userId = :userId";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        String jpql = "SELECT COUNT(u) FROM User u WHERE u.email = :email";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("email", email)
                .getSingleResult();
        return count > 0;
    }

    // 아이디로 유저 찾기
    @Override
    public Optional<User> findByUserId(String userId) {
        return Optional.ofNullable(em.find(User.class, userId));
    }

   
}
