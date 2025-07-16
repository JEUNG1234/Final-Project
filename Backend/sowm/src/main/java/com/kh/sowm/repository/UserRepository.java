package com.kh.sowm.repository;

import com.kh.sowm.dto.UserDto;
import com.kh.sowm.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    Optional<User> findByUserId(String userId);

    void save(User user);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    List<User> findAllEmployees(UserDto.EmployeeSearchCondition searchCondition);

    List<User> findNotApproval(UserDto.EmployeeSearchCondition searchCondition);

    String deleteUser(User user);

    String updateUserInfo(User user);


    Optional<User> findByUserIdAndEmail(String userId, String email);

    Optional<User> findById(Long id);

    void updatePassword(String userId, String encodedPassword);

    long countByJobCode(String jobCode);
}