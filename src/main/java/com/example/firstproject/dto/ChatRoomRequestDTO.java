package com.example.firstproject.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChatRoomRequestDTO {

    private String roomId;  // 채팅방 아이디
    private String roomName;// 채팅방 이름
    private double locationX;
    private double locationY;
    private LocalDateTime updateTime;


    public ChatRoomRequestDTO(String roomName, double locationX, double locationY) {
        this.roomId = UUID.randomUUID().toString();
        this.roomName = roomName;
        this.locationX = locationX;
        this.locationY = locationY;
        this.updateTime = LocalDateTime.now();

    }

}



