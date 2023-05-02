import React from 'react';
import { useNavigate } from 'react-router-dom';
import BoardService from '../services/BoardService';
import { Button } from "react-bootstrap";
import axios from "axios";
import { useRecoilState } from "recoil";
import { tokenState } from "../recoil/token";

function ListBoardComponent() {
    const [boards, setBoards] = React.useState([]);
    const [token,setToken] = useRecoilState(tokenState);
    const navigate = useNavigate();

    React.useEffect(() => {
        BoardService.getBoards().then((res) => {
            setBoards(res.data);
        });
    }, []);

    const handleCreateBoard = () => {
        axios.get("/api/admin", {
            headers:{
                Authorization: token
            }
        })
            .then((res) => {
                navigate('/create-board/_create');
            })
            .catch(error => alert("관리자만 사용 가능합니다"))
    };

    const handleReadBoard = (postId) => {
        navigate(`/read-board/${postId}`);
    }

    return (
        <div>
            <h2 className="text-center" style={{marginBottom: "30px"}}>공지사항</h2>
            <div className ="row">
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr style={{fontSize: "20px"}}>
                        <th>글 번호</th>
                        <th>제목 </th>
                        <th>작성일 </th>
                        <th>갱신일 </th>
                        <th>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boards.map(
                        board =>
                            <tr className="searchData" key = {board.postId} onClick = {() => handleReadBoard(board.postId)}>
                                <td>{board.postId}</td>
                                <td>{board.title}</td>
                                <td>{board.createdTimeString}</td>
                                <td>{board.updatedTimeString}</td>
                                <td>{board.hits}</td>
                            </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <Button style={{float: "right"}} onClick={handleCreateBoard}>글 쓰기</Button>
        </div>
    );
}

export default ListBoardComponent;