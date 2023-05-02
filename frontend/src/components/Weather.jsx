import React, { useState } from 'react';
import ApiService from "../services/ApiService";
import locationImage from "../images/location.gif"
import sunny from "../images/weather/sunny.gif";
import manycloud from "../images/weather/manycloud.gif";
import cloud from "../images/weather/cloud.gif"
import snow from "../images/weather/snow.gif"
import snowrain from "../images/weather/snowrain.gif"
import shower from "../images/weather/shower.gif"
import rain from "../images/weather/rain.gif"
import useDidMountEffect from "../useDidMountEffect";

function Weather(props) {
    //현재 시간 날씨 예보에 쓰이는 변수
    const [weatherData, setWeatherData] = useState({
        TMP: "0", // 1시간 기온 (℃)
        TMN: "0.0", // 일 최저기온 (℃)
        TMX: "0.0", // 일 최고기온 (℃)
        REH: "00", // 습도 (%)
        POP: "00", // 강수확률 (%)
        SKY: "", // 하늘상태 맑음(1), 구름많음(3), 흐림(4)
        PTY: "", // 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
        today: "00", // 오늘 날짜
        image: null // 이미지
    });

    //2일간 날씨 예보에 쓰이는 변수
    const [twoDaysWeatherData, setTwoDaysWeatherData] = useState({
        todayData: null, // 오늘 데이터
        tomorrowData: null, // 내일 데이터
        istoday: "오늘 날씨",
        todayImageData: null, // 오늘 날씨 이미지
        tomorrowImageData: null // 내일 날씨 이미지
    });

    // api 요청에 보낼 경도 위도
    const [coordinate, setCoordinate] = useState('');

    const hours = ["0000", "0100", "0200", "0300", "0400", "0500", "0600", "0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300"];

    const changeData = () => {
        if (twoDaysWeatherData.istoday==="오늘 날씨") {
            setTwoDaysWeatherData(prevState => ({...prevState, istoday: "내일 날씨"}))
        } else {
            setTwoDaysWeatherData(prevState => ({...prevState, istoday: "오늘 날씨"}))
        }
    }

    useDidMountEffect(() => {
        ApiService.weather(coordinate.x,coordinate.y).then((response) => {
            //현재 시간 날씨 예보에 쓰이는 변수 설정
            setWeatherData(prevState => ({...prevState, TMP: response.data.TMP}))
            setWeatherData(prevState => ({...prevState, TMN: response.data.TMN}))
            setWeatherData(prevState => ({...prevState, TMX: response.data.TMX}))
            setWeatherData(prevState => ({...prevState, REH: response.data.REH}))
            setWeatherData(prevState => ({...prevState, POP: response.data.POP}))
            setWeatherData(prevState => ({...prevState, TMP: response.data.TMP}))
            setWeatherData(prevState => ({...prevState, today: response.data.todayTime}))

            if(response.data.SKY==="1") {
                setWeatherData(prevState => ({...prevState, SKY: "맑음"}))
            } else if(response.data.SKY==="3") {
                setWeatherData(prevState => ({...prevState, SKY: "구름많음"}))
            } else if(response.data.SKY==="4") {
                setWeatherData(prevState => ({...prevState, SKY: "흐림"}))
            }

            if(response.data.PTY==="0") {
                if(response.data.SKY==="1") {
                    setWeatherData(prevState => ({...prevState, image: sunny}))
                } else if(response.data.SKY==="3") {
                    setWeatherData(prevState => ({...prevState, image: cloud}))
                } else if(response.data.SKY==="4") {
                    setWeatherData(prevState => ({...prevState, image: manycloud}))
                }
            } else if(response.data.PTY==="1") {
                setWeatherData(prevState => ({...prevState, image: rain}))
                setWeatherData(prevState => ({...prevState, PTY: "비"}))
            } else if(response.data.PTY==="2") {
                setWeatherData(prevState => ({...prevState, image: snowrain}))
                setWeatherData(prevState => ({...prevState, PTY: "비/눈"}))
            }else if(response.data.PTY==="3") {
                setWeatherData(prevState => ({...prevState, image: snow}))
                setWeatherData(prevState => ({...prevState, PTY: "눈"}))
            }else if(response.data.PTY==="4") {
                setWeatherData(prevState => ({...prevState, image: shower}))
                setWeatherData(prevState => ({...prevState, PTY: "소나기"}))
            }

            //2일간 날씨 예보에 쓰이는 변수 설정
            setTwoDaysWeatherData(prevState => ({...prevState, todayData: response.data.Today}))
            setTwoDaysWeatherData(prevState => ({...prevState, tomorrowData: response.data.Tomorrow}))

            const TodayImages = hours.map((hour) => {
                const hourData = response.data.Today[hour];
                const { PTY, SKY } = hourData;

                if (PTY === "0") {
                    if (SKY === "1") {
                        return sunny;
                    } else if (SKY === "3") {
                        return cloud;
                    } else if (SKY === "4") {
                        return manycloud;
                    }
                } else if (PTY === "1") {
                    return rain;
                } else if (PTY === "2") {
                    return snowrain;
                } else if (PTY === "3") {
                    return snow;
                } else if (PTY === "4") {
                    return shower;
                } else {
                    return null;
                }
            });
            setTwoDaysWeatherData(prevState => ({...prevState, todayImageData: TodayImages}))

            const TomorrowImages = hours.map((hour) => {
                const hourData = response.data.Tomorrow[hour];
                const { PTY, SKY } = hourData;

                if (PTY === "0") {
                    if (SKY === "1") {
                        return sunny;
                    } else if (SKY === "3") {
                        return cloud;
                    } else if (SKY === "4") {
                        return manycloud;
                    }
                } else if (PTY === "1") {
                    return rain;
                } else if (PTY === "2") {
                    return snowrain;
                } else if (PTY === "3") {
                    return snow;
                } else if (PTY === "4") {
                    return shower;
                } else {
                    return null;
                }
            });
            setTwoDaysWeatherData(prevState => ({...prevState, tomorrowImageData: TomorrowImages}))
        }).catch(error => console.log("날씨 API 요청 실패 " + error))
    }, [coordinate.x,coordinate.y])

    useDidMountEffect(() => {
        setCoordinate(ApiService.dfs_xy_conv("toXY",props.location.latitude,props.location.longitude))
    }, [props])

    return (
        <div className="api_content" >
            {/*현재 시간 날씨 예보*/}
            <div style={{display: "flex", height: "80px"}}>
                <span style={{fontSize: "60px"}}>{weatherData.TMP}°</span>
                <div style={{width: "70px", fontSize: "16px", marginTop: "40px"}}>
                    <span style={{color: "blue", fontSize: "16px"}}>{weatherData.TMN}°</span>
                    <span>/ </span>
                    <span style={{color: "red", fontSize: "20px"}}>{weatherData.TMX}°</span>
                </div>
                <div style={{width: "150px"}}><img src={weatherData.image} alt="날씨" width="80" height="80" style={{float: "right"}}/></div>
            </div>
            <div style={{height: "20px", fontSize: "16px"}}>
                <div>{weatherData.SKY} {weatherData.PTY}</div>
            </div>
            <div style={{margin: "5px 0px"}}>
                <span>습도: {weatherData.REH}% / </span>
                <span>강수확률: {weatherData.POP}%</span>
            </div>
            <span>{weatherData.today}</span>
            <div style={{display: "flex"}}>
                <img src={locationImage} alt="장소" width="40" height="40"/>
                <div style={{height: "40px", lineHeight: "50px"}}>{props.addressName}</div>
            </div>

            {/*오늘 내일 날씨 예보*/}
            <div style={{textAlign: "center"}}>
                <input type="button" className="changebutton" onClick={changeData} value={twoDaysWeatherData.istoday}/>
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide" style={{height: "180px"}}>
                            <div className="weather_graph_out">
                                <div className="weather_graph_in">
                                    {
                                        (twoDaysWeatherData.istoday === "오늘 날씨" && twoDaysWeatherData.todayData !== null) ? hours.map((hour, index)=> (
                                                <div key={index} className="weather_graph_box"><span style={{fontSize: "25px"}}>{twoDaysWeatherData.todayData[hour]["TMP"]}°</span>
                                                    <div><img src={twoDaysWeatherData.todayImageData[index]} alt="날씨" width="25" height="25"/></div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>강수확률</div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>{twoDaysWeatherData.todayData[hour]["POP"]}%</div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>{hour.substr(0, 2)}:00</div>
                                                </div>
                                            )) : <div></div>
                                    }
                                    {
                                        (twoDaysWeatherData.istoday === "내일 날씨" && twoDaysWeatherData.tomorrowData !== null) ? hours.map((hour, index)=> (
                                                <div key={index} className="weather_graph_box"><span style={{fontSize: "25px"}}>{twoDaysWeatherData.tomorrowData[hour]["TMP"]}°</span>
                                                    <div><img src={twoDaysWeatherData.tomorrowImageData[index]} alt="날씨" width="25" height="25"/></div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>강수확률</div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>{twoDaysWeatherData.tomorrowData[hour]["POP"]}%</div>
                                                    <div style={{width: "40px", marginTop: "5px"}}>{hour.substr(0, 2)}:00</div>
                                                </div>
                                            )) : <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Weather;