package com.kh.sowm.repository;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    @Override
    public List<User> findAllEmployees(UserDto.EmployeeSearchCondition searchCondition) {
        String jpql = "SELECT u FROM User u WHERE u.companyCode = :companyCode AND u.status = :status";
        return em.createQuery(jpql, User.class)
                .setParameter("companyCode", searchCondition.getCompanyCode())
                .setParameter("status", CommonEnums.Status.Y)// 예: 재직자만 조회
                .getResultList();
    }

    @Override
    public List<User> findNotApproval(UserDto.EmployeeSearchCondition searchCondition) {
        String jpql = "SELECT u FROM User u WHERE u.companyCode = :companyCode AND u.status = :status";
        return em.createQuery(jpql, User.class)
                .setParameter("companyCode", searchCondition.getCompanyCode())
                .setParameter("status", CommonEnums.Status.N)
//                .setParameter("jobCode", searchCondition.getJobCode())
                .getResultList();
    }

    // 아이디로 유저 찾기
    @Override
    public Optional<User> findByUserId(String userId) {
        return Optional.ofNullable(em.find(User.class, userId));
    }

   
}
