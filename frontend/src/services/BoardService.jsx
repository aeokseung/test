import axios from 'axios';

const BOARD_API_BASE_URL = "/api/board";

class BoardService {
    getBoards() {
        return axios.get(BOARD_API_BASE_URL);
    }
    createBoard(board) {
        return axios.post(BOARD_API_BASE_URL, board);
    }
    getOneBoard(postId) {
        return axios.get(BOARD_API_BASE_URL + "/" + postId);
    }
    updateBoard(postId, board) {
        return axios.put(BOARD_API_BASE_URL + "/" + postId, board);
    }
    deleteBoard(postId) {
        return axios.delete(BOARD_API_BASE_URL + "/" + postId);
    }
}

export default new BoardService();