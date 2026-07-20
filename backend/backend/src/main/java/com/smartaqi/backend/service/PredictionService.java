package com.smartaqi.backend.service;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PredictionService {

    @Autowired
    private FastApiClient fastApiClient;

    public PredictionResponse predictAQI(PredictionRequest request) {
        PredictionResponse response = fastApiClient.predict(request);

        if (response == null) {
            throw new RuntimeException("Failed to get prediction from ML service.");
        }

        return response;
    }
}