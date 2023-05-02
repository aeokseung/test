import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import useDidMountEffect from "../useDidMountEffect";
const { kakao } = window;

function MapModal({ info, show, handleClose }) {
    const [map, setMap] = useState('');
    const [location, setLocation] = useState({ latitude: '', longitude: ''}); // 위도, 경도

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
            center: new window.kakao.maps.LatLng(info.lan,info.lng),
            level: 9
        };

        const map = new window.kakao.maps.Map(
            document.getElementById("map2"),
            mapOption
        );

        setMap(map);
        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(info.campingAddress, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setLocation({
                    latitude: result[0].y,
                    longitude: result[0].x
                });
            } else {
                setLocation({
                    latitude: info.lan,
                    longitude: info.lng
                });
            }
        });
    }, []);

    return (
        <Modal size={'xl'} show={show} onHide={handleClose} centered>
            <Modal.Body>
                <div id="map2" style=
                    {{width:"1100px",height:"600px"}}>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default MapModal;