package com.example.firstproject.repository;

import com.example.firstproject.dto.ChatUserListDTO;
import com.example.firstproject.dto.ChatUserListResponseDTO;
import com.example.firstproject.entity.ChatUserList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatUserListRepository extends JpaRepository<ChatUserList,String> {

    List<ChatUserListResponseDTO> findAllByRoomId(String roomId);

    @Query("SELECT cul FROM chat_user_list cul WHERE cul.roomId = :roomId AND cul.memberId = :memberId")
    ChatUserList findUserList(@Param("roomId") String roomId, @Param("memberId") String memberId);

    @Query("SELECT cul.joinTime FROM chat_user_list cul WHERE cul.roomId = :roomId AND cul.memberId = :memberId")
    LocalDateTime findJoinTime(@Param("roomId") String roomId, @Param("memberId") String memberId);

    @Query("SELECT cul FROM chat_user_list cul WHERE cul.roomId != :roomId AND cul.memberId = :memberId")
    ChatUserList findOtherUserList(@Param("roomId") String roomId, @Param("memberId") String memberId);

}

