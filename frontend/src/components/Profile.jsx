import {React, useEffect, useState} from "react";
import axios from "axios";
import "../styles/Profile.css";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/user";
import { tokenState } from "../recoil/token";
import {useNavigate} from "react-router-dom";

function Profile() {
    const [token,setToken] = useRecoilState(tokenState);
    const [user,setUser] = useRecoilState(userState);
    const [username,setUsername]= useState(null);
    const [nickname,setNickname]= useState(null);
    const navigate = useNavigate();

    const [passwordisEditing, setPasswordIsEditing] = useState(false);
    const [nicknameisEditing, setNicknameIsEditing] = useState(false);

    const [inputPw, setInputPw] = useState("");
    const [inputPw1, setInputPw1] = useState("");
    const [inputPw2, setInputPw2] = useState("");
    const [inputNn1, setInputNn1] = useState("");

    useEffect(() => {
        if(user) {
            setUsername(user.username);
            setNickname(user.nickname);
        } else {
            setUsername('');
        }
    }, [user]);

    useEffect(() => {
        (
            axios.get("/api/user", {
                headers:{
                    Authorization: token
                }
            })
                .catch((error) => {
                    // alert("로그인이 필요합니다");
                    navigate('/');
                })
        )
    }, [token])

    const handleInputPw = (e) => {
        setInputPw(e.target.value);
    };

    const handleInputPw1 = (e) => {
        setInputPw1(e.target.value);
    };

    const handleInputPw2 = (e) => {
        setInputPw2(e.target.value);
    };

    const handleInputNn1 = (e) => {
        setInputNn1(e.target.value);
    };

    const axiosConfig = {
        headers:{
            Authorization: token
        }
    }
    const axiosBody = {
        username: username,
        password: inputPw,
        nickname: nickname,
        upadate_password: inputPw1,
        upadate_nickname: inputNn1
    }

    const axiosBody2 = {
        username: username
    }

    //회원 탈퇴 구현
    const unRegister = () => {
        if(window.confirm("정말로 회원 탈퇴 하시겠습니까?\n탈퇴된 계정은 복구 할 수 없습니다.")) {
            axios
                .delete("/api/user/delete", axiosBody2, axiosConfig)
                .then((res) => {
                    if(res.data === "회원 탈퇴 성공"){
                        setToken(null);
                        setUser(null);
                        alert("회원 탈퇴 완료");
                        navigate("/");
                    }
                    if(res.data==="잘못된 접근입니다"){
                        alert("잘못된 접근입니다");
                    }
                })
                .catch(error => alert("회원 탈퇴 실패"))
        }
    };
    const UpdatePasswordCheck = () => {
        axios
            .put("/api/user/updatePassword", axiosBody, axiosConfig)
            .then((res) => {
                if(res.data==="비밀번호 수정 완료"){
                    setToken(null);
                    setUser(null);
                    navigate("/");
                    alert("비밀번호 수정 완료. 다시 로그인 해주세요");
                }
                if(res.data==="잘못된 접근입니다"){
                    alert("잘못된 접근입니다");
                }
                if(res.data==="기존 비밀번호를 확인하세요"){
                    alert("기존 비밀번호를 확인하세요");
                }
            })
            .catch(error => alert("비밀번호 수정 실패"))
    };

    const UpdateNicknameCheck = () => {
        axios
            .put("/api/user/updateNickname", axiosBody, axiosConfig)
            .then((res) => {
                if(res.data==="닉네임 수정 완료"){
                    setToken(null);
                    setUser(null);
                    navigate("/");
                    alert("닉네임 수정 완료. 다시 로그인 해주세요");
                }
                if(res.data==="이미 존재하는 닉네임 입니다"){
                    alert("이미 존재하는 닉네임 입니다");
                }
            })
            .catch(error => alert("닉네임 수정 실패"))
    };

    function UpdatePasswordcheckAll() {
        if (!CheckPassword(inputPw)) {
            return false;
        }
        if (!CheckPassword(inputPw2)) {
            return false;
        }
        if (!CheckSamePassword(inputPw1,inputPw2)) {
            return false;
        }

        UpdatePasswordCheck();
    }

    function UpdateNicknamecheckAll() {
        if (!CheckNickname(inputNn1)) {
            return false;
        }

        UpdateNicknameCheck();
    }

    // 공백확인 함수
    function checkExistData(value, dataName) {
        if (value === "") {
            alert(dataName + " 입력해주세요!");
            return false;
        }
        return true;
    }

    function CheckPassword(password) {
        ///비밀번호가 입력되었는지 확인하기
        if (!checkExistData(password, "비밀번호를")) return false;

        var passwordRegExp = /^[a-zA-Z0-9]{8,20}$/ //비밀번호 유효성 검사
        var chk_num = password.search(/[0-9]/g);
        var chk_eng = password.search(/[a-z]/ig);

        if(!passwordRegExp.test(password)){
            alert("비밀번호는 숫자와 영문자 조합으로 8~20자리를 사용해야 합니다.");
            return false;
        }
        if(chk_num<0 || chk_eng<0){
            alert("비밀번호는 숫자와 영문자를 혼용하여야 합니다.");
            return false;
        }
        if(/(\w)\1\1\1/.test(password)){
            alert("비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다.");
            return false;
        }
        return true; //확인이 완료되었을 때
    }

    function CheckSamePassword(password1,password2) {
        if (password1 !== password2) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }
        return true; //확인이 완료되었을 때
    }

    function CheckNickname(nickname) {
        //닉네임이 입력되었는지 확인하기
        if (!checkExistData(nickname, "닉네임을")) return false;

        var nicknameRegExp = /^[가-힣a-z0-9-_]{2,10}$/; //닉네임 유효성 검사

        if (!nicknameRegExp.test(nickname)) {
            alert("닉네임은 특수문자와 초성을 제외한 2~10자리여야 합니다.");
            return false;
        }
        return true; //확인이 완료되었을 때
    }

    const passwordStartEditingHandler = () => {
        if (nicknameisEditing === true) {
            setNicknameIsEditing(false);
        }
        setPasswordIsEditing(true);
    };

    const passwordEndEditingHandler = () => {
        UpdatePasswordcheckAll();
        setPasswordIsEditing(false);
    };

    const passwordEditingCancleHandler = () => {
        setPasswordIsEditing(false);
    };

    const nicknameStartEditingHandler = () => {
        if (passwordisEditing === true) {
            setPasswordIsEditing(false);
        }
        setNicknameIsEditing(true);
    };

    const nicknameEndEditingHandler = () => {
        UpdateNicknamecheckAll();
        setNicknameIsEditing(false);
    };
    const nicknameEditingCancleHandler = () => {
        setNicknameIsEditing(false);
    };

    return (
        <div>
            <div>
                <h2 className="text-center" style={{marginBottom: "30px"}}>프로필</h2>
            </div>
            {passwordisEditing ? (
                <div className="profile_content" style={{float:"none", margin:"0 auto"}}>
                    기존 비밀번호:
                    <input
                        className="inputbox"
                        type="password"
                        name="existing_password"
                        value={inputPw}
                        placeholder="기존 비밀번호를 입력하세요"
                        onChange={handleInputPw}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <br />
                    비밀번호 변경:
                    <input
                        className="inputbox"
                        type="password"
                        name="modified_password"
                        value={inputPw1}
                        placeholder="변경할 비밀번호를 입력하세요"
                        onChange={handleInputPw1}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <br />
                    비밀번호 확인:
                    <input
                        className="inputbox"
                        type="password"
                        name="modified_password2"
                        value={inputPw2}
                        placeholder="변경할 비밀번호를 입력하세요"
                        onChange={handleInputPw2}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <br />
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-danger"
                        onClick={passwordEditingCancleHandler}
                    >
                        비밀번호 변경취소
                    </button>
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-success"
                        onClick={passwordEndEditingHandler}
                    >
                        비밀번호 변경완료
                    </button>
                    <br />
                </div>
            ) : (
                <div>
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-primary"
                        onClick={passwordStartEditingHandler}
                    >
                        비밀번호 변경
                    </button>
                    <br />
                </div>
            )}
            {nicknameisEditing ? (
                <div className="profile_content" style={{float:"none", margin:"50px auto"}}>
                    기존 닉네임: {user.nickname}
                    <br />
                    닉네임 변경:
                    <input
                        className="inputbox"
                        type="text"
                        name="modified_nickname"
                        value={inputNn1}
                        placeholder="변경할 닉네임을 입력하세요"
                        onChange={handleInputNn1}
                        minLength={2}
                        maxLength={6}
                        required
                    />
                    <br />
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-danger"
                        onClick={nicknameEditingCancleHandler}
                    >
                        닉네임 변경취소
                    </button>
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-success"
                        onClick={nicknameEndEditingHandler}
                    >
                        닉네임 변경완료
                    </button>
                    <br />
                </div>
            ) : (
                <div>
                    <button
                        type="button"
                        className="w-100 btn loginBtn btn-lg btn-primary"
                        onClick={nicknameStartEditingHandler}
                    >
                        닉네임 변경
                    </button>
                    <br />
                </div>
            )}
            <button
                type="button"
                className="w-100 btn loginBtn btn-lg btn-primary"
                onClick={unRegister}
            >
                회원 탈퇴
            </button>
        </div>
    );
}

export default Profile;
