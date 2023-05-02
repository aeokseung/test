package com.example.firstproject.service;

import com.example.firstproject.dto.BoardDTO;
import com.example.firstproject.entity.Board;
import com.example.firstproject.exception.ResourceNotFoundException;
import com.example.firstproject.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Log4j2
public class BoardWriteService {
    private final BoardRepository boardRepository;

    /** 게시글 작성하기 - 매개변수 : BoardDTO boardDTO */
    public BoardDTO createBoard(BoardDTO boardDTO) {
        Board board = new Board();
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setHits(1);
        Board savedBoard = boardRepository.save(board);
        boardDTO.setPostId(savedBoard.getPostId());
        log.info("saved content : " + boardDTO.getContent());
        return boardDTO;
    }

    /** 게시글 수정하기 - 매개변수 : Int no, BoardDTO boardDTO */
    public ResponseEntity<BoardDTO> updateBoard(Integer no, BoardDTO updatedBoardDTO) {
        Board board = boardRepository.findById(no) // select no from board;
                .orElseThrow(() -> new ResourceNotFoundException("Not exist Board Data by no : ["+no+"]")); // 예외 처리
        board.setTitle(updatedBoardDTO.getTitle()); // select title from board;
        board.setContent(updatedBoardDTO.getContent()); // select content from board;
        Board updatedBoard = boardRepository.save(board); // 값 세팅되었으면 저장하기
        return ResponseEntity.ok(new BoardDTO(updatedBoard)); // 성공적으로 요청이 처리되었으니 ResponseEntity를 반환
    }

    /** 게시글 삭제하기 - 매개변수 : int no */
    public ResponseEntity<Map<String, Boolean>> deleteBoard(Integer no) {
        Board board = boardRepository.findById(no)
                .orElseThrow(() -> new ResourceNotFoundException("Not exist Board Data by no : ["+no+"]"));
        boardRepository.delete(board);
        Map<String, Boolean> response = new HashMap<>();
        response.put("Deleted Board Data by id : ["+no+"]", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    /** 모든 게시글 조회하기 */
    public List<BoardDTO> getAllBoard() {
        List<Board> boards = boardRepository.findAll();
        return boards.stream().map(BoardDTO::new).collect(Collectors.toList());
    }
}