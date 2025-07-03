package com.kh.sowm.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Component
public class JwtTokenProvider {

    private final String secretKey;
    private final int expiration;
    private final Key SECRET_KEY;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, @Value("${jwt.expiration}") int expiration) {
        this.secretKey = secretKey;
        this.expiration = expiration;
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }


    public String createToken(String userId, String jobCode) {
        /**
         * claims 는 JWT 에서 Payload 부분의 데이터를 담는 객체 (jwt 가 전달하고자 하는 정보 단위)
         * payload : jwt에서 데이터가 담기는 부분
         */
        Claims claims = Jwts.claims().setSubject(userId);
        claims.put("jobCode", jobCode);

        Date now = new Date();
        Date expire = new Date(now.getTime() + (expiration * 1000L * 60));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expire)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserId() {
        //현재 요청의 JWT 토큰에서 아이디 추출
        //JwtTokenFilter에서 토큰 검증 후에 호출
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}