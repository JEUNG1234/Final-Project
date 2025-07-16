package com.kh.sowm.repository;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;
import com.kh.sowm.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    @Override
    public String deleteUser(User user) {
        int result =  em.createQuery("UPDATE User u SET u.status = 'D' WHERE u.userId = :id")
                .setParameter("id", user.getUserId())
                .executeUpdate();

        return result > 0 ? "삭제 성공" : "삭제 실패";
    }

    @Override
    public String updateUserInfo(User user) {
        int result = em.createQuery("UPDATE User u SET u.userPwd = :newPwd, u.userName = :newName WHERE u.userId = :id")
                .setParameter("newPwd", user.getUserPwd())
                .setParameter("newName", user.getUserName())
                .setParameter("id", user.getUserId())
                .executeUpdate();

        if (result > 0) {
            return "회원정보 수정 완료";
        } else {
            return "회원정보 수정 실패";
        }
    }

    // 아이디로 유저 찾기
    @Override
    public Optional<User> findByUserId(String userId) {
        return Optional.ofNullable(em.find(User.class, userId));
    }



    // 아이디 + 이메일로 유저 찾기
    @Override
    public Optional<User> findByUserIdAndEmail(String userId, String email) {
        String jpql = "SELECT u FROM User u WHERE u.userId = :userId AND u.email = :email";
        try {
            User user = em.createQuery(jpql, User.class)
                    .setParameter("userId", userId)
                    .setParameter("email", email)
                    .getSingleResult();
            return Optional.of(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // ID(Long)로 찾기 (토큰 처리용)
    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(em.find(User.class, id));
    }

    // 비밀번호 변경
    @Override
    public void updatePassword(String userId, String encodedPassword) {
        em.createQuery("UPDATE User u SET u.userPwd = :pwd WHERE u.id = :id")
                .setParameter("pwd", encodedPassword)
                .setParameter("id", userId)
                .executeUpdate();
    }
}
