package com.smartaqi.backend.service;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FastApiClient {

    @Autowired
    private RestTemplate restTemplate;

    private static final String FASTAPI_URL = "http://127.0.0.1:8000/predict";

    public PredictionResponse predict(PredictionRequest request) {
        return restTemplate.postForObject(
                FASTAPI_URL,
                request,
                PredictionResponse.class
        );
    }
}