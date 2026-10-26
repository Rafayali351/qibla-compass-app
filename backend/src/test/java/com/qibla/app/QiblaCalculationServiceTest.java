package com.qibla.app;

import com.qibla.app.dto.QiblaBearingResponse;
import com.qibla.app.service.QiblaCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QiblaCalculationServiceTest {

    private QiblaCalculationService service;

    @BeforeEach
    void setUp() {
        service = new QiblaCalculationService();
    }

    @Test
    @DisplayName("Should accurately calculate Qibla bearing from Karachi, Pakistan (~268° West)")
    void testQiblaFromKarachi() {
        double karachiLat = 24.8607;
        double karachiLng = 67.0011;

        QiblaBearingResponse result = service.calculateQibla(karachiLat, karachiLng);

        assertNotNull(result);
        // Bearing from Karachi to Mecca is ~268.4 degrees
        assertTrue(result.getBearingDegrees() >= 267.0 && result.getBearingDegrees() <= 270.0,
            "Bearing from Karachi should be approximately 268° (Actual: " + result.getBearingDegrees() + ")");
        assertEquals("W", result.getCardinalDirection());
        assertTrue(result.getDistanceKm() > 2700 && result.getDistanceKm() < 3000,
            "Distance from Karachi should be ~2800 km");
    }

    @Test
    @DisplayName("Should accurately calculate Great-Circle Qibla bearing from New York, USA (~58° ENE)")
    void testQiblaFromNewYork() {
        double nyLat = 40.7128;
        double nyLng = -74.0060;

        QiblaBearingResponse result = service.calculateQibla(nyLat, nyLng);

        assertNotNull(result);
        // Great-circle bearing from NY to Mecca is approx 58.5 degrees
        assertTrue(result.getBearingDegrees() >= 57.0 && result.getBearingDegrees() <= 60.0,
            "Bearing from NY should be approximately 58.5° (Actual: " + result.getBearingDegrees() + ")");
        assertEquals("ENE", result.getCardinalDirection());
        assertTrue(result.getDistanceKm() > 10000);
    }

    @Test
    @DisplayName("Should reject invalid coordinates")
    void testInvalidCoordinates() {
        assertThrows(IllegalArgumentException.class, () -> service.calculateQibla(95.0, 0.0));
        assertThrows(IllegalArgumentException.class, () -> service.calculateQibla(-91.0, 0.0));
        assertThrows(IllegalArgumentException.class, () -> service.calculateQibla(0.0, 185.0));
        assertThrows(IllegalArgumentException.class, () -> service.calculateQibla(0.0, -181.0));
    }
}
