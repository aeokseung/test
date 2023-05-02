package com.example.firstproject.controller;

import com.example.firstproject.entity.CampingSite;
import com.example.firstproject.entity.Dust;
import com.example.firstproject.repository.CampingSiteRepository;
import com.example.firstproject.repository.DustRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class APIController {
    // 거리 계산을 위한 함수
    public static double distance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구 반경 (km)

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; //km
    }

    @Value("${env.serviceKey}")
    private String serviceKey;
    private final DustRepository dustRepository;

    private final CampingSiteRepository campingSiteRepository;

    //캠핑 전체 데이터 찾아서 리턴
    @GetMapping("/camping/showAllList")
    public List<CampingSite> showAllCampingList() {
        //모든 Article을 가져온다!
        List<CampingSite> campingSiteEntityList = campingSiteRepository.findAll();

        return campingSiteEntityList;
    }

    //시이름으로 데이터 찾아서 리턴
    @GetMapping("/camping/showList")
    public List<CampingSite> showCampingListBySidoName(@RequestParam String city_name) {
        List<CampingSite> sidoEntityList = campingSiteRepository.findAllBySidoName(city_name);

        return sidoEntityList;
    }

    //캠핑장 이름으로 데이터 찾아서 리턴
    @GetMapping("/camping/showCampingList")
    public List<CampingSite> showCampingListByCampingName(@RequestParam String camping_name) {
        List<CampingSite> campingSiteEntityList = campingSiteRepository.findAllByCampingName(camping_name);

        return campingSiteEntityList;
    }

    //현재위치와 캠핑장 거리 계산하여 거리순으로 최대 30개의 데이터를 오름차순으로 return
    @GetMapping("/camping/calculate")
    public List<CampingSite> getCampingSitesNearby(@RequestParam("latitude") double latitude, @RequestParam("longitude") double longitude) {
        ArrayList<CampingSite> CampingSites = campingSiteRepository.findAll();

        for (CampingSite CampingSite : CampingSites) {
            double distance = distance(latitude, longitude, CampingSite.getLatitude(), CampingSite.getLongitude());
            CampingSite.setDistance(distance);
        }

        Collections.sort(CampingSites, Comparator.comparing(CampingSite::getDistance));

        return CampingSites.stream()
                .limit(30)
                .collect(Collectors.toList());
    }


    @GetMapping("/weatherforecast")
    public String restApiGetWeatherNow(@RequestParam String coordinate_x, @RequestParam String coordinate_y) throws Exception {
        // 현재 시간
        LocalTime now = LocalTime.now();

        // 오늘 날짜
        Date date = new Date();

        // 포맷 정의하기
        DateTimeFormatter formatterTime = DateTimeFormatter.ofPattern("HH");
        SimpleDateFormat formatterDate = new SimpleDateFormat("yy년 MM월 dd일 E요일 a h시 mm분 ");

        // 포맷 적용하기
        String formatedNow = now.format(formatterTime);
        String formatedToday = formatterDate.format(date); // 리액트로 보내줄 오늘 날짜
        String nowTime = formatedNow + "00"; // 데이터 조회에 사용할 시간

        //yyyyMMdd 형식의 어제 날짜 구하기
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Calendar c1 = Calendar.getInstance();
        c1.add(Calendar.DATE, -1); // 오늘날짜로부터 -1
        String yesterday = sdf.format(c1.getTime()); // String으로 저장

        //yyyyMMdd 형식의 오늘 날짜 구하기
        String today = sdf.format(date); // String으로 저장

        //yyyyMMdd 형식의 내일 날짜 구하기
        Calendar c2 = Calendar.getInstance();
        c2.add(Calendar.DATE, +1); // 오늘날짜로부터 +1
        String tomorrow = sdf.format(c2.getTime()); // String으로 저장

//        log.info("yesterday: " + yesterday); // 어제 날짜 출력
//        log.info("today: " + today); // 오늘 날짜 출력
//        log.info("tomorrow: " + tomorrow); // 내일 날짜 출력

        //날씨를 가져오기 위한 url
        String url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
                + "?serviceKey=" + serviceKey
                + "&dataType=JSON"            // JSON, XML
                + "&numOfRows=600"             // 페이지 ROWS
                + "&pageNo=1"                 // 페이지 번호
                + "&base_date=" + yesterday   // 발표일자
                + "&base_time=2300"           // 발표시각
                + "&nx=" + coordinate_x       // 예보지점 X 좌표
                + "&ny=" + coordinate_y;     // 예보지점 Y 좌표


        HashMap<String, Object> resultMap = getDataFromJson(url, "UTF-8", "get", "");

        JSONObject resultObject = new JSONObject(resultMap); // 데이터 가공을 위한 객체 생성

        JSONObject jsonObj2 = new JSONObject(); // 실제로 값을 리턴할 객체 생성
        JSONObject todayData = new JSONObject();
        JSONObject tomorrowData = new JSONObject();

        Map<String, String> todayDataSub = new HashMap<>(); //  오늘의 각 시간별 데이터를 저장할 객체
        Map<String, String> tomorrowDataSub = new HashMap<>(); // 내일의 각 시간별 데이터를 저장할 객체

        JSONArray items = resultObject.getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item");
//        log.info(items);

        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.getJSONObject(i);
            String fcstDate = item.getString("fcstDate");
            String fcstTime = item.getString("fcstTime");
            String category = item.getString("category");
            String fcstValue = item.getString("fcstValue");

            if (fcstDate.equals(today) && category.equals("TMX")) {
                int TMX = (int) Double.parseDouble(fcstValue); // 실수로 제공되는 TMX를 int로 변환
                jsonObj2.put("TMX", TMX); // 전달한 객체로 TMX 추가
            }

            if (fcstDate.equals(today) && category.equals("TMN")) {
                int TMN = (int) Double.parseDouble(fcstValue); // 실수로 제공되는 TMN을 int로 변환
                jsonObj2.put("TMN", TMN); // 전달한 객체로 TMN 추가
            }

            //현재 시간과 일치하는 데이터 저장
            if (fcstTime.equals(nowTime) && fcstDate.equals(today)) {
                switch (category) {
                    case "TMP":
                        String TMP = fcstValue;
                        jsonObj2.put("TMP", TMP); // 전달한 객체로 TMP 추가
                        break;
                    case "REH":
                        String REH = fcstValue;
                        jsonObj2.put("REH", REH); // 전달한 객체로 REH 추가
                        break;
                    case "POP":
                        String POP = fcstValue;
                        jsonObj2.put("POP", POP); // 전달한 객체로 POP 추가
                        break;
                    case "SKY":
                        String SKY = fcstValue;
                        jsonObj2.put("SKY", SKY); // 전달한 객체로 SKY 추가
                        break;
                    case "PTY":
                        String PTY = fcstValue;
                        jsonObj2.put("PTY", PTY); // 전달한 객체로 PTY 추가
                        break;
                }
            }

            if (fcstDate.equals(today)) {
                todayDataSub.put(category, fcstValue);
                todayData.put(fcstTime, todayDataSub);
            } else if (fcstDate.equals(tomorrow)) {
                tomorrowDataSub.put(category, fcstValue);
                tomorrowData.put(fcstTime, tomorrowDataSub);
            }
        }
        for (int j = 0; j < todayData.length(); j++) {
            String hour = (j < 10) ? "0" + j + "00" : j + "00";
            int tempTMP = Integer.parseInt(todayData.getJSONObject(hour).getString("TMP"));
            if (tempTMP > jsonObj2.getInt("TMX")) {
                jsonObj2.put("TMX", tempTMP);
            }
            if (tempTMP < jsonObj2.getInt("TMN")) {
                jsonObj2.put("TMN", tempTMP);
            }
        }

        jsonObj2.put("todayTime", formatedToday); // 전달한 객체로 TodayTime 추가
        jsonObj2.put("Today", todayData); // 전달한 객체로 Today data 추가
        jsonObj2.put("Tomorrow", tomorrowData); // 전달한 객체로 Tomorrow data 추가

        return jsonObj2.toString();
    }

    //미세먼지 전체 데이터 찾아서 리턴
    @GetMapping("/dust/showAllList")
    public List<Dust> showAllList() {
        //모든 Article을 가져온다!
        List<Dust> dustEntityList = dustRepository.findAll();

        return dustEntityList;
    }

    //도시이름으로 데이터 찾아서 리턴
    @GetMapping("/dust/showList")
    public List<Dust> showBySidoName(@RequestParam String sido_name) {
        List<Dust> sidoEntityList = dustRepository.findAllBySidoName(sido_name);

        return sidoEntityList;
    }

    //지역이름으로 데이터 찾아서 리턴
    @GetMapping("/dust/searchStation")
    public List<Dust> showByStationName(@RequestParam String station_name) {
        log.info("@DB에서 찾을 측정소명: " + station_name);
        List<Dust> EntityList = dustRepository.findAllByStationName(station_name);

        log.info("#DB에서 찾은 측정소: " + EntityList);
        return EntityList;
    }

    //현재 위치에서 가까운 근처 측정소 조회
    @GetMapping("/dust/search/measuringstation")
    public String searchMeasuringStation(@RequestParam String tmX, @RequestParam String tmY) throws Exception {
        log.info("근처 측정소 조회할 tm좌표: " + tmX + "/" + tmY);
        String url = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList"
                + "?serviceKey=" + serviceKey
                + "&returnType=json"            // JSON, XML
                + "&tmX=" + tmX             // 페이지 ROWS
                + "&tmY=" + tmY;             // 페이지 번호
        HashMap<String, Object> resultMap = getDataFromJson(url, "UTF-8", "get", "");

        JSONObject jsonObj = new JSONObject();

        jsonObj.put("result", resultMap);

        log.info("근처 측정소 조회: " + jsonObj.getJSONObject("result"));

        return jsonObj.toString();
    }

    //읍면동을 가지고 TM 기준좌표 조회
    @GetMapping("/dust/convert")
    public String convertToTM(@RequestParam String station_name) throws Exception {
        String stationName = URLEncoder.encode(station_name);
        log.info("TM 좌표를 구할 station_name: " + station_name);
        String url = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getTMStdrCrdnt"
                + "?serviceKey=" + serviceKey
                + "&returnType=json"            // JSON, XML
                + "&numOfRows=100"             // 페이지 ROWS
                + "&pageNo=1"                 // 페이지 번호
                + "&umdName=" + stationName;        // 읍면동명

        HashMap<String, Object> resultMap = getDataFromJson(url, "UTF-8", "get", "");

        JSONObject jsonObj = new JSONObject();

        jsonObj.put("result", resultMap);
        log.info("변환된 tm 좌표: " + jsonObj.getJSONObject("result"));
        return jsonObj.toString();
    }

    /** url, encoding, type 및 jsonStr의 네 가지 인수를 사용한다.
     * type의 값이 "post"인지 여부에 isPost를 설정한 다음 jsonStr이 빈 문자열이 아닌 경우 쿼리 매개변수로 jsonStr 값을 추가하여 url 변수를 수정한다.
     * 마지막으로 수정된 url 및 기타 인수를 사용하여 다음 메서드 getStringFromURL()을 호출하여 JSON 데이터를 검색한다.*/
    public HashMap<String, Object> getDataFromJson(String url, String encoding, String type, String jsonStr) throws Exception {
        boolean isPost = "post".equals(type);
        url = "".equals(jsonStr) ? url : url + "?request=" + jsonStr;
        return getStringFromURL(url, encoding, isPost, jsonStr, "application/json");
    }

    /** url, encoding, isPost, parameter 및 contentType의 다섯 가지 인수를 사용한다.
     * 지정된 연결 및 읽기 시간 초과로 주어진 url에 대한 HTTP 연결을 설정하고 isPost 값을 기반으로 HTTP 메서드를 POST 또는 GET으로 설정한다.
     * 또한 Content-Type 및 Accept 헤더를 설정합니다. HTTP 메서드가 POST인 경우 출력 스트림에 매개변수를 쓴다.
     * 그런 다음 입력 스트림에서 응답 데이터를 읽고 StringBuilder에 추가한다.
     * 마지막으로 Jackson 라이브러리의 ObjectMapper를 사용하여 JSON 데이터를 구문 분석하고 HashMap 개체로 변환한다.
     * 이 메소드는 finally 블록에서 HTTP 연결과 입력 및 출력 스트림을 닫고 결과 HashMap 개체를 반환한다.*/
    public HashMap<String, Object> getStringFromURL(String url, String encoding, boolean isPost, String parameter, String contentType) throws Exception {
        HttpURLConnection conn = null;
        BufferedReader br = null;
        BufferedWriter bw = null;
        HashMap<String, Object> resultMap = new HashMap<>();

        try {
            conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(20000);
            conn.setDoOutput(true);
            conn.setRequestMethod(isPost ? "POST" : "GET");
            conn.setRequestProperty("Content-Type", contentType);
            conn.setRequestProperty("Accept", "*/*");
            conn.connect();

            if (isPost) {
                bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
                bw.write(parameter);
                bw.flush();
            }

            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), encoding));
            StringBuilder result = new StringBuilder();
            String line;

            while ((line = br.readLine()) != null) {
                result.append(line);
            }

            ObjectMapper mapper = new ObjectMapper();
            resultMap = mapper.readValue(result.toString(), HashMap.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(url + " interface failed" + e);
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
            if (br != null) {
                br.close();
            }
            if (bw != null) {
                bw.close();
            }
        }

        return resultMap;
    }
}