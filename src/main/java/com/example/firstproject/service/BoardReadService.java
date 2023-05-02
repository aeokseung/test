package com.example.firstproject.service;


import com.example.firstproject.dto.BoardDTO;
import com.example.firstproject.entity.Board;
import com.example.firstproject.repository.BoardRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class BoardReadService {
    private final BoardRepository boardRepository;

    /**
     * 전체 글 조회 (글 목록)
     */
    public List<BoardDTO> getAllBoard() {
        // Board 엔티티의 리스트를 조회
        List<Board> boardList = boardRepository.findAll();
        // BoardDTO의 리스트를 생성
        List<BoardDTO> boardDTOList = new ArrayList<>();
        // Board 엔티티의 리스트를 BoardDTO의 리스트로 변환
        for (Board board : boardList) {
            BoardDTO boardDTO = new BoardDTO(board);
            boardDTOList.add(boardDTO);
        }
        // BoardDTO의 리스트를 반환
        return boardDTOList;
    }
    /**
     * 글 상세 보기 (글 클릭해서 단일 항목 보기)
     */
    public ResponseEntity<BoardDTO> getBoard(@PathVariable Integer postId) {
        Board board = boardRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not exist Board Data by postId : ["+postId+"]"));
        board.setHits(board.getHits()+1);
        boardRepository.save(board);
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setPostId(board.getPostId());
        boardDTO.setTitle(board.getTitle());
        boardDTO.setContent(board.getContent());
        boardDTO.setCreatedTime(board.getCreatedTime());
        boardDTO.setUpdatedTime(board.getUpdatedTime());
        return ResponseEntity.ok(boardDTO);
    }
}