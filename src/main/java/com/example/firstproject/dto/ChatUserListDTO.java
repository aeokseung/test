package com.example.firstproject.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class ChatUserListDTO {
    private String roomId;
    private String memberId;
    private LocalDateTime join_time;

}

