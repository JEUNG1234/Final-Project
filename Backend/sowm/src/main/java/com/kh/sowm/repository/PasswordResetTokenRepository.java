package com.kh.sowm.repository;

import com.kh.sowm.entity.PasswordResetToken;
import com.kh.sowm.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);


    void deleteByUser(User user);
}
