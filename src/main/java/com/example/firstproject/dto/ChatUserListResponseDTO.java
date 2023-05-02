package com.example.firstproject.dto;

import com.example.firstproject.entity.ChatUserList;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ChatUserListResponseDTO {
    private String roomId;
    private String memberId;

    public ChatUserListResponseDTO(ChatUserList chatUserList) {
        this.roomId = chatUserList.getRoomId();
        this.memberId = chatUserList.getMemberId();
    }
}

