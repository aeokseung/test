import React, { useState, useEffect } from 'react';
import BoardService from '../services/BoardService';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import {useRecoilState} from "recoil";
import {tokenState} from "../recoil/token";
import {userState} from "../recoil/user";
function ReadBoardComponent() {
    const { postId } = useParams();
    const [board,setBoard] = useState({});
    const [role,setRole] = useState('');
    const [token,setToken] = useRecoilState(tokenState);
    const [user,setUser] = useRecoilState(userState);

    const navigate = useNavigate();

    useEffect(() => {
        BoardService.getOneBoard(postId).then((res) => {
            setBoard(res.data);
        });
    }, [postId]);

    useEffect(() => {
        if(user) {
            setRole(user.role);
        } else {
            setRole('');
        }
    }, [user]);

    function goToList() {
        navigate('/board');
    }

    let goToUpdate = (event) => {
        axios.get("/api/admin", {
            headers:{
                Authorization: token
            }
        })
            .then((res) => {
                event.preventDefault();
                navigate(`/create-board/${postId}`);
            })
            .catch(error => alert("관리자만 사용 가능합니다"))
    }

    let deleteView = () => {
        axios.get("/api/admin", {
            headers:{
                Authorization: token
            }
        })
            .then((res) => {
                if(window.confirm("정말로 글을 삭제하시겠습니까?\n삭제된 글은 복구 할 수 없습니다.")) {
                    BoardService.deleteBoard(postId).then(res => {
                        if (res.status === 200) {
                            navigate('/board/');
                        } else {
                            alert("글 삭제가 실패했습니다.");
                        }
                    });
            }})
            .catch(error => alert("관리자만 사용 가능합니다"))
    }


    return (
        <div>
            <div className="card col-md-6 offset-md-3">
                <h3 className="text-center" style={{margin: "20px"}}> Read Detail</h3>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">글 번호</label>
                        <input type="text" className="form-control" name="title" value={board.postId} readOnly/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">제목</label>
                        <input type="text" className="form-control" name="title" value={board.title} readOnly/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">내용</label>
                        <textarea className="form-control" rows="3" name="content" value={board.content} readOnly></textarea>
                    </div>
                    <div style={{textAlign: "right", marginTop: "20px"}}>
                        <button className="btn btn-primary" onClick={goToList} style={{ marginLeft: '10px'}}>
                            목록으로 이동
                        </button>
                        {role!=="ROLE_ADMIN" ?
                            <></>
                            : <>
                                <button className="btn btn-info" onClick={goToUpdate} style={{marginLeft:"10px"}}>글 수정</button>
                                <button className="btn btn-danger" onClick={deleteView} style={{marginLeft:"10px"}}>글 삭제</button>
                            </>
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ReadBoardComponent;