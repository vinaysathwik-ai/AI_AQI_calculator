package com.smartaqi.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import com.smartaqi.backend.service.PredictionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClientException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PredictionController.class)
class PredictionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PredictionService predictionService;

    @MockBean
    private RestTemplateBuilder restTemplateBuilder;

    @Test
    void testPredict_HappyPath() throws Exception {
        PredictionRequest request = new PredictionRequest();
        request.setPM25(35.0);
        request.setPM10(50.0);
        request.setNO(10.0);
        request.setNO2(15.0);
        request.setNOx(20.0);
        request.setNH3(5.0);
        request.setCO(0.8);
        request.setSO2(8.0);
        request.setO3(25.0);
        request.setBenzene(0.5);
        request.setToluene(0.5);
        request.setXylene(0.2);

        PredictionResponse response = new PredictionResponse();
        response.setPredictedAQI(125.0);
        response.setCategory("Moderate");

        when(predictionService.predictAQI(any())).thenReturn(response);

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.predictedAQI").value(125.0))
                .andExpect(jsonPath("$.category").value("Moderate"));
    }

    @Test
    void testPredict_ValidationError() throws Exception {
        PredictionRequest request = new PredictionRequest();
        // Missing required fields -> expect 400 Bad Request

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void testPredict_FastApiUnreachable() throws Exception {
        PredictionRequest request = new PredictionRequest();
        request.setPM25(35.0);
        request.setPM10(50.0);
        request.setNO(10.0);
        request.setNO2(15.0);
        request.setNOx(20.0);
        request.setNH3(5.0);
        request.setCO(0.8);
        request.setSO2(8.0);
        request.setO3(25.0);
        request.setBenzene(0.5);
        request.setToluene(0.5);
        request.setXylene(0.2);

        when(predictionService.predictAQI(any())).thenThrow(new RestClientException("Connection refused"));

        mockMvc.perform(post("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.status").value(502));
    }

    @Test
    void testGetRecentPredictions() throws Exception {
        mockMvc.perform(get("/api/predictions/recent"))
                .andExpect(status().isOk());
    }
}
