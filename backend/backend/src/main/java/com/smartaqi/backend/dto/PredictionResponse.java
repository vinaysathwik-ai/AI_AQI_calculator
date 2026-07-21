package com.smartaqi.backend.dto;

public class PredictionResponse {

    private Double predictedAQI;
    private String category;

    public PredictionResponse() {}

    public PredictionResponse(Double predictedAQI, String category) {
        this.predictedAQI = predictedAQI;
        this.category = category;
    }

    public Double getPredictedAQI() { return predictedAQI; }
    public void setPredictedAQI(Double predictedAQI) { this.predictedAQI = predictedAQI; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}