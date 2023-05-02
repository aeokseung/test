package com.example.firstproject.repository;

import com.example.firstproject.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatRepository  extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomIdAndCreatedTimeAfter(String roomId, LocalDateTime createdTime);
}
