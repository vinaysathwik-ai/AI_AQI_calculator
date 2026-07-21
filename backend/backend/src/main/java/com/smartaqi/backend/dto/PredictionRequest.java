package com.smartaqi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class PredictionRequest {

    @NotNull
    @JsonProperty("PM25")
    private Double PM25;

    @NotNull
    @JsonProperty("PM10")
    private Double PM10;

    @NotNull
    @JsonProperty("NO")
    private Double NO;

    @NotNull
    @JsonProperty("NO2")
    private Double NO2;

    @NotNull
    @JsonProperty("NOx")
    private Double NOx;

    @NotNull
    @JsonProperty("NH3")
    private Double NH3;

    @NotNull
    @JsonProperty("CO")
    private Double CO;

    @NotNull
    @JsonProperty("SO2")
    private Double SO2;

    @NotNull
    @JsonProperty("O3")
    private Double O3;

    @NotNull
    @JsonProperty("Benzene")
    private Double Benzene;

    @NotNull
    @JsonProperty("Toluene")
    private Double Toluene;

    @NotNull
    @JsonProperty("Xylene")
    private Double Xylene;

    public PredictionRequest() {}

    public Double getPM25() { return PM25; }
    public void setPM25(Double PM25) { this.PM25 = PM25; }

    public Double getPM10() { return PM10; }
    public void setPM10(Double PM10) { this.PM10 = PM10; }

    public Double getNO() { return NO; }
    public void setNO(Double NO) { this.NO = NO; }

    public Double getNO2() { return NO2; }
    public void setNO2(Double NO2) { this.NO2 = NO2; }

    public Double getNOx() { return NOx; }
    public void setNOx(Double NOx) { this.NOx = NOx; }

    public Double getNH3() { return NH3; }
    public void setNH3(Double NH3) { this.NH3 = NH3; }

    public Double getCO() { return CO; }
    public void setCO(Double CO) { this.CO = CO; }

    public Double getSO2() { return SO2; }
    public void setSO2(Double SO2) { this.SO2 = SO2; }

    public Double getO3() { return O3; }
    public void setO3(Double O3) { this.O3 = O3; }

    public Double getBenzene() { return Benzene; }
    public void setBenzene(Double Benzene) { this.Benzene = Benzene; }

    public Double getToluene() { return Toluene; }
    public void setToluene(Double Toluene) { this.Toluene = Toluene; }

    public Double getXylene() { return Xylene; }
    public void setXylene(Double Xylene) { this.Xylene = Xylene; }
}