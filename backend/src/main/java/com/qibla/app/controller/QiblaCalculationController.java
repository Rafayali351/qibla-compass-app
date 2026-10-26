package com.qibla.app.controller;

import com.qibla.app.dto.QiblaBearingResponse;
import com.qibla.app.service.QiblaCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qibla")
@CrossOrigin(origins = "*")
public class QiblaCalculationController {

    private final QiblaCalculationService qiblaCalculationService;

    public QiblaCalculationController(QiblaCalculationService qiblaCalculationService) {
        this.qiblaCalculationService = qiblaCalculationService;
    }

    /**
     * Calculate Qibla bearing, distance, and cardinal direction for given GPS coordinates.
     */
    @GetMapping("/bearing")
    public ResponseEntity<QiblaBearingResponse> getQiblaBearing(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude) {
        QiblaBearingResponse response = qiblaCalculationService.calculateQibla(latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
