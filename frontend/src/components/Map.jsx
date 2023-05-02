import React, { useState, useEffect } from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Weather from "./Weather";
import Dust from "./Dust";
import ApiService from "../services/ApiService";
import { useRecoilState } from "recoil";
import { locationState } from "../recoil/location";
import useDidMountEffect from "../useDidMountEffect";
import MapModal from "./MapModal";
const { kakao } = window;

function Map() {
    
    const [nowLocation,setNowLocation] = useRecoilState(locationState);
    
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
            document.getElementById("map"),
            mapOption
        );
        const marker = new window.kakao.maps.Marker({
            position: map.getCenter(),
        });
        marker.setMap(map);
        setMap(map);

        // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 현재 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(function (position) {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setNowLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            });
        } else {
            // geolocation을 사용할 수 없는 경우 초기 위치를 설정합니다.
            setLocation({
                latitude: 33.450701,
                longitude: 126.570667
            });
            alert('geolocation을 사용할수 없어요..');
        }
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

    const openModal = (lan, lng) => {
        setSelectedInfo({lan: lan, lng: lng});
        setModalHandle(true);
    };

    return (
        <div>
            <OverlayTrigger
                key={'right'}
                placement={'right'}
                overlay={
                    <Tooltip id={`tooltip-right`}>
                        지도를 <strong>클릭</strong>하면 확대하여 볼 수 있습니다.
                    </Tooltip>
                }
            >
                <div id="map" style=
                    {{width: "350px", height: "200px", border: "1px solid rgb(207, 207, 207)", borderRadius: "30px", marginTop: "20px", marginBottom: "20px",
                        boxShadow: "rgb(207, 207, 207) 0px 0px 13px", position: "relative", overflow: "hidden", left: "10px"}}
                     onClick = {() => openModal(location.latitude, location.longitude)}>
                </div>
            </OverlayTrigger>
            <Weather addressName={locationData.addressName} location={location}/>
            <Dust sidoName={locationData.sidoName} stationName={locationData.stationName} umdName={locationData.umdName} sggName={locationData.sggName}/>
            {
                modalHandle && <MapModal info={selectedInfo} show={modalHandle} handleClose={() => setModalHandle(false)} />

            }
        </div>
    )
}

export default Map;