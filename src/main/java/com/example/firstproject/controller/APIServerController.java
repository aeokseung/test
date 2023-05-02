package com.example.firstproject.controller;

import com.example.firstproject.entity.Dust;
import com.example.firstproject.repository.DustRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.transaction.Transactional;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Component
@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class APIServerController {
    private final DustRepository dustRepository;

    //APIController에 있는 메서드 사용하기 위해서 주입
    private final APIController APIController;
    
    //serviceKey는 application.yml에서 설정한 환경변수에서 가져옴
    @Value("${env.serviceKey}")
    private String serviceKey;

    @GetMapping("/dust/list")
    public String index(Model model) {
        // 1: 모든 Article을 가져온다!
        List<Dust> dustEntityList = dustRepository.findAll();

        // 2: 가져온 Article 묶음을 뷰로 전달!
        model.addAttribute("dustList", dustEntityList);

        // 3: 뷰 페이지를 설정!
        return "/dust/index";
    }

    @Transactional
    @PostMapping("/dust/createAll")
    public String createAll() throws Exception {
        String[] city2 = {"서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"};
        for (int j = 0; j < city2.length; j++) {
            String city = URLEncoder.encode(city2[j]);
            String url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty"
                    + "?serviceKey=" + serviceKey
                    + "&returnType=json"            // JSON, XML
                    + "&numOfRows=1000"             // 페이지 ROWS
                    + "&pageNo=1"                 // 페이지 번호
                    + "&sidoName=" + city         // 도시
                    + "&ver=1.0";                  // 오퍼레이션 버전(버전별 상세 결과 문서 참조)

            HashMap<String, Object> resultMap = APIController.getDataFromJson(url, "UTF-8", "get", "");
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("result", resultMap);

            //응답받은 JSON 데이터 중에서 원하는 값 사용을 위해 분해
            JSONArray items = jsonObj.getJSONObject("result").getJSONObject("response").getJSONObject("body").getJSONArray("items");

            //사용하기 위한 데이터만 남긴 후 반복문을 사용해서 DB에 데이터 저장
            for (int i = 0; i < items.length(); i++) {
                String sido_name = items.getJSONObject(i).getString("sidoName");
                String station_name = items.getJSONObject(i).getString("stationName");
                String pm10Value;
                String pm10Grade;
                String pm25Value;
                String pm25Grade;

                if (items.getJSONObject(i).has("pm10Value")) {
                    pm10Value = items.getJSONObject(i).getString("pm10Value");
                } else {
                    pm10Value = "통신장애";
                }
                if (items.getJSONObject(i).has("pm10Grade")) {
                    pm10Grade = items.getJSONObject(i).getString("pm10Grade");
                } else {
                    pm10Grade = "통신장애";
                }
                if (items.getJSONObject(i).has("pm25Value")) {
                    pm25Value = items.getJSONObject(i).getString("pm25Value");
                } else {
                    pm25Value = "통신장애";
                }
                if (items.getJSONObject(i).has("pm25Grade")) {
                    pm25Grade = items.getJSONObject(i).getString("pm25Grade");
                } else {
                    pm25Grade = "통신장애";
                }
                Dust dust = new Dust(sido_name, station_name, pm10Value, pm10Grade, pm25Value, pm25Grade);
                dustRepository.save(dust);
            }
        }
        return "redirect:/api/dust/list";
    }

    @Transactional
    @PostMapping("/dust/selfupdate")
    //업데이트하는 메서드
    public String selfupdate() throws Exception {
        log.info("미세먼지 데이터 업데이트 시작");
        //DB에 저장된 데이터 전체 삭제
        dustRepository.deleteAll();

        //DB에 설정된 auto_increment값 1로 초기화
        //이 설정을 해야 id가 다시 1부터 시작
        dustRepository.initialization();

        //위에서 만든 데이터 전체 생성하는 메서드
        createAll();

        log.info("미세먼지 데이터 업데이트 완료");
        return "redirect:/api/dust/list";
    }
    @Transactional
    @Scheduled(cron = "0 20 * * * *") //데이터가 매 시 15분 내외로 업데이트 되므로 매 시 20분에 메서드가 실행되도록 설정
    public void update() throws Exception {
        log.info("미세먼지 데이터 업데이트 시작");
        //DB에 저장된 데이터 전체 삭제
        dustRepository.deleteAll();

        //DB에 설정된 auto_increment값 1로 초기화
        //이 설정을 해야 id가 다시 1부터 시작
        dustRepository.initialization();

        //데이터 전체 생성하는 메서드
        createAll();

        log.info("미세먼지 데이터 업데이트 완료");
    }

    @GetMapping("/dust/list/search")
    public String showSidoName(String cityName, Model model) {
        //cityName은 도시 데이터 ex) 서울, 인천, 부산 ...
        //입력한 도시에 맞는 Dust Entity list를 가져온다(값은 지역이름 오름차순으로 sort 되어 있다)
        List<Dust> sidoEntityList = dustRepository.findAllBySidoName(cityName);

        //뷰로 전달하기 위한 값을 model에 주입
        model.addAttribute("sidoList", sidoEntityList);

        return "/dust/sidonameindex";
    }
}
