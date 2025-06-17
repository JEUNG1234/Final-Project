package com.kh.sowm.repository;

import com.kh.sowm.entity.User;

import java.util.Optional;

public interface UserRepository {

    Optional<User> findByUserId(String userId);

    void save(User user);
}
