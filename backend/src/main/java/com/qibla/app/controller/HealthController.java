package com.qibla.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Qibla & Prayer Times Service",
            "timestamp", Instant.now().toString(),
            "defaultMethod", "University of Islamic Sciences, Karachi",
            "defaultMadhab", "Hanafi"
        ));
    }
}
