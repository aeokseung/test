package com.example.firstproject.dto;

import com.example.firstproject.entity.Board;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class BoardDTO {
    private int postId;
    private String title;
    private String content;
    private int hits;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private String createdTimeString; // 추가
    private String updatedTimeString; // 추가

    public BoardDTO() {
        // 기본 생성자
    }

    public BoardDTO(Board board) {
        // Board 엔티티를 받는 생성자
        this.postId = board.getPostId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.hits = board.getHits();
        this.createdTime = board.getCreatedTime();
        this.updatedTime = board.getUpdatedTime();
        // LocalDateTime 객체를 문자열로 변환하여 저장
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        this.createdTimeString = this.createdTime.format(formatter);
        this.updatedTimeString = this.updatedTime.format(formatter);
    }
}
