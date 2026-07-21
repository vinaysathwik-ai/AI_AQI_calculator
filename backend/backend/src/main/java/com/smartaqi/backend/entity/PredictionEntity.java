package com.smartaqi.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class PredictionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double pm25;
    private Double pm10;
    private Double no;
    private Double no2;
    private Double nox;
    private Double nh3;
    private Double co;
    private Double so2;
    private Double o3;
    private Double benzene;
    private Double toluene;
    private Double xylene;

    private Double predictedAQI;
    private String category;

    private LocalDateTime createdAt;

    public PredictionEntity() {}

    public PredictionEntity(Long id, Double pm25, Double pm10, Double no, Double no2, Double nox,
                            Double nh3, Double co, Double so2, Double o3, Double benzene,
                            Double toluene, Double xylene, Double predictedAQI, String category,
                            LocalDateTime createdAt) {
        this.id = id;
        this.pm25 = pm25;
        this.pm10 = pm10;
        this.no = no;
        this.no2 = no2;
        this.nox = nox;
        this.nh3 = nh3;
        this.co = co;
        this.so2 = so2;
        this.o3 = o3;
        this.benzene = benzene;
        this.toluene = toluene;
        this.xylene = xylene;
        this.predictedAQI = predictedAQI;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getPm25() { return pm25; }
    public void setPm25(Double pm25) { this.pm25 = pm25; }

    public Double getPm10() { return pm10; }
    public void setPm10(Double pm10) { this.pm10 = pm10; }

    public Double getNo() { return no; }
    public void setNo(Double no) { this.no = no; }

    public Double getNo2() { return no2; }
    public void setNo2(Double no2) { this.no2 = no2; }

    public Double getNox() { return nox; }
    public void setNox(Double nox) { this.nox = nox; }

    public Double getNh3() { return nh3; }
    public void setNh3(Double nh3) { this.nh3 = nh3; }

    public Double getCo() { return co; }
    public void setCo(Double co) { this.co = co; }

    public Double getSo2() { return so2; }
    public void setSo2(Double so2) { this.so2 = so2; }

    public Double getO3() { return o3; }
    public void setO3(Double o3) { this.o3 = o3; }

    public Double getBenzene() { return benzene; }
    public void setBenzene(Double benzene) { this.benzene = benzene; }

    public Double getToluene() { return toluene; }
    public void setToluene(Double toluene) { this.toluene = toluene; }

    public Double getXylene() { return xylene; }
    public void setXylene(Double xylene) { this.xylene = xylene; }

    public Double getPredictedAQI() { return predictedAQI; }
    public void setPredictedAQI(Double predictedAQI) { this.predictedAQI = predictedAQI; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
