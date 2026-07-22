package com.smartaqi.backend.service;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import com.smartaqi.backend.entity.PredictionEntity;
import com.smartaqi.backend.repository.PredictionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private static final Logger log = LoggerFactory.getLogger(PredictionService.class);

    @Autowired
    private FastApiClient fastApiClient;

    @Autowired
    private PredictionRepository predictionRepository;

    public PredictionResponse predictAQI(PredictionRequest request) {
        PredictionResponse response = fastApiClient.predict(request);

        if (response == null) {
            throw new RuntimeException("Failed to get prediction from ML service.");
        }

        try {
            PredictionEntity entity = new PredictionEntity();
            entity.setPm25(request.getPM25());
            entity.setPm10(request.getPM10());
            entity.setNo(request.getNO());
            entity.setNo2(request.getNO2());
            entity.setNox(request.getNOx());
            entity.setNh3(request.getNH3());
            entity.setCo(request.getCO());
            entity.setSo2(request.getSO2());
            entity.setO3(request.getO3());
            entity.setBenzene(request.getBenzene());
            entity.setToluene(request.getToluene());
            entity.setXylene(request.getXylene());
            entity.setPredictedAQI(response.getPredictedAQI());
            entity.setCategory(response.getCategory());
            entity.setCreatedAt(LocalDateTime.now());

            predictionRepository.save(entity);
            log.info("Persisted prediction ID {} to database.", entity.getId());
        } catch (Exception e) {
            log.error("Failed to persist prediction entity: {}", e.getMessage(), e);
        }

        return response;
    }

    public List<PredictionEntity> getRecentPredictions() {
        return predictionRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<Map<String, Object>> getGridAqi() {
        return fastApiClient.getGridAqi();
    }

    public Map<String, Object> getPointAqi(Double lat, Double lon) {
        return fastApiClient.getPointAqi(lat, lon);
    }
}