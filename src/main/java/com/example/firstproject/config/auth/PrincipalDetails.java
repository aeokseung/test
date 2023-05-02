package com.example.firstproject.config.auth;



import com.example.firstproject.entity.Member;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
//security가 /login주소 요청이 오면 낚아채서 로그인 진행시킴
//login이 완료되면 security session(security만의 session)을 만들어줌(Security ContextHolder)

//1. Security Session에 들아갈 수 있는 객체는 Authentication 객체
//2. Authentication 객체 안에 User 정보를 넣어야 하는데 그 형식이 UserDetails이어야 함
//나중에 정보를 꺼낼 때는 Security Session에 있는 Authentication 객체를 꺼내고
//그 안에서 UserDetails를 꺼내면 User object(UserDetails 형식 객체)에 접근할 수 있음

//implements UserDetails를 하면 PrincipalDetails가 UserDetails 형식으로 변함
//Security Session -> Authentication -> UserDetails(PrincipalDetails)
//이렇게 되면 PrincipalDetails를 Authentication 객체 안에 넣을 수 있음

@Data
public class PrincipalDetails implements UserDetails{
    private Member member;

    //일반 login
    public PrincipalDetails(Member member){
        this.member = member;
    }

    public Member getMember() {
        return member;
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //우리 사이트 회원이 1년동안 이용 안 하면 휴면계정
    //현재시간 - login시간 = 1년 초과하면 return false 이건 다음에
    @Override
    public boolean isEnabled() {
        return true;
    }

    //해당 User의 권한을 반환하는 곳
    //getAuthorities()의 형식은 Collection<? extends GrantedAuthority>인데
    //User.java의 role 형식이 String이라 바로 user.getRole()사용 불가능
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //ArrayList는 Collection의 자식
        Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        member.getRoleList().forEach(r -> {
            authorities.add(()->{ return r;});
        });
        return authorities;
    }
}
