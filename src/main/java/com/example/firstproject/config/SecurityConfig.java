package com.example.firstproject.config;


import com.example.firstproject.config.jwt.JwtAuthenticationFilter;
import com.example.firstproject.config.jwt.JwtAuthorizationFilter;
import com.example.firstproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

// 로그인이 완료되면 순서가
//1. code 받기(인증)
//2. code를 통해서 access token 받고, access token을 받으면 우리의 security server가 google에 login한 사용자의 정보에 접근할 수 있는 권한이 생겼다는 뜻(권한)
//3. 권한을 통해 사용자 profile 정보를 가져와서
//4-1. 그 정보를 토대로 회원가입을 자동으로 시키기도 하고
//4-2. 추가 정보를 받기도 함. 예를 들어 google에서 email, 전화번호, 이름, id를 줬는데 쇼핑몰에서 집 주소도 필요한 경우 정보를 받아야함

@Configuration
@EnableWebSecurity // 시큐리티 활성화 -> 기본 스프링 필터체인에 등록
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final MemberRepository memberRepository;

    private final CorsConfig corsConfig;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .addFilter(corsConfig.corsFilter())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .csrf().disable()

                .addFilter(new JwtAuthenticationFilter(authenticationManager()))
                .addFilter(new JwtAuthorizationFilter(authenticationManager(), memberRepository))
                .authorizeRequests()
                //login 한 사람만 들어올 수 있음, authenticated()인증만 되면 들어갈 수 있는 주소
                .antMatchers("/api/user")
                .access("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
                //admin만 가능
                .antMatchers("/api/admin")
                .access("hasRole('ROLE_ADMIN')")
                .anyRequest().permitAll();
    }
}