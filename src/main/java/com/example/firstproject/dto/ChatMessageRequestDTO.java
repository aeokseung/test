package com.example.firstproject.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageRequestDTO {

    public enum MessageType {
        ENTER, TALK, LEAVE
    }

    private String roomId;
    private MessageType type;
    private String sender;
    private String message;
    private double locationX;
    private double locationY;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdTime;


}



