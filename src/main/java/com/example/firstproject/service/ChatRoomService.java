package com.example.firstproject.service;

import com.example.firstproject.dto.*;
import com.example.firstproject.entity.ChatMessage;
import com.example.firstproject.entity.ChatRoom;
import com.example.firstproject.entity.ChatUserList;
import com.example.firstproject.repository.ChatRepository;
import com.example.firstproject.repository.ChatRoomRepository;
import com.example.firstproject.repository.ChatUserListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRepository chatRepository;

    private final ChatRoomRepository chatRoomRepository;

    private final ChatUserListRepository chatUserListRepository;

    //채팅방 생성
    public ChatRoom createRoom(ChatRoomRequestDTO requestDto) {
        ChatRoom chatRoom = new ChatRoom(requestDto);
        return chatRoomRepository.save(chatRoom);
    }

    //채팅방 리스트 불러오기
    public List<ChatRoom> findAllRoom() {
        //채팅방 최근 생성 순으로 반환
        List<ChatRoom> result = new ArrayList<>(chatRoomRepository.findAll());
        Collections.reverse(result);
        return result;
    }

    //채팅방 하나 불러오기
    public ChatRoomResponseDTO findRoomByRoomId(String roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElse(null);
        return new ChatRoomResponseDTO(chatRoom);
    }

    //채팅방 유저리스트 조회
    public List<ChatUserListResponseDTO> findUserListRoomByRoomId(String roomId) {
        List<ChatUserListResponseDTO> userList = chatUserListRepository.findAllByRoomId(roomId);
        return userList;
    }

    public String DeleteUserList(String roomId, String memberId) {
        ChatUserList userList = chatUserListRepository.findUserList(roomId, memberId);
        chatUserListRepository.delete(userList);
        return "삭제 완료";
    }

    public String findRoomByRoomName(String roomName) {
        String result = chatRoomRepository.existsByRoomName(roomName);
        return result;
    }



        /*

        회원 기능 병합 되면 주석 풀고 연결

        // 채팅방 참여 인원 표시 - userList의 count 수만 가져오기
        chatRoom.setNumberOfUsers(chatRoom.getUserList().size());

         */


    //채팅방 유저 리스트에 참가자 추가
    public ChatUserList insertUserList(ChatMessageRequestDTO chatMessage) {
        ChatUserList chatUserList = new ChatUserList(
                chatMessage.getSender(), chatMessage.getRoomId(), LocalDateTime.now());
        return chatUserListRepository.save(chatUserList);
    }

    //유저 기참여여부 확인
    public String isUserInRoom(String roomId, String memberId) {
        ChatUserList userList = chatUserListRepository.findUserList(roomId, memberId);
        if (userList != null) {
            return "InUser";
        } else {
            ChatUserList memberCheck = chatUserListRepository.findOtherUserList(roomId, memberId);
            if (memberCheck != null) {
                return "OtherInUser";
            }
            return "OK";
        }
        // 일치하는 조건이 없는 경우

    }

    public List<ChatBeforeMessageResponseDTO> ChatBeforeMessages(String roomId, String memberId) {
        LocalDateTime joinTime = chatUserListRepository.findJoinTime(roomId,memberId);
        List<ChatMessage> messages = chatRepository.findByRoomIdAndCreatedTimeAfter(roomId, joinTime);
        List<ChatBeforeMessageResponseDTO> dtos = new ArrayList<>();
        for(ChatMessage message : messages) {
            ChatBeforeMessageResponseDTO dto = new ChatBeforeMessageResponseDTO();
            // ChatMessageResponseDTO 객체의 필드 값을 ChatMessage 객체의 필드 값으로 설정
            dto.setMessage(message.getMessage());
            dto.setSender(message.getMemberId());
            dto.setCreatedTime(message.getCreatedTime());
            dto.setNearOrNot(message.getNearOrNot());
            dtos.add(dto);
        }
        return dtos;
    }

}
