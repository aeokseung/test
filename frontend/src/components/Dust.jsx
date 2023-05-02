import React, { useState } from "react";
import { Popover , OverlayTrigger} from 'react-bootstrap';
import ApiService from "../services/ApiService";
import notion from "../images/notion.png";
import finedust from "../images/dust/finedust.png";
import ultrafinedust from "../images/dust/ultrafinedust.png";
import useDidMountEffect from "../useDidMountEffect";

function Dust(props) {
    //마지막 데이터베이스에 찾아오는 지역 이름
    const [measuringStation, setMeasuringStation] = useState('');

    const [tmx,setTmx] = useState('');
    const [tmy,setTmy] = useState('');

    //현재 위치 가져와서 미세먼지 조회
    const [name, setName] = useState("--");
    const [pm10Value, setPm10Value] = useState("--");
    const [pm10Grade, setpm10Grade] = useState("--");
    const [pm25Value, setPm25Value] = useState("--");
    const [pm25Grade, setpm25Grade] = useState("--");

    //측정소 이름으로 미세먼지 데이터 조회
    useDidMountEffect(() => {
        ApiService.measuringStationSearch(measuringStation)
            .then((response) => {
                setName(props.stationName);
                setPm10Value(response.data[0].pm10Value);
                setPm25Value(response.data[0].pm25Value);
                switch(response.data[0].pm10Grade) {
                    case "1":
                        setpm10Grade("좋음");
                        break;
                    case "2":
                        setpm10Grade("보통");
                        break;
                    case "3":
                        setpm10Grade("나쁨");
                        break;
                    case "4":
                        setpm10Grade("매우나쁨");
                        break;
                    default:
                        setpm10Grade("통신오류");
                        break;
                }
                switch(response.data[0].pm25Grade) {
                    case "1":
                        setpm25Grade("좋음");
                        break;
                    case "2":
                        setpm25Grade("보통");
                        break;
                    case "3":
                        setpm25Grade("나쁨");
                        break;
                    case "4":
                        setpm25Grade("매우나쁨");
                        break;
                    default:
                        setpm25Grade("통신오류");
                        break;
                }
            }).catch(error => console.log("DB에서 데이터 가져오기 실패 " + error))
    },[measuringStation])

    //tmX, tmY 저장후 측정소 이름 조회
    useDidMountEffect(() => {
        ApiService.searchByTm(tmx,tmy)
            .then((response) => {
                setMeasuringStation(response.data.result.response.body.items[0].stationName)
            }).catch(error => console.log("근처 측정소 목록 조회 api 오류. " + error))
    },[tmx,tmy])

    //좌표를 가지고 TM_X TM_Y 좌표로 변환
    useDidMountEffect(() => {
        ApiService.converToTm(props.stationName)
            .then((response) => {
                //결과에서 현재 내 위치에 맞는 tmX, tmY 좌표를 선택(왜냐하면 같은 읍면동 이름을 같는 도시가 존재)
                if(response.data.result.response.body.items===[]){
                    alert("데이터가 없습니다.")
                } else {
                    for(let i=0; i<response.data.result.response.body.items.length; i++){
                        if(props.sggName==="") {
                            if((response.data.result.response.body.items[i].sidoName === props.sidoName) && (response.data.result.response.body.items[i].umdName === props.umdName)){
                                setTmx(response.data.result.response.body.items[i].tmX);
                                setTmy(response.data.result.response.body.items[i].tmY);
                                console.log("tmX,tmY 좌표변환 api 성공")
                            }
                        }else {
                            if((response.data.result.response.body.items[i].sidoName === props.sidoName) && (response.data.result.response.body.items[i].sggName === props.sggName) && (response.data.result.response.body.items[i].umdName === props.umdName)){
                                setTmx(response.data.result.response.body.items[i].tmX);
                                setTmy(response.data.result.response.body.items[i].tmY);
                                console.log("tmX,tmY 좌표변환 api 성공")
                            }
                        }
                    }
                }
            }).catch(error => console.log("tmX,tmY 좌표변환 api 오류. "+ error))
    },[props.stationName])

    return (
        <div>
            <div className="api_title">
                미세먼지·초미세먼지
                <span style={{margin: "0px 5px"}}>|</span>
                <span style={{marginRight: "10px", color: "#b6b6b6"}}>{name} 기준</span>
                <OverlayTrigger overlay={
                    <Popover id={`popover-positioned-top`}>
                        <Popover.Header as="h3">출처: 환경부/한국환경공단</Popover.Header>
                        <Popover.Body>
                        데이터는 <strong>실시간 관측된 자료</strong>이며 측정소 현지 사정이나 데이터의 수신상태에 따라 <strong>미수신</strong> 될 수 있습니다.
                        </Popover.Body>
                    </Popover>
                    }
                >
                    <img src={notion} alt="미세먼지 안내" width="30" height="30"/>
                </OverlayTrigger>
            </div>
            <div className="api_content" style={{display: "flex", flexDirection: "row"}}>
                <div
                    style={{display: "flex", width: "50%", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <img src={finedust} alt="미세먼지" width="55" height="55"/>
                    <span>{pm10Value}㎍/㎥</span>
                    <span style={{fontSize: "15px", margin: "2px 0px"}}>{pm10Grade}</span>
                </div>
                <div style={{border: "1px solid rgb(221, 221, 221)", backgroundColor: "rgb(221, 221, 221)"}}></div>
                <div
                    style={{display: "flex", width: "50%", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <img src={ultrafinedust} alt="초미세먼지" width="60" height="60"/>
                    <span>{pm25Value}㎍/㎥</span>
                    <span style={{fontSize: "15px", margin: "2px 0px"}}>{pm25Grade}</span>
                </div>
            </div>
        </div>
    )
}

export default Dust;