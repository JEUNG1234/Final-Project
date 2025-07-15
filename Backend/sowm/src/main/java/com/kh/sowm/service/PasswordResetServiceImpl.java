package com.kh.sowm.service;

import com.kh.sowm.entity.PasswordResetToken;
import com.kh.sowm.entity.User;
import com.kh.sowm.repository.PasswordResetTokenRepository;
import com.kh.sowm.repository.UserRepository;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;


@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void sendResetLink(String userId, String email) {
        User user = userRepository.findByUserIdAndEmail(userId, email)
                .orElseThrow(() -> new IllegalArgumentException("해당 계정이 존재하지 않습니다."));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = tokenRepository.findByUser(user)
                .map(existingToken -> {
                    existingToken.setToken(token);
                    existingToken.setExpiryDate(LocalDateTime.now().plusMinutes(5));
                    return existingToken;
                })
                .orElse(
                        PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(LocalDateTime.now().plusMinutes(5))
                                .build()
                );

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        // ✅ HTML 이메일 전송
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[비밀번호 재설정] 버튼을 클릭하세요");

            String htmlContent =
                    "<div style=\"font-family: Arial, sans-serif; font-size: 14px;\">" +
                            "<p>안녕하세요,</p>" +
                            "<p>아래 버튼을 클릭하여 비밀번호를 재설정해주세요.</p>" +
                            "<a href=\"" + resetLink + "\" " +
                            "style=\"display: inline-block; padding: 10px 20px; background-color: #4d8eff; color: white; " +
                            "text-decoration: none; border-radius: 10px;\">비밀번호 재설정</a>" +
                            "<p style=\"margin-top: 10px;\">버튼이 작동하지 않으면 아래 링크를 복사해 브라우저에 붙여넣으세요:</p>" +
                            "<p><a href=\"" + resetLink + "\">" + resetLink + "</a></p>" +
                            "</div>";

            helper.setText(htmlContent, true); // HTML 형식으로 전송
            helper.setFrom(new InternetAddress("noreply@sowm.com", "SOWM")); // 보내는 사람 이름 & 주소

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("메일 전송 중 오류가 발생했습니다.", e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
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
