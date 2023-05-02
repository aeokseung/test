import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Stomp from 'stompjs';
import '../styles/ChatRoom.css';
import { useParams, useNavigate, useLocation, useHref } from 'react-router-dom';
import moment from 'moment-timezone';
import { useRecoilState } from "recoil";
import { userState } from "../recoil/user";
import { locationState } from "../recoil/location";
import { tokenState } from '../recoil/token';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Offcanvas from 'react-bootstrap/Offcanvas';

function ChatRoom() {

  const navigate = useNavigate();
  /**
   * 이전 경로에서 넘어오는 데이터
   */
  const { roomId } = useParams(); //채팅방 UUID
  const location = useLocation(); 
  const [userCheck,setUserCheck] = useState(`${location.state?.userCheck}`); //채팅방 입장 전, 회원의 채팅방 기참여여부

  if(userCheck === undefined) {
     const username = user?.nickname
    navigate('/');    
  }

  // useEffect(() => {
  //   prevUserCheckRef.current = userCheck;
  // }, [userCheck]);
  
  /**
   * Recoil에 담긴 데이터 (유저 관련)
   */
  const [user,setUser] = useRecoilState(userState); //유저 정보
  const [token,setToken] = useRecoilState(tokenState); //유저 Authentication
  const [nowLocation,setNowLocation] = useRecoilState(locationState); //유저 현재 위치
  const username = user?.nickname
  
  
  /**
   * DB에서 조회해오는 데이터
   */
  const [userList, setUserList] =useState([]); //유저리스트
  const [roomInfo,setRoomInfo]= useState({}); //채팅방 정보 (roomId, roomName, locationX,locationY ...)

  /**
   * 웹소켓 연결 관련 변수
   */
  const [stompClient, setStompClient] = useState(null); // 채팅 서버 연결 정보
  const [connected, setConnected] = useState(false); //연결 여부를 확인
  const subscribeUrl = `/topic/${roomId}`; //접속 시 채팅 서버 연결 경로
  const publishUrl = `/app/chat/${roomId}`; // 메세지 보내는 경로

  /**
   * 화면에서 비동기적으로 메세지를 처리하는 변수들
   */
  const [messages, setMessages] = useState([]); //채팅방 내 메세지들을 담는 변수
  const [newMessage, setNewMessage] = useState(''); //새로운 메세지를 입력하는 변수
  
  /**
   * UI 관련
   */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const messageEndRef = useRef(null);


// 채팅방 정보 받아오는 코드
useEffect(() => {
  axios.get(`/api/chat/room/${roomId}`).then((res) => {
    if (res.data) {
      setRoomInfo(res.data);
    }
  }).catch((error) => {
    console.error(error);
    alert("유효하지 않은 접근입니다.")
    return navigate("/")
  });

}, [roomId]);

// 유저 리스트 받아오는 코드
useEffect(()=>{
  axios.get(`/api/chat/room/${roomId}/user-list`).then((res) => {
    if (res.data) {
      setUserList(res.data);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}, []);


// 채팅 메시지를 스크롤하여 최신 메시지를 보여주는 코드
  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);


  useEffect(() => {

    //roomInfo 받아오기
    axios.get(`/api/chat/room/${roomId}`)
      .then((res) => {
        if (res.data) {
          setRoomInfo(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });


    /**
     * 채팅(웹소켓) 접속 설정
     */

    const socket = new SockJS(`/api/ws-stomp`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // 통신 내역 콘솔 출력 방지

    //회원 여부를 토큰으로 확인
    if (token) {
      /**
       * 웹소켓 연결 & 화면에 메세지 비동기적으로 출력
       */
      stompClient.connect({}, function (frame) {
        setConnected(true);
        //console.log('Connected: ' + frame);
        stompClient.subscribe(subscribeUrl, function (greeting) {
          setMessages((messages) => [...messages, JSON.parse(greeting.body)]);
        });
        setStompClient(stompClient);

        //구독 유저가 아닐 경우, 입장 메세지를 보낸다.
        if(userCheck !== '구독 유저') {
          // 채팅방 입장 전 해당 유저의 채팅방 기참여 여부를 userCheck에 담아 들고 온다.
          // userCheck가 기존에 구독 유저가 아니라면 ENTER type 메세지 자동 전송
          stompClient.send(publishUrl, {}, JSON.stringify({ 
            roomId: roomId,
            type: 'ENTER',
            sender: username,
            message: username+'님이 입장했습니다.',
            locationX: nowLocation.latitude,
            locationY: nowLocation.longitude,
            createdTime:moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
          }), () => {
            // Enter type 메세지가 전송되면 해당 userList 유저 정보가 DB에 편입.
            // 따라서 변경된 userList에서 다시 한번 user-check를 수행해 상태를 업데이트.
            axios.get(`/api/chat/room/${roomInfo.roomId}/${username}/user-check`)
              .then((res) => {
                //console.log(res.data);
                // userList 상태 변경
                setUserList((prevUserList) => [...prevUserList, username]);
              })
              .catch((err) => {
                //console.log(err);
              });
          });      
        }
        //구독 유저일 경우 
        //채팅방에 처음 들어왔던 시점부터 생성된 메세지를 전부 불러와 화면에 표시.
        if (userCheck === "구독 유저") {
          axios.get(`/api/chat/room/${roomId}/${username}/before-messages`)
          .then((res) => {
            //console.log(res.data)
            const previousMessages = res.data;
            setMessages([...previousMessages, ...messages]);
          })
        }
      });
    }else{
      alert("유효하지 않은 접근입니다.")
      navigate("/")
    }

    //웹소켓 연결 해제
    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
      setConnected(false);
      //console.log('Disconnected');
    };
  }, [roomId, userState, userCheck]);

  
  //채팅방 나가기 버튼을 누르면 구독이 해제되고, 리스트로 돌아감.
  //유지하고싶으면 채팅방 화면에서 뒤로 가기 버튼 클릭
  const exit = () => {
    const confirmExit = window.confirm('채팅방을 나가면 채팅기록이 삭제됩니다.\n (채팅 내용을 유지하고싶으면 취소 후 뒤로 가기를 눌러주세요.)');
    if (confirmExit) {
      stompClient.send(publishUrl, {}, JSON.stringify({ 
        roomId: roomId,
        type: 'LEAVE',
        sender: username,
        createdTime: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
        locationX:nowLocation.latitude,
        locationY:nowLocation.longitude,
        message: username+'님이 퇴장했습니다.' }));
  
      stompClient.unsubscribe(subscribeUrl);
      setConnected(false);
      setStompClient(null);
      // 유저 리스트에서 해당 유저를 제거
      setUserList(userList.filter(user => user !== username));
      navigate('/chat/list');
    }
  }
  
  //캠핑장에 있는 유저 / 아닌 유저의 메세지를 구분하기 위해
  //메세지 전송 시 현재 위치와 메세지 정보를 담아 보낸다.
   const handleSend = () => {

    stompClient.send(publishUrl, {}, JSON.stringify({ 
      roomId: roomId,
      type: 'TALK',
      sender: username,
      createdTime: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      locationX:nowLocation.latitude,
      locationY:nowLocation.longitude,
      message: newMessage }));

    setNewMessage('');
  
};

return (
  <>
  <h1><strong>{roomInfo.roomName}</strong></h1>
  <div>
    <Button className="user-list" variant="primary" onClick={handleShow}>채팅방 참여 유저</Button>
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h2><strong>{roomInfo.roomName}</strong></h2></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ul>
          <br />
        <h3>참여 유저</h3>
          {userList.map((user, index) => ( 
            <li key={index}>
              {user.memberId}
            </li>
          ))}
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  </div>

    <div>
      {messages.map((msg, idx) => (
        <div key={idx} className={`chat-bubble ${msg.sender === username ? 'self' : 'others'}`}>
          <span>
            <strong>{msg.sender}</strong> {msg.nearOrNot && '⛺'}| {new Date(msg.createdTime).toLocaleString()}
          </span>
          <div className="bubble">
            <span>{msg.message}</span>
          </div>
        </div>
      ))}
      <div ref={messageEndRef}></div>
    </div>

    <div className="chat-input">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter'&&newMessage.trim() !== '') {
        handleSend();
      }
    }}
  />
  <button onClick={handleSend} disabled={newMessage.trim()===''}>Send</button>
</div>
    
    <button className="exit-button" onClick={exit}>채팅방 나가기</button>

</>
);
}

export default ChatRoom;
