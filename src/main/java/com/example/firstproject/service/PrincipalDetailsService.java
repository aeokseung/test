package com.example.firstproject.service;

import com.example.firstproject.config.auth.PrincipalDetails;
import com.example.firstproject.entity.Member;
import com.example.firstproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//SecurityConfig에서 loginProcessingUrl("/login");
//login 요청이 오면 자동으로 UserDetailsService 형식으로 IoC 되어있는 loadUserByUsername method가 실행(규칙임)
//loginForm.html에서 name="username"으로 적었으므로 스프링이 PrincipalDetailsService를 찾아서 loadUserByUsername을 호출,
// 그때 넘어온 username 매개변수를 가지고 옴, username을 찾음
@Log4j2
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    //Security Session내부에 Authentication이, Authentication 내부에 UserDetails(PrincipalDetails)가 들어감
    //함수 종료시 @AuthenticationPrincipal이 만들어짐
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("PrincipalDetailsService : 진입");
        Member member = memberRepository.findByUsername(username);

        // session.setAttribute("loginUser", user);
        return new PrincipalDetails(member);
    }
}
