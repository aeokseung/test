package com.example.firstproject.controller;

import com.example.firstproject.dto.ChatBeforeMessageResponseDTO;
import com.example.firstproject.dto.ChatMessageRequestDTO;
import com.example.firstproject.dto.ChatMessageResponseDTO;
import com.example.firstproject.service.ChatRoomService;
import com.example.firstproject.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

import static com.example.firstproject.dto.ChatMessageRequestDTO.MessageType.ENTER;
import static com.example.firstproject.dto.ChatMessageRequestDTO.MessageType.LEAVE;

@Controller
@Log4j2
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessageResponseDTO chatting(ChatMessageRequestDTO message, @DestinationVariable("roomId") String roomId) throws Exception {

        //캠핑장 - 사용자 반경 측정 후 boolean 값으로 저장
        Boolean nearOrNot = chatService.getDistance(message);

        chatService.saveChat(message,nearOrNot);
        if (message.getType() == ENTER) {
            chatRoomService.insertUserList(message);
        }
        else if (message.getType() == LEAVE) {
            chatRoomService.DeleteUserList(roomId,message.getSender());
        }
        return new ChatMessageResponseDTO(message,nearOrNot);
    }

    @GetMapping("/api/chat/room/{roomId}/{memberId}/before-messages")
    @ResponseBody
    public ResponseEntity<List<ChatBeforeMessageResponseDTO>> beforeMessages(@PathVariable String roomId, @PathVariable String memberId) {
        List<ChatBeforeMessageResponseDTO> beforeMessages = chatRoomService.ChatBeforeMessages(roomId,memberId);
        return ResponseEntity.ok(beforeMessages);
    }
}

