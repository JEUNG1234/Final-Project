package com.kh.sowm.service;

import com.kh.sowm.entity.PasswordResetToken;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.PasswordResetTokenRepository;
import com.kh.sowm.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional  // ✅ 트랜잭션 추가!
    public void sendResetLink(String userId, String email) {
        User user = userRepository.findByUserIdAndEmail(userId, email)
                .orElseThrow(() -> new IllegalArgumentException("해당 계정이 존재하지 않습니다."));


        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = tokenRepository.findByUser(user)
                .map(existingToken -> {
                    // 기존 토큰 갱신
                    existingToken.setToken(token);
                    existingToken.setExpiryDate(LocalDateTime.now().plusMinutes(5));
                    return existingToken;
                })
                .orElse(
                        // 새 토큰 생성
                        PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(LocalDateTime.now().plusMinutes(5))
                                .build()
                );

        tokenRepository.save(resetToken);  // insert or update 처리됨

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[비밀번호 재설정] 링크를 확인하세요");
        message.setText("아래 링크를 클릭하여 비밀번호를 재설정해주세요.\n\n" + resetLink);
        mailSender.send(message);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("토큰이 만료되었습니다.");
        }

        User user = resetToken.getUser();
        String userId = user.getUserId(); // 또는 user.getUserId()에 맞게 조정

//        String encodedPassword = passwordEncoder.encode(newPassword); // spring에서 제공하는 비밀번호 암호화 기능
        userRepository.updatePassword(userId, newPassword); // 🔁 핵심 변경

        tokenRepository.delete(resetToken); // 토큰 재사용 방지
    }
}
