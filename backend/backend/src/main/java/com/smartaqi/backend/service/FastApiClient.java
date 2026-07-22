package com.smartaqi.backend.service;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class FastApiClient {

    private static final Logger log = LoggerFactory.getLogger(FastApiClient.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${fastapi.url:http://127.0.0.1:8000/predict}")
    private String fastApiUrl;

    public PredictionResponse predict(PredictionRequest request) {
        log.info("Sending prediction request to FastAPI ML service at URL: {}", fastApiUrl);
        try {
            PredictionResponse response = restTemplate.postForObject(
                    fastApiUrl,
                    request,
                    PredictionResponse.class
            );
            log.info("Received prediction response from FastAPI: {}", response);
            return response;
        } catch (RestClientException e) {
            log.error("Error communicating with FastAPI service at {}: {}", fastApiUrl, e.getMessage(), e);
            throw e;
        }
    }

    public List<Map<String, Object>> getGridAqi() {
        String gridUrl = fastApiUrl.replace("/predict", "/grid-aqi");
        log.info("Fetching grid AQI dataset from FastAPI ML service at URL: {}", gridUrl);
        try {
            List<Map<String, Object>> response = restTemplate.getForObject(gridUrl, List.class);
            return response;
        } catch (RestClientException e) {
            log.error("Error fetching grid AQI dataset from FastAPI at {}: {}", gridUrl, e.getMessage());
            throw e;
        }
    }

    public Map<String, Object> getPointAqi(Double lat, Double lon) {
        String pointUrl = fastApiUrl.replace("/predict", "/point-aqi") + "?lat=" + lat + "&lon=" + lon;
        log.info("Fetching nearest point AQI from FastAPI ML service at URL: {}", pointUrl);
        try {
            Map<String, Object> response = restTemplate.getForObject(pointUrl, Map.class);
            return response;
        } catch (RestClientException e) {
            log.error("Error fetching point AQI from FastAPI at {}: {}", pointUrl, e.getMessage());
            throw e;
        }
    }
}