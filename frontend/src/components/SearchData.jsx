import React, {useEffect, useState} from 'react';
import axios from 'axios';
import InfoModal from "./InfoModal";
import {Button} from 'react-bootstrap';
import ApiService from "../services/ApiService";

function SearchData() {
    const [camping, setCamping] = useState([]);
    const [city, setCity] = useState("강원도");
    const [RoomCheckValue, setRoomCheckValue] = useState('');
    const [modalHandle,setModalHandle] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState('');

    const [isdistance, setIsdistance] = useState(false);
    const [campingName, setCampingName] = useState('');

    const handleCampingName = (e) => {
        setCampingName(e.target.value);
    };

    const handleSelectCity = (e) => {
        setCity(e.target.value);
    };

    //전체 캠핑장 조회 버튼을 클릭했을 때 실행되는 메서드
    const showAllList = () => {
        axios.get('/api/camping/showAllList')
            .then((response) => {
                setPage(1);
                setCamping(response.data);
                setIsdistance(false);
            }).catch(error => console.log("전체 캠핑장 조회 실패" + error))
    }

    //시별로 조회 버튼을 클릭했을 때 실행되는 메서드
    const SelectCity = () => {
        axios.get('api/camping/showList', {
            params: {
                city_name: city
            }
        })
            .then((response) => {
                setPage(1);
                setCamping(response.data);
                setIsdistance(false);
            }).catch(error => console.log("시별로 조회 실패 " + error))
    }

    //첫 랜더링시 거리별 조회 결과를 보여주는 함수
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            ApiService.calculationDistance(position.coords.latitude, position.coords.longitude)
                .then((response) => {
                    setPage(1);
                    setCamping(response.data);
                    setIsdistance(true);
                }).catch(error => console.log("거리별 캠핑장 조회 실패 " + error))
        })
    }, []);

    //거리별 캠핑장 조회 버튼을 클릭했을 때 실행되는 메서드
    const showDistanceList = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            ApiService.calculationDistance(position.coords.latitude, position.coords.longitude)
                .then((response) => {
                    setPage(1);
                    setCamping(response.data);
                    setIsdistance(true);
                }).catch(error => console.log("거리별 캠핑장 조회 실패 " + error))
        })
    }

    //캠핑장명 검색 버튼을 클릭했을 때 실행되는 메서드
    const showByCampingName = () => {
        if (campingName === '') {
            alert("캠핑장명을 입력해주세요")
        } else {
            axios
                .get("/api/camping/showCampingList", {
                    params: {
                        camping_name: campingName
                    }
                })
                .then((response) => {
                    setPage(1);
                    setCamping(response.data);
                    setIsdistance(false);
                }).catch(error => console.log("캠핑장 이름으로 조회 실패 " + error))
        }
    }
     
    const RoomChecking = (name) => {
        return axios.get(`/api/chat/room/exist/${name}`)
        .then((result) => {
            return result.data // 'roomId'
          })
            .catch((err)=> {
                console.error(err);
            });
    }
    
    const openModal = (name, address, latitude, longitude) => {
        RoomChecking(name) //비동기적 함수이기에 check에 값이 들어가기 전에 다른 데이터들이 모달창에 넘어가면 안되므로 잠시 대기
          .then((check) => {
            setSelectedInfo({
              campingName: name, 
              campingAddress: address, 
              campingCoordinateX: latitude, 
              campingCoordinateY: longitude,
              roomId: check // Promise 객체에서 추출한 값을 전달
            });
            setModalHandle(true);
          })
          .catch((error) => console.error(error));
      };
      
    //페이지 인덱싱 처리를 위한 변수
    const [page, setPage] = useState(1);

    //페이지 이전 버튼
    const handleNextPage = () => {
        setPage(page + 1);
    };

    //페이지 다음 버튼
    const handlePrevPage = () => {
        setPage(page - 1);
    };
    const itemsPerPage = 10;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = camping.slice(startIdx, endIdx);

    return (
        <div style={{marginLeft: "100px"}}>
                <div className="mb-3 search">
                    <Button type="button" onClick={showAllList} style={{width: "160px", fontSize:"20px", marginBottom: "10px"}}>
                        전체 캠핑장 조회
                    </Button><br/>
                    <Button type="button" onClick={showDistanceList} style={{width: "180px", fontSize:"20px", marginBottom: "10px", marginLeft: "30px"}}>
                        거리별 캠핑장 조회
                    </Button><br/>
                    <div style={{display: "flex", marginLeft: "100px"}}>
                        <table>
                            <tbody>
                            <td>
                                <select className="form-control" style={{width: "140px", fontSize:"20px", marginBottom: "10px"}} onChange={handleSelectCity}>
                                    <option value="강원도">강원도</option>
                                    <option value="경기도">경기도</option>
                                    <option value="경상북도">경상북도</option>
                                    <option value="경상남도">경상남도</option>
                                    <option value="광주광역시">광주광역시</option>
                                    <option value="대구광역시">대구광역시</option>
                                    <option value="대전광역시">대전광역시</option>
                                    <option value="부산광역시">부산광역시</option>
                                    <option value="서울특별시">서울특별시</option>
                                    <option value="세종특별자치시">세종특별자치시</option>
                                    <option value="울산광역시">울산광역시</option>
                                    <option value="인천광역시">인천광역시</option>
                                    <option value="전라북도">전라북도</option>
                                    <option value="전라남도">전라남도</option>
                                    <option value="제주특별자치도">제주특별자치도</option>
                                    <option value="충청북도">충청북도</option>
                                    <option value="충청남도">충청남도</option>
                                </select>
                            </td>
                            </tbody>
                        </table>
                        <Button type="button" onClick={SelectCity} style={{width: "170px",fontSize:"20px", marginBottom: "10px",marginLeft: "20px"}}>
                            시별로 조회
                        </Button>
                    </div>
                </div>
                <div className="mb-3 search">
                    <input type="text" value={campingName} placeholder="캠핑장명" onChange={handleCampingName} minLength={2} maxLength={16} style={{width: "140px", padding: "6px 12px 6px 12px", marginLeft:"470px"}}/>
                    <Button type="button" onClick={showByCampingName} style={{width: "170px",fontSize:"20px", marginLeft: "20px"}}>
                        캠핑장명 검색
                    </Button>
                </div>

            {isdistance ?
                <div>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>거리</th>
                            <th>주소</th>
                            <th>이름</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(
                            prop =>
                                    <tr className="searchData" key={prop.id} onClick = {() => openModal(prop.name, prop.address, prop.latitude, prop.longitude)}>
                                        <td>{prop.distance.toFixed(2)}(km)</td>
                                        <td>{prop.address}</td>
                                        <td>{prop.name}</td>
                                    </tr>
                        )}
                        </tbody>
                    </table>
                    <button className="btn btn-outline-primary me-2" onClick={handlePrevPage} disabled={page === 1}>
                        이전
                    </button>
                    <button className="btn btn-outline-primary me-2" style={{float: "right"}} onClick={handleNextPage} disabled={endIdx >= camping.length}>
                        다음
                    </button>
                </div>
                :
                <div>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>주소</th>
                            <th>이름</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(
                            prop =>
                                <tr className="searchData" key={prop.id} onClick = {() => openModal(prop.name, prop.address, prop.latitude, prop.longitude)}>
                                    <td>{prop.address}</td>
                                    <td>{prop.name}</td>
                                </tr>
                        )}
                        </tbody>
                    </table>
                    <button className="btn btn-primary me-2" onClick={handlePrevPage} disabled={page === 1}>
                        이전
                    </button>
                    <button className="btn btn-primary me-2" style={{float: "right"}} onClick={handleNextPage} disabled={endIdx >= camping.length}>
                        다음
                    </button>
                </div>}
            {
                modalHandle && <InfoModal info={selectedInfo} show={modalHandle} handleClose={() => setModalHandle(false)} />

            }
        </div>
    )
}
export default SearchData;
