package com.smartaqi.backend.repository;

import com.smartaqi.backend.entity.PredictionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    List<PredictionEntity> findTop10ByOrderByCreatedAtDesc();
}
