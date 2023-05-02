package com.example.firstproject.controller;


import com.example.firstproject.dto.BoardDTO;
import com.example.firstproject.service.BoardReadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Log4j2
public class BoardReadController {
    private final BoardReadService boardReadService;

    // get all board
    @GetMapping("/board")
    public List<BoardDTO> getAllBoards() {
        log.info("게시판 조회");
        List<BoardDTO> boardDTOList = boardReadService.getAllBoard();
        for (BoardDTO boardDTO : boardDTOList) {
            boardDTO.setCreatedTimeString(boardDTO.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            boardDTO.setUpdatedTimeString(boardDTO.getUpdatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return boardDTOList;
    }
    @GetMapping("/board/{postId}")
    public ResponseEntity<BoardDTO> getBoardByNo(@PathVariable Integer postId) {
        log.info("게시판 상세보기 요청 : " + postId + "번 글");
        ResponseEntity<BoardDTO> boardResponseEntity = boardReadService.getBoard(postId);
        BoardDTO board = boardResponseEntity.getBody();
        if (board != null) {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setPostId(board.getPostId());
            boardDTO.setTitle(board.getTitle());
            boardDTO.setContent(board.getContent());
            boardDTO.setCreatedTimeString(board.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")));
            boardDTO.setUpdatedTimeString(board.getUpdatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")));
            return ResponseEntity.ok(boardDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}