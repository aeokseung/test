import React, { useState, useEffect } from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Weather from "./Weather";
import Dust from "./Dust";
import ApiService from "../services/ApiService";
import MapModal from "./MapModal";
import useDidMountEffect from "../useDidMountEffect";
const { kakao } = window;

function CampingMap({campingAddress,lan, lng}) {
    const [map, setMap] = useState('');
    const [location, setLocation] = useState({ latitude: '', longitude: ''}); // 위도, 경도

    const [modalHandle,setModalHandle] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState({location:'', position:''});

    const [locationData, setLocationData] = useState({
        addressName: '', // 현재 주소
        sidoName: '', // 도 이름
        sggName: '', // 시 이름
        stationName: '', // 지역 이름
        umdName: '' // 동 이름 << stationName과 값은 같은데 근처 측정소 찾는 api에서 필요한 값
    });

    // 지도가 준비된 후에 마커와 인포윈도우를 표시합니다
    useDidMountEffect(() => {
        if (map && location.latitude && location.longitude) {
            const locPosition = new kakao.maps.LatLng(
                location.latitude,
                location.longitude
            );
            displayMarker(locPosition);
        }
    }, [map, location]);

    // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    const displayMarker = (locPosition) => {
        new kakao.maps.Marker({
            map: map,
            position: locPosition
        });

        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);
    }

    useEffect(() => {
        const mapOption = {
            center: new window.kakao.maps.LatLng(33.450701,126.570667),
            level: 5
        };
        const map = new window.kakao.maps.Map(
            document.getElementById("map1"),
            mapOption
        );
        const marker = new window.kakao.maps.Marker({
            position: map.getCenter(),
        });
        marker.setMap(map);
        setMap(map);

        setLocation({
            latitude: lan,
            longitude: lng
        });
    }, []);

    useDidMountEffect(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        const latlng = new window.kakao.maps.LatLng(location.latitude, location.longitude);
        geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                if (result.length > 0) {
                    const addressName = result[1].address_name;
                    const sidoName = result[0].region_1depth_name;
                    const stationName = result[0].region_3depth_name;
                    const umdName = result[0].region_3depth_name
                    const sggName = result[0].region_2depth_name

                    const locationData = {
                        addressName: addressName,
                        sidoName: ApiService.AdressException(sidoName,stationName,umdName,sggName).sidoName,
                        stationName: ApiService.AdressException(sidoName,stationName,umdName,sggName).stationName,
                        umdName: ApiService.AdressException(sidoName,stationName,umdName,sggName).umdName,
                        sggName: ApiService.AdressException(sidoName,stationName,umdName,sggName).sggName
                    }

                    setLocationData(prevState => ({ ...prevState, ...locationData }));
                }
            }
        });
    }, [location]);

    const openModal = (campingAddress, lan, lng) => {
        setSelectedInfo({campingAddress: campingAddress, lan: lan, lng: lng});
        setModalHandle(true);
    };

    return (
        <div style={{display: "flex"}}>
            <div style={{ marginRight: "30px"}}>
                <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                        <Tooltip id={`tooltip-right`}>
                            지도를 <strong>클릭</strong>하면 확대하여 볼 수 있습니다.
                        </Tooltip>
                    }
                >
                    <div id="map1" style=
                        {{width: "350px", height: "250px", border: "1px solid rgb(207, 207, 207)", borderRadius: "30px" , marginBottom: "20px",
                            boxShadow: "rgb(207, 207, 207) 0px 0px 13px", position: "relative", overflow: "hidden", left: "10px"}}
                         onClick = {() => openModal(campingAddress, lan, lng)}>
                    </div>
                </OverlayTrigger>
                <Dust sidoName={locationData.sidoName} stationName={locationData.stationName} umdName={locationData.umdName} sggName={locationData.sggName}/>
            </div>
            <Weather addressName={locationData.addressName} location={location}/>
            {
                modalHandle && <MapModal info={selectedInfo} show={modalHandle} handleClose={() => setModalHandle(false)} />

            }
        </div>
    )
}

export default CampingMap;