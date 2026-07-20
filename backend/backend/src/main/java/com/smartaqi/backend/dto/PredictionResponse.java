package com.smartaqi.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResponse {

    private Double predictedAQI;
    private String category;
}