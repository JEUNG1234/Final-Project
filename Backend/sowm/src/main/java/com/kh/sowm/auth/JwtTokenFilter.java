package com.kh.sowm.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;
import javax.security.sasl.AuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtTokenFilter extends GenericFilter {

    // JWT 를 생성하거나 검증할 때 사용하는 진짜 KEY 객체
    private final Key SECRET_KEY;
    // application.yml 에 설정된 jwt 시크릿 키 주입
    private final String secretKey;

    public JwtTokenFilter(@Value("${jwt.secret}") String secretKey) {
        // application.yml 에서 jwt.secret 값을 주입받음
        this.secretKey = secretKey;
        // 주입 받은 문자열을 HMAC-SHA 알고리즘에 사용할 SecretKey 객체로 변환 (UTF-8 인코딩 사용)
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 서블릿 필터에서 필수로 오버라이드 하는 메소드로, 클라이언트 요청이 디스패처 서블릿에 도달하기 전/후에 가로채어
     * 로직을 수행시킴.
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        /**
         * Http 요청,응답 관련 기능을 사용하기 위해 위해 기존 Servlet 에서 HttpServlet 으로 다운캐스팅 시킴
         * 처음부터 매개변수에 HttpServletRequest, Response 로 하면 되지 않느냐? 라고 생각했는데
         * doFilter() 메소드는 서플릿 필터 인터페이스에서 정의된 표준 메소드이기 때문에 함부로 매개변수 타입을 바꿀 수 없음.
         */
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String token = httpRequest.getHeader("Authorization");
        
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                throw new AuthenticationException("Beare 형식이 아닙니다.");
            }
            // Bearer 뒤에 담긴 실제 jwt 문자열 추출
            String jwtToken = token.substring(7);
            
            // jwt 토큰 파싱하고 서명 검증
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY) // key 객체로 검증
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody(); // Claims(palyoad) 반환

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + claims.get("role")));

            // jwt 의 subject 값을 username 으로 사용하겠다.
            UserDetails userDetails = new User(claims.getSubject(), "", authorities);
            // 인증 객체 생성(사용자 정보, 인증수단, 권한리스트)
            Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, jwtToken, userDetails.getAuthorities());

            /**
             * SecurityContextHolder : 현재 스레드 요청에 대한 보안 정보를 저장하는 보안 컨텍스트의 저장소
             * 현재 요청에 대한 인증 정보 등록, 이 요청을 인증된 것으로 간주하겠다.
             */
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();

            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("invalid token");
        }
    }
}
