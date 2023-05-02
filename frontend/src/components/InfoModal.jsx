import React, {useState, useEffect} from 'react';
import {Modal, Button} from "react-bootstrap";
import CampingMap from './CampingMap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { tokenState } from '../recoil/token';
import { userState } from "../recoil/user";

function InfoModal({ info, show, handleClose }) {

    const [user,setUser] = useRecoilState(userState);
    const [token,setToken] = useRecoilState(tokenState);

    const navigate = useNavigate();
    const [roomId,setRoomId] = useState('');

    const [username,setUsername]= useState(null);

    useEffect(() => {
        if(user) {
            setUsername(user.nickname);
        } else {
            setUsername('');
        }
    }, [user]);

    const inToChatRoom = () => {

        axios.get("/api/user", {
            headers: {
                Authorization: token
            }
        })
        .then((res)=>{
            
            if (username.trim() !== ''){
            
                if (info.roomId === '' || undefined){
            
                    axios.post(`/api/chat/create`, {
                        locationX: info.campingCoordinateX,
                        locationY: info.campingCoordinateY,
                        roomName: info.campingName
                    })

                .then(res => {
                    const roomId = res.data.roomId
                    navigate(`/chat/room/${roomId}`, {state: {
                    roomName: info.campingName,
                    userCheck: "가능"
                        } 
                    });
                })
              
                .catch(err => {
                console.error(err);
                });

            }else{
                axios.get(`/api/chat/room/${info.roomId}/${username}/user-check`)

                .then(res => {
                    const userCheck = res.data;
                    
                    let navigateToChat = false;
                    
                    if (userCheck === "다른 방 구독 유저") {
                      navigateToChat = window.confirm("동시에 하나의 채팅방만 이용 가능합니다. 입장하시겠습니까?\n(기존에 참여했던 채팅방의 기록이 사라집니다.)");
                    } else {
                      navigateToChat = true;
                    }
                    
                    if (navigateToChat) {
                      navigate(`/chat/room/${info.roomId}`, { state : { 
                        roomName: info.campingName,
                        userCheck: userCheck
                    } });
                    } else {
                      navigate(`/`);
                    }
                  })

                
            }}
        
        })
        .catch((err)=>{
            alert("로그인 후 이용 가능합니다.")
            navigate("/")
        })
    }
    
        //'채팅방 입장하기' 버튼 클릭 시
        //방 존재 유무(=info.roomId 변수로 roomId에 저장되어서 모달이 열림) 확인 후 없으면 생성 / 있으면 입장
        

        
    return (
        <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton style={{backgroundColor: "#0D6EFE",color: "#FFFFFF"}}>
                <Modal.Title style={{fontWeight: "bold",marginLeft: "Auto"}}>
                        {info.campingName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CampingMap lan={info.campingCoordinateX} lng={info.campingCoordinateY} campingAddress={info.campingAddress}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={inToChatRoom}>
                    채팅방 입장하기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default InfoModal;