package com.example.firstproject.controller;

import com.example.firstproject.dto.BoardDTO;
import com.example.firstproject.service.BoardWriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Log4j2
public class BoardWriteController {
    private final BoardWriteService boardWriteService;

    @PostMapping("/board")
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO boardDTO) {
        try {
            log.info("게시판 글 쓰기 요청 : " + boardDTO.getPostId() + "번 글");
            BoardDTO createdBoard = boardWriteService.createBoard(boardDTO);
            return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("글 쓰기 중 오류 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/board/{postId}")
    public ResponseEntity<BoardDTO> updateBoardByPostId(
            @PathVariable Integer postId, @RequestBody BoardDTO boardDTO){
        log.info("게시판 수정 요청 : " + postId + "번 글");
        ResponseEntity<BoardDTO> updatedBoard = boardWriteService.updateBoard(postId, boardDTO);
        return ResponseEntity.ok(updatedBoard.getBody());
    }

    @DeleteMapping("/board/{postId}")
    public ResponseEntity<Map<String, Boolean>> deleteBoardByPostId(
            @PathVariable Integer postId) {
        log.info("게시글 삭제 : " + postId + "번 글");
        return boardWriteService.deleteBoard(postId);
    }
}