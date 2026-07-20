package com.smartaqi.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PredictionRequest {

    @NotNull
    private Double PM25;

    @NotNull
    private Double PM10;

    @NotNull
    private Double NO;

    @NotNull
    private Double NO2;

    @NotNull
    private Double NOx;

    @NotNull
    private Double NH3;

    @NotNull
    private Double CO;

    @NotNull
    private Double SO2;

    @NotNull
    private Double O3;

    @NotNull
    private Double Benzene;

    @NotNull
    private Double Toluene;

    @NotNull
    private Double Xylene;
}