package com.example.firstproject.entity;

import com.example.firstproject.dto.ChatRoomRequestDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

import java.util.UUID;

@Data
@RequiredArgsConstructor
@Entity
public class ChatRoom {
    @Id
    @Column(name = "room_id")
    private String roomId;
    @Column(name = "room_name")
    private String roomName; //캠핑장 이름이어야 함
    @Column(name = "location_x")
    private double locationX;
    @Column(name = "location_y")
    private double locationY;
    @CreatedDate
    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @LastModifiedDate
    @Column(name = "updated_time")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedTime;
/*
    @Transient //컬럼으로 구성하여 관리할 필요가 없는 데이터에 다는 어노테이션
    //일단 해쉬맵으로 해놨지만 member entity 생기면 그것과 연결하고 chatroomrepository도 수정
    private HashMap<String, String> userList;
 */

    public ChatRoom(ChatRoomRequestDTO requestDto) {
        this.roomId = UUID.randomUUID().toString();
        this.roomName = requestDto.getRoomName();
        this.locationX = requestDto.getLocationX();
        this.locationY = requestDto.getLocationY();
        this.createdTime = LocalDateTime.now();
        this.updatedTime = LocalDateTime.now();
    }

    //채팅방 최근 활성화 시간
    public void update(LocalDateTime updatedTime) {
        if (updatedTime.isAfter(this.updatedTime)) {
            this.updatedTime = updatedTime;
        }
    }

    /*
    public static ChatRoom create(String room_name) {
        ChatRoom room = new ChatRoom();
        room.room_id = UUID.randomUUID().toString();
        room.room_name = "테스트 캠핑장"; //캠핑장 테이블의 이름을 가져올 것
        room.location_x = 127.0; //캠핑장 좌표 조인
        room.location_y = 127.0; //캠핑장 좌표 조인
        room.userlist = ChatRoomDTO.getUserlist();
        return room;
    }
     */
}