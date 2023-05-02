package com.example.firstproject.repository;

import com.example.firstproject.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    @Query("SELECT r.roomId FROM ChatRoom r WHERE r.roomName = :roomName")
    String existsByRoomName(@Param("roomName") String roomName);
}