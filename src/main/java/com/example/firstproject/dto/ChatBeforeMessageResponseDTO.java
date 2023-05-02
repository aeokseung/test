package com.example.firstproject.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatBeforeMessageResponseDTO {

    private String sender;
    private String message;
    private LocalDateTime createdTime;
    private Boolean nearOrNot;

}
