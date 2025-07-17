package com.kh.sowm.config;

import com.kh.sowm.auth.JwtTokenFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // HttpMethod import 추가
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/users/login",
                                "/api/users/signup",
                                "/api/users/enrolladmin",
                                "/api/company/enrollcompany",
                                "/api/users/check-user-id",
                                "/api/users/check-user-email",
                                "/api/password/reset-link",
                                "/api/password/reset-password"
                        ).permitAll()
                        //직원관리 기능들은 관리자(J2(만 가능하도록 설정
                        .requestMatchers("/api/admin/**").hasRole("J2")
                        .requestMatchers("/api/workation/create").hasRole("J2")
                        .requestMatchers("/api/workation/update").hasRole("J2")
                        .requestMatchers("/api/workation/subupdate").hasRole("J2")
                        .requestMatchers("/api/workation/returnupdate").hasRole("J2")
                        .requestMatchers("/api/workation/sublist").hasRole("J2")
                        .requestMatchers("/api/workation/fullsublist").hasRole("J2")
                        .requestMatchers("/api/vacationadmin/**").hasRole("J2")     
                        .requestMatchers(HttpMethod.POST,"/api/votes").hasRole("J2")
                        // 챌린지 생성은 관리자(J2)만 가능하도록 설정
                        .requestMatchers(HttpMethod.POST, "/api/challenges").hasRole("J2")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}