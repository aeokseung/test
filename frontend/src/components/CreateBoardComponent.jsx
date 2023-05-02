import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate, useParams} from 'react-router-dom';
import BoardService from '../services/BoardService';
import useDidMountEffect from "../useDidMountEffect";
import {useRecoilState} from "recoil";
import {tokenState} from "../recoil/token";

function CreateBoardComponent() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [token,setToken] = useRecoilState(tokenState);
    const [title, setTitle] = useState('');
    const [content, setContents] = useState('');

    useEffect(() => {
        (
            axios.get("/api/admin", {
                headers:{
                    Authorization: token
                }
            })
                .then((res) => {
                })
                .catch((error) => {
                    alert("관리자만 사용 가능합니다");
                    navigate('/');
                    })
        )
    }, [token])

    const changeTitleHandler = (event) => {
        setTitle(event.target.value);
    }

    const changeContentsHandler = (event) => {
        setContents(event.target.value);
    }
    const createBoard = (event) => {
        event.preventDefault();
        let board = {
            title: title,
            content: content
        };

        if (postId === '_create') {
            BoardService.createBoard(board).then(res => {
                navigate('/board');
            });
        } else {
            BoardService.updateBoard(postId, board).then(res => {
                navigate('/board');
            });
        }
    }
    const cancel = () => {
        navigate('/board');
    }
    const getTitle = () => {
        if (postId === '_create') {
            return <h3 className="text-center">새글을 작성해주세요</h3>
        } else {
            return <h3 className="text-center">{postId}글을 수정 합니다.</h3>
        }
    }

    useEffect(() => {
        if (postId === '_create') {
            return
        } else {
            BoardService.getOneBoard(postId).then( (res) => {
                let board = res.data;
                setTitle(board.title);
                setContents(board.content);
            });
        }
    }, [postId]);

    return (
        <div>
            <div className = "container">
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                        {
                            getTitle
                        }
                        <div className = "card-body">
                            <form>
                                <div className = "form-group">
                                    <div className="mb-3">
                                        <label className="form-label">제목</label>
                                        <input type="text" placeholder="title" className="form-control" name="title" value={title} onChange={changeTitleHandler}/>
                                    </div>
                                </div>
                                <div className = "form-group">
                                    <div className="mb-3">
                                        <label className="form-label">내용</label>
                                        <textarea className="form-control" placeholder="content" name="content" value={content} onChange={changeContentsHandler}></textarea>
                                    </div>
                                </div>
                                <div style={{marginTop:"20px"}}>
                                    <button className="btn btn-success" onClick={createBoard}>Save</button>
                                    <button className="btn btn-danger" onClick={cancel} style={{marginLeft:"10px"}}>Cancel</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default CreateBoardComponent;