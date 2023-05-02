package com.example.firstproject.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="chat_user_list")
public class ChatUserList {

    @Id
    @Column(name = "member_id")
    private String memberId; //유니크로 중복을 배제

    @Column(name = "room_id")
    private String roomId;

    @Column(name = "join_time")
    private LocalDateTime joinTime;


}
