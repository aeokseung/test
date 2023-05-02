package com.example.firstproject.service;

import com.example.firstproject.dto.ChatMessageRequestDTO;
import com.example.firstproject.entity.ChatMessage;
import com.example.firstproject.entity.ChatRoom;
import com.example.firstproject.repository.ChatRepository;
import com.example.firstproject.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.example.firstproject.controller.APIController.distance;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;

    private final ChatRepository chatRepository;


    public ChatMessage saveChat(ChatMessageRequestDTO messageDTO,boolean nearOrNot) {
        ChatMessage chatMessage = new ChatMessage(messageDTO,nearOrNot);
        ChatRoom chatRoom = chatRoomRepository.findById(messageDTO.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("일치하는 ChatRoom이 없습니다."));
        // ChatRoom의 updateTime을 수정합니다.
        chatRoom.update(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        return chatRepository.save(chatMessage);

    }
    public List<ChatRoom> findAllRoom() {
        //채팅방 최근 생성 순으로 반환
        List<ChatRoom> result = new ArrayList<>(chatRoomRepository.findAll());
        Collections.reverse(result);
        return result;
    }

    public boolean getDistance(ChatMessageRequestDTO message) {
        double userLocationX = message.getLocationX();
        double userLocationY = message.getLocationY();
        double siteLocationX = chatRoomRepository.findById(message.getRoomId()).get().getLocationX();
        double siteLocationY = chatRoomRepository.findById(message.getRoomId()).get().getLocationY();

        double distance = distance(userLocationX, userLocationY, siteLocationX, siteLocationY);
        log.info("distance결괏값 : {}", distance);
        if (distance < 10) {
            return true;
        }
        return false;
    }


}

