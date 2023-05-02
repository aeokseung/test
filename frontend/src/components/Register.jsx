import { React, useState } from "react";
import axios from "axios";
import "../styles/Register.css";

function Register() {
    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [inputPw2, setInputPw2] = useState("");
    const [inputNn, setInputNn] = useState("");

    // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    const handleInputId = (e) => {
        setInputId(e.target.value);
    };

    const handleInputPw = (e) => {
        setInputPw(e.target.value);
    };

    const handleInputPw2 = (e) => {
        setInputPw2(e.target.value);
    };

    const handleInputNn = (e) => {
        setInputNn(e.target.value);
    };

    const axiosBody = {
        username:inputId,
        password:inputPw,
        nickname:inputNn
    }

    // register 버튼 클릭 이벤트
    const RegisterCheck = () => {
        //axios.post('url','body 자리', callback함수)
        //요청 url에서 bodyparser 설정 후 req.body로 읽을 수 있음
        axios
            .post("/api/join", axiosBody)
            .then((res) => {
                if(res.data==="회원가입 완료"){
                    alert("회원가입 성공");
                    document.location.href = "/";
                } else if (res.data==="이미 가입된 회원입니다."){
                    alert("이미 가입된 회원입니다.");
                }  else if (res.data==="중복된 닉네임 입니다."){
                    alert("중복된 닉네임 입니다.");
                }
            })
            .catch(error => alert("회원가입 실패"))
    };
    function checkAll() {
        if (!CheckUserId(inputId)) {
            return false;
        }
        if (!CheckNickname(inputNn)) {
            return false;
        }
        if (!CheckPassword(inputPw)) {
            return false;
        }
        if (!CheckPassword(inputPw2)) {
            return false;
        }
        if (!CheckSamePassword(inputPw,inputPw2)) {
            return false;
        }

        RegisterCheck();
    }

    // 공백확인 함수
    function checkExistData(value, dataName) {
        if (value === "") {
            alert(dataName + " 입력해주세요!");
            return false;
        }
        return true;
    }

    function CheckUserId(id) {
        //Id가 입력되었는지 확인하기
        if (!checkExistData(id, "아이디를")) return false;

        var idRegExp = /^[a-zA-z0-9]{2,16}$/; //아이디 유효성 검사
        var chk_eng = id.search(/[a-z]/ig);

        if (!idRegExp.test(id)) {
            alert("아이디는 영문 대소문자와 숫자 2 ~ 16자리로 입력해야합니다!");
            return false;
        }
        if(chk_eng<0){
            alert("아이디는 1개 이상의 영문자를 포함하여야 합니다.");
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

    function CheckSamePassword(password,password2) {
        if (password !== password2) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }
        return true; //확인이 완료되었을 때
    }

    return (
        <body className="text-center">
        <main className="form-signin w-100 m-auto">
            <form>
                <h1 className="h3 mb-3 fw-normal">회원가입</h1>
                <div className="form-floating">
                    <input
                        type="text"
                        name="input_id"
                        value={inputId}
                        className="form-control"
                        placeholder="ID"
                        onChange={handleInputId}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <label>ID</label>
                </div>
                <div className="form-floating">
                    <input
                        type="text"
                        name="input_Nn"
                        value={inputNn}
                        className="form-control"
                        placeholder="Nickname"
                        onChange={handleInputNn}
                        minLength={2}
                        maxLength={6}
                        required
                    />
                    <label>Nickname</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        name="input_pw"
                        value={inputPw}
                        className="form-control"
                        placeholder="Password"
                        onChange={handleInputPw}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <label>Password</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        name="input_pw2"
                        value={inputPw2}
                        className="form-control password2"
                        placeholder="Password verification"
                        onChange={handleInputPw2}
                        minLength={2}
                        maxLength={16}
                        required
                    />
                    <label>Password verification</label>
                </div>

                <button
                    className="w-100 btn loginBtn btn-lg btn-primary"
                    type="button"
                    onClick={checkAll}
                >
                    Sign in
                </button>
            </form>
        </main>
        </body>
    );
}

export default Register;