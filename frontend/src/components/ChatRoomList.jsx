import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/user";
import { tokenState } from '../recoil/token';

function ChatRoomList() {

    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    chatRooms.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
    const [camping,setCamping] = useState([]);
    const [user,setUser] = useRecoilState(userState);
    // const username = user.nickname;
    const [username,setUsername]= useState(null);
    const [token,setToken] = useRecoilState(tokenState); 
   
    useEffect(() => {

        if(user) {
            setUsername(user.nickname);
        } else {
            setUsername('');
        }
        
    }, [user]);

    
    useEffect(() => {

        axios.get("/api/chat/room/list")
            .then(res => {
                // console.log(res.data);
                setChatRooms(res.data);
            })
            .catch(
                error => console.error(error)
            )
    }, []);


    //-----------------채팅방 상세 화면으로 넘어가는 함수----------------
    const handleClick = (roomId) => {
        //회원 여부 확인
        axios.get("/api/user", {
            headers: {
                Authorization: token
            }
        })
        .then((res) => {
            /**
             * 회원의 채팅방 기참여 여부 확인하는 함수
             * room_id, username을 넘겨주고 user_list 테이블에 있는 지 확인 후
             * 기참여 여부 없으면 '가능',
             * 있으면 userCheck에 '구독 유저' 할당
             */
            axios.get(`/api/chat/room/${roomId}/${username}/user-check`)
                .then(res => {
                    const userCheck = res.data
                    if (userCheck === "다른 방 구독 유저") {
                        if (window.confirm("동시에 하나의 채팅방만 이용 가능합니다. 입장하시겠습니까?\n(기존에 참여했던 채팅방의 기록이 사라집니다.)") === true) {
                            //기존 구독정보 갱신
                            navigate(`/chat/room/${roomId}`, {state: {userCheck: userCheck}})
                        } else {
                            navigate(`/chat/list`)
                        }
                    } else {
                        navigate(`/chat/room/${roomId}`, {state: {userCheck: userCheck}});
                    }
                })
                .catch(error => console.error(error));
        })
        .catch((error) => {
            alert("로그인이 필요합니다");
            navigate('/chat/list');
        })
    }


    return (
        <>

            <div>
                <h2 className="text-center" style={{marginBottom: "30px"}}>채팅방</h2>
                <div className="text-center" style={{marginBottom: "30px"}}> {chatRooms.length}개의 채팅방이 있습니다. 
                <br /> (목록에 없는 채팅방은 메인 화면에서 캠핑장 검색 후 생성하여 입장할 수 있습니다.)</div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr style={{fontSize: "20px"}}>
                            <th> 캠핑장 </th>
                            <th> 최근 채팅 시간 </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            chatRooms.map(
                                chatRooms =>
                                    <tr key = {chatRooms.roomId} onClick={() => handleClick(chatRooms.roomId)}>
                                        <td>{chatRooms.roomName}</td>
                                        <td>{new Date(chatRooms.updatedTime).toLocaleString()}</td>
                                    </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>




        </>
    )
}

export default ChatRoomList;