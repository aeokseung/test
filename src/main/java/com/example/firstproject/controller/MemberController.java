package com.example.firstproject.controller;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

import com.example.firstproject.config.auth.PrincipalDetails;
import com.example.firstproject.dto.UpdateUserDTO;
import com.example.firstproject.entity.Member;
import com.example.firstproject.repository.MemberRepository;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


import lombok.RequiredArgsConstructor;

@Log4j2
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // Tip : JWT를 사용하면 UserDetailsService를 호출하지 않기 때문에 @AuthenticationPrincipal 사용 불가능.
    // 왜냐하면 @AuthenticationPrincipal은 UserDetailsService에서 리턴될 때 만들어지기 때문이다.

    // 유저 혹은 매니저 혹은 어드민이 접근 가능
    @GetMapping("/user")
    public String user(Authentication authentication) {
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        return "<h1>user</h1>";
    }

    // 유저 혹은 매니저 혹은 어드민이 접근 가능- 프로필 화면 들어갈때 nickname 값을 리턴
    @GetMapping("/user/userCheck")
    public String userProfile(Authentication authentication) {
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();

        JSONObject jsonObj = new JSONObject();
        jsonObj.put("username", principal.getMember().getUsername());
        jsonObj.put("nickname", principal.getMember().getNickname());
        jsonObj.put("role", principal.getMember().getRoles());

        log.info("userCheck 객체: " + jsonObj);

        return jsonObj.toString();
    }

    @PutMapping("/user/updatePassword")
    public String updatePassword(@RequestBody UpdateUserDTO memberDTO) {
        Member member = memberRepository.findByUsername(memberDTO.getUsername());

        if (member == null) {
            return "잘못된 접근입니다";
        } else {
            if (bCryptPasswordEncoder.matches(memberDTO.getPassword(), member.getPassword())) {
                member.setPassword(bCryptPasswordEncoder.encode(memberDTO.getUpadate_password()));
                memberRepository.save(member);
                return "비밀번호 수정 완료";
            } else {
                return "기존 비밀번호를 확인하세요";
            }
        }
    }

    @PutMapping("/user/updateNickname")
    public String updateNickname(@RequestBody UpdateUserDTO memberDTO) {
        Member member = memberRepository.findByNickname(memberDTO.getNickname());
        Member member1 = memberRepository.findByNickname(memberDTO.getUpadate_nickname());
        if (member == null) {
            return "잘못된 접근입니다";
        } else {
            if (member1 == null) {
                member.setNickname(memberDTO.getUpadate_nickname());
                memberRepository.save(member);
                return "닉네임 수정 완료";
            } else {
                return "이미 존재하는 닉네임 입니다";
            }
        }
    }

    @DeleteMapping("/user/delete")
    public String delete(@RequestBody Member member) {
        Member isMember = memberRepository.findByUsername(member.getUsername());
        if (isMember == null) {
            return "잘못된 요청입니다.";
        } else {
            memberRepository.delete(isMember);
            return "회원 탈퇴 성공";
        }
    }

    // 어드민이 접근 가능
    @GetMapping("/admin")
    public String admin(Authentication authentication) {
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        return "<h1>admin</h1>";
    }

    @PostMapping("/loginProcess")
    public String loginProcess(@RequestBody Member member) throws IOException {
        // Create HTTP client
        HttpClient client = HttpClientBuilder.create().build();
        // Create POST request with member object as JSON string in request body
        HttpPost request = new HttpPost("http://localhost:8080/login");
        String json = "{\"username\":\"" + member.getUsername() + "\",\"password\":\"" + member.getPassword() + "\"}";
        StringEntity entity = new StringEntity(json, ContentType.APPLICATION_JSON);
        request.setEntity(entity);

        // Execute request and get response
        HttpResponse response = client.execute(request);

        return response.getFirstHeader("Authorization").getValue();
    }

    @PostMapping("/join")
    public String join(@RequestBody Member member) {
        Member isMember = memberRepository.findByUsername(member.getUsername());
        Member isNickname = memberRepository.findByNickname(member.getNickname());
        if (isMember != null) {
            return "이미 가입된 회원입니다.";
        } else {
            if (isNickname != null) {
                return "중복된 닉네임 입니다.";
            } else {
                member.setPassword(bCryptPasswordEncoder.encode(member.getPassword()));
                member.setRoles("ROLE_USER");
                member.setNickname(member.getNickname());
                memberRepository.save(member);
                return "회원가입 완료";
            }
        }
    }

}
