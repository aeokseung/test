import axios from 'axios';

// LCC DFS 좌표변환을 위한 기초 자료
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)
class ApiService {
    //날씨 open API-위도 경도를 사용해서 날씨 데이터 return
    weather(x,y) {
        return axios.get('/api/weatherforecast', {
            params: {
                coordinate_x: x,
                coordinate_y: y
            }
        })
    }

    //미세먼지 open API-근처 측정소 이름을 DB에서 검색해서 미세먼지 데이터 return
    measuringStationSearch(measuringStation) {
        return axios.get('/api/dust/searchStation', {
            params: {
                station_name: measuringStation
            }
        })
    }

    //미세먼지 open API-tm좌표를 사용해서 근처 측정소 return
    searchByTm(tmx,tmy) {
        return axios.get('/api/dust/search/measuringstation', {
            params: {
                tmX: tmx,
                tmY: tmy
            }
        })
    }

    //미세먼지 open API-읍면동이름을 사용해서 tm좌표로 변환
    converToTm(stationName) {
        return axios.get('/api/dust/convert', {
            params: {
                station_name: stationName
            }
        })
    }

    //현재위치와 캠핑장 위치의 위도 경도를 가지고 거리순으로 캠핑장 데이터를 return
    calculationDistance(currentX,currentY) {
        return axios.get('/api/camping/calculate', {
            params: {
                latitude: currentX,
                longitude: currentY,
            }
        })
    }

