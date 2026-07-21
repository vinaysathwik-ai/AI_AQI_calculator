package com.smartaqi.backend.service;

import com.smartaqi.backend.dto.PredictionRequest;
import com.smartaqi.backend.dto.PredictionResponse;
import com.smartaqi.backend.entity.PredictionEntity;
import com.smartaqi.backend.repository.PredictionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClientException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock
    private FastApiClient fastApiClient;

    @Mock
    private PredictionRepository predictionRepository;

    @InjectMocks
    private PredictionService predictionService;

    @Test
    void testPredictAQI_Success() {
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

        PredictionResponse mockResponse = new PredictionResponse();
        mockResponse.setPredictedAQI(88.5);
        mockResponse.setCategory("Satisfactory");

        when(fastApiClient.predict(request)).thenReturn(mockResponse);

        PredictionResponse response = predictionService.predictAQI(request);

        assertNotNull(response);
        assertEquals(88.5, response.getPredictedAQI());
        assertEquals("Satisfactory", response.getCategory());
        verify(predictionRepository, times(1)).save(any(PredictionEntity.class));
    }

    @Test
    void testPredictAQI_FastApiReturnsNull() {
        PredictionRequest request = new PredictionRequest();
        when(fastApiClient.predict(request)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> predictionService.predictAQI(request));
    }

    @Test
    void testPredictAQI_FastApiThrowsException() {
        PredictionRequest request = new PredictionRequest();
        when(fastApiClient.predict(request)).thenThrow(new RestClientException("Connection refused"));

        assertThrows(RestClientException.class, () -> predictionService.predictAQI(request));
    }
}
