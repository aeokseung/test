package com.example.firstproject.controller;

import com.example.firstproject.dto.ChatRoomRequestDTO;
import com.example.firstproject.dto.ChatRoomResponseDTO;
import com.example.firstproject.dto.ChatUserListResponseDTO;
import com.example.firstproject.entity.ChatRoom;
import com.example.firstproject.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class ChatRoomContoller {
    private final ChatRoomService chatRoomService;

    // 채팅 리스트 화면
    @GetMapping("/chat/room/list")
    @ResponseBody
    public ResponseEntity<List<ChatRoom>> getRoomList() {
        List<ChatRoom> chatRooms = chatRoomService.findAllRoom();
        return new ResponseEntity<>(chatRooms, HttpStatus.OK);
    }

    // 채팅방 생성
    @PostMapping("/chat/create")
    public ResponseEntity<ChatRoomResponseDTO> createRoom(@RequestBody ChatRoomRequestDTO chatRoomRequestDTO) {
        ChatRoom chatRoom = chatRoomService.createRoom(chatRoomRequestDTO);
        return new ResponseEntity<ChatRoomResponseDTO>(new ChatRoomResponseDTO(chatRoom), HttpStatus.CREATED);
    }

    // 특정 채팅방 조회 (1)
    // 채팅방 정보를 가져오는 메서드
    @GetMapping("/chat/room/{roomId}")
    @ResponseBody
    public ResponseEntity<ChatRoomResponseDTO> getRoomInfo(@PathVariable String roomId) {
        // roomId를 이용하여 채팅방 정보를 조회하고 ResponseDTO를 생성하여 반환합니다.
        ChatRoomResponseDTO chatRoomResponseDTO = chatRoomService.findRoomByRoomId(roomId);
        if (chatRoomResponseDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(chatRoomResponseDTO);
    }

    //특정 채팅방 조회 (2)
    //채팅방 존재 여부 확인 메서드 (없으면 false, 있으면 true 반환)
    @GetMapping("/chat/room/exist/{roomName}")
    public String chatRoomCheck(@PathVariable String roomName) {
        String roomCheck = chatRoomService.findRoomByRoomName(roomName);
        return roomCheck; // 문자열을 JSON 형태로 변환하지 않음
    }

    //채팅방 유저 리스트 조회
    @GetMapping("/chat/room/{roomId}/user-list")
    public ResponseEntity<List<ChatUserListResponseDTO>> userList(@PathVariable String roomId) {
        List<ChatUserListResponseDTO> userList = new ArrayList<>(chatRoomService.findUserListRoomByRoomId(roomId));
        if (userList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userList);
    }

    //채팅방 기참여 여부 조회
    @GetMapping("/chat/room/{roomId}/{memberId}/user-check")
    public ResponseEntity<String> userInRoomCheck(@PathVariable String roomId, @PathVariable String memberId) {
        String result = chatRoomService.isUserInRoom(roomId,memberId);
        if (result == "InUser") {
            return ResponseEntity.ok("구독 유저");
        } else {
            if (result == "OtherInUser") {
                return ResponseEntity.ok("다른 방 구독 유저");
            } else {
                return ResponseEntity.ok("가능");
            }
        }
    }


}
