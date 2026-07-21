package com.smartaqi.backend.controller;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import com.smartaqi.backend.entity.PredictionEntity;
import com.smartaqi.backend.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/predict")
    public PredictionResponse predict(@Valid @RequestBody PredictionRequest request) {
        return predictionService.predictAQI(request);
    }

    @GetMapping("/predictions/recent")
    public List<PredictionEntity> getRecentPredictions() {
        return predictionService.getRecentPredictions();
    }
}