    //날씨 open API를 사용하기 위한 좌표계 변환
    dfs_xy_conv(code, v1, v2) {
        const DEGRAD = Math.PI / 180.0;
        const RADDEG = 180.0 / Math.PI;

        const re = RE / GRID;
        const slat1 = SLAT1 * DEGRAD;
        const slat2 = SLAT2 * DEGRAD;
        const olon = OLON * DEGRAD;
        const olat = OLAT * DEGRAD;

        let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        const rs = {};
        if (code === "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            var theta = v2 * DEGRAD - olon;
            if (theta > Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        }
        else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) {
                ra = - ra;
            }
            var alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            }
            else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI * 0.5;
                    if (xn < 0.0) {
                        theta = -theta;
                    }
                }
                else theta = Math.atan2(xn, yn);
            }
            var alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }

    //읍면동 이름때문에 미세먼지 데이터 안나오는 오류를 해결하기 위한 예외 처리
    AdressException(sidoName,stationName,umdName,sggName) {
        const locationData = {
            sidoName: sidoName,
            stationName: stationName,
            umdName: umdName,
            sggName: sggName
        }

        switch (sidoName) {
            case "충청북도":
                switch (stationName) {
                    case "중앙탑면":
                        locationData.stationName = "가금면";
                        locationData.umdName = "가금면";
                        break;
                    case "대소원면":
                        locationData.stationName = "이류면";
                        locationData.umdName = "이류면";
                        break;
                    case "장안면":
                        locationData.stationName = "외속리면";
                        locationData.umdName = "외속리면";
                        break;
                    case "속리산면":
                        locationData.stationName = "내속리면";
                        locationData.umdName = "내속리면";
                        break;
                }
                break;

            case "충청남도":
                switch (stationName) {
                    case "홍북읍":
                        locationData.stationName = "홍북면";
                        locationData.umdName = "홍북면";
                        break;
                    case "서부면":
                        locationData.stationName = "결성면";
                        locationData.umdName = "결성면";
                        break;
                    case "배방읍":
                        locationData.stationName = "배방면";
                        locationData.umdName = "배방면";
                        break;
                    case "성거읍":
                    case "안서동":
                    case "수신면":
                    case "북면":
                    case "병천면":
                    case "목천읍":
                    case "광덕면":
                        locationData.sggName = "천안시";
                        break;
                }
                break;

            case "전라남도":
                switch (stationName) {
                    case "금산면":
                        locationData.stationName = "도양읍";
                        locationData.umdName = "도양읍";
                        break;
                    case "가사문학면":
                        locationData.stationName = "남면";
                        locationData.umdName = "남면";
                        break;
                    case "압해읍":
                        locationData.stationName = "압해면";
                        locationData.umdName = "압해면";
                        break;
                    case "백아면":
                        locationData.stationName = "북면";
                        locationData.umdName = "북면";
                        break;
                }
                break;

            case "서울특별시":
                switch (stationName) {
                    case "진관동":
                        locationData.stationName = "진관내동";
                        locationData.umdName = "진관내동";
                        break;
                }
                break;

            case "부산광역시":
                switch (stationName) {
                    case "일광읍":
                        locationData.stationName = "일광면";
                        locationData.umdName = "일광면";
                        break;
                    case "정관읍":
                        locationData.stationName = "정관면";
                        locationData.umdName = "정관면";
                        break;
                }
                break;

            case "대구광역시":
                switch (stationName) {
                    case "옥포읍":
                        locationData.stationName = "옥포면";
                        locationData.umdName = "옥포면";
                        break;
                    case "유가읍":
                        locationData.stationName = "유가면";
                        locationData.umdName = "유가면";
                        break;
                }
                break;

            case "경상남도":
                switch (stationName) {
                    case "수월동":
                        locationData.stationName = "신현읍";
                        locationData.umdName = "신현읍";
                        break;
                    case "용당동":
                    case "소주동":
                        locationData.stationName = "웅상읍";
                        locationData.umdName = "웅상읍";
                        break;
                }
                break;

            case "경상북도":
                switch (stationName) {
                    case "문무대왕면":
                        locationData.stationName = "양북면";
                        locationData.umdName = "양북면";
                        break;
                    case "대가야읍":
                        locationData.stationName = "고령읍";
                        locationData.umdName = "고령읍";
                        break;
                    case "삼국유사면":
                        locationData.stationName = "고로면";
                        locationData.umdName = "고로면";
                        break;
                    case "문무대왕면":
                        locationData.stationName = "양북면";
                        locationData.umdName = "양북면";
                        break;
                    case "신녕면":
                        locationData.stationName = "신령면";
                        locationData.umdName = "신령면";
                        break;
                    case "금강송면":
                        locationData.stationName = "서면";
                        locationData.umdName = "서면";
                        break;
                    case "동명면":
                        locationData.stationName = "가산면";
                        locationData.umdName = "가산면";
                        break;
                    case "호미곶면":
                        locationData.stationName = "대보면";
                        locationData.umdName = "대보면";
                        break;
                }
                break;

            case "경기도":
                switch (stationName) {
                    case "조종면":
                        locationData.stationName = "하면";
                        locationData.umdName = "하면";
                        break;
                    case "곤지암읍":
                        locationData.stationName = "실촌읍";
                        locationData.umdName = "실촌읍";
                        break;
                    case "남한산성면":
                        locationData.stationName = "중부면";
                        locationData.umdName = "중부면";
                        break;
                    case "문무대왕면":
                        locationData.stationName = "양북면";
                        locationData.umdName = "양북면";
                        break;
                    case "모현읍":
                        locationData.stationName = "모현면";
                        locationData.umdName = "모현면";
                        break;
                    case "이동읍":
                        locationData.stationName = "이동면";
                        locationData.umdName = "이동면";
                        break;
                    case "서패동":
                        locationData.stationName = "교하읍";
                        locationData.umdName = "교하읍";
                        break;
                    case "포승읍":
                        locationData.stationName = "포승면";
                        locationData.umdName = "포승면";
                        break;
                }
                break;

            case "강원도":
                switch (stationName) {
                    case "국토정중앙면":
                        locationData.stationName = "남면";
                        locationData.umdName = "남면";
                        break;
                    case "무릉도원면":
                        locationData.stationName = "수주면";
                        locationData.umdName = "수주면";
                        break;
                    case "산솔면":
                        locationData.stationName = "중동면";
                        locationData.umdName = "중동면";
                        break;
                    case "문무대왕면":
                        locationData.stationName = "양북면";
                        locationData.umdName = "양북면";
                        break;
                    case "한반도면":
                        locationData.stationName = "서면";
                        locationData.umdName = "서면";
                        break;
                    case "여량면":
                        locationData.stationName = "북면";
                        locationData.umdName = "북면";
                        break;
                    case "영귀미면":
                    case "화암면":
                        locationData.stationName = "동면";
                        locationData.umdName = "동면";
                        break;
                    case "포승읍":
                        locationData.stationName = "포승면";
                        locationData.umdName = "포승면";
                        break;
                }
                break;
        } return locationData
    }
}

export default new ApiService();