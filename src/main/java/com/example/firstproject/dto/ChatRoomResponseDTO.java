package com.example.firstproject.dto;

import com.example.firstproject.entity.ChatRoom;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRoomResponseDTO {
    private String roomId;
    private String roomName;// 채팅방 이름
    private double locationX;
    private double locationY;
    private LocalDateTime updatedTime;

    public ChatRoomResponseDTO(ChatRoom chatRoom) {
        this.roomId = chatRoom.getRoomId();
        this.roomName = chatRoom.getRoomName();
        this.locationX = chatRoom.getLocationX();
        this.locationY = chatRoom.getLocationY();
        this.updatedTime = chatRoom.getUpdatedTime();
    }
}
