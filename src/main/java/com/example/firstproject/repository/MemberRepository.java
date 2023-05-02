package com.example.firstproject.repository;

import com.example.firstproject.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

//crud 함수를 JpaRepository가 들고 있음
//JpaRepository를 상속해서 @Repository라는 annotation이 없어도 IoC됨.
//<User, Integer>- User: type, Integer: User model의 primary key type
public interface MemberRepository extends JpaRepository<Member, Integer> {
    //findBy(규칙) -> Username 문법
    //select * from user where username = 1?(이게 username)
    public Member findByUsername(String username);//jpa query method
    public Member findByNickname(String nickname);
}
