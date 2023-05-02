import {React, useState, useEffect}from 'react';
import camping from '../images/camping.png';
import axios from "axios";
import {useRecoilState} from "recoil";
import { tokenState } from "../recoil/token";
import { useNavigate } from "react-router-dom";
import {userState} from "../recoil/user";
import "../styles/Header.css";
import profile from "../images/profile.png";

function HeaderComponent() {
    const [token,setToken] = useRecoilState(tokenState);
    const [user,setUser] = useRecoilState(userState);

    /**바로 user.nickname을 사용하면 로그인시 값이 들어오기전에 HeaderComponent에서 user.nickname을 참조해서 오류 발생
    따라서 token을 인식하는 useEffect를 사용해서 nickname에 user.nickname을 넣어준다.*/
    const [nickname,setNickname] = useState('');
    const navigate = useNavigate();

    const logout = () => {
        setToken(null);
        setUser(null);
        navigate("/");
        alert("로그아웃 성공");
    }

    useEffect(() => {
        if(user) {
            setNickname(user.nickname);
        } else {
            setNickname('');
        }
    }, [user]);

    const goProfile = () => {
        axios.get("/api/user", {
            headers:{
                Authorization: token
            }
        })
            .then((res) => {
                navigate('/profile');
            })
            .catch(error => alert("로그인이 필요합니다"));
    };

    return (
        <div className="container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div className="main_title">
                    <a href="/" className="nav-link px-2" style={{fontSize: "40px", lineHeight: "40px"}}>
                        <img src={camping} alt="logo" />
                        <span style={{marginLeft: "20px"}}>Meta Camping</span>
                    </a>
                </div>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 nav-custom">
                    <li><button className="nav-link px-2 link-secondary nav-custom" onClick={()=>navigate("/") } >Home</button></li>
                    <li><button className="nav-link px-2 link-dark nav-custom"  onClick={()=>navigate("/chat/list")} >Chatting</button></li>
                    <li><button className="nav-link px-2 link-dark nav-custom" onClick={()=>navigate("/board")} >Notice</button></li>
                    <li><button className="nav-link px-2 link-dark nav-custom" onClick={()=>navigate("/about")} >About</button></li>
                </ul>

                <div className="col-md-3 text-end" >
                    {!token ?
                        <a href="/login" className="btn btn-outline-primary me-2">Login</a>
                    :   <>
                        <span className="profile_content" style={{marginRight: "5px"}}>{nickname}</span>
                        <button className="nav-custom" style={{marginRight: "10px"}} onClick={goProfile} ><img src={profile} width="30" height="30"/></button>
                        <button className="btn btn-outline-primary me-2" onClick={logout}>Logout</button>
                        </>
                        }
                    <a href="/register" className="btn btn-primary">Sign-up</a>
                </div>
            </header>
        </div>
    )
}

export default HeaderComponent;