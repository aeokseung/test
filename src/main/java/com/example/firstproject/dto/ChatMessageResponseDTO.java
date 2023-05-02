package com.example.firstproject.dto;

import com.example.firstproject.entity.ChatMessage;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageResponseDTO {

    private String sender;
    private String message;
    private LocalDateTime createdTime;
    private Boolean nearOrNot;
    public ChatMessageResponseDTO(ChatMessageRequestDTO message,boolean nearOrNot) {
        this.createdTime = message.getCreatedTime();
        this.sender = message.getSender();
        this.message = message.getMessage();
        this.nearOrNot = nearOrNot;
    }

}
