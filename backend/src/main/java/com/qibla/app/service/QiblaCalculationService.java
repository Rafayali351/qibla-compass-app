package com.qibla.app.service;

import com.qibla.app.dto.QiblaBearingResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class QiblaCalculationService {

    // Holy Kaaba Coordinates in Makkah al-Mukarramah
    public static final double KAABA_LATITUDE = 21.4225;
    public static final double KAABA_LONGITUDE = 39.8262;

    private static final double EARTH_RADIUS_KM = 6371.0088;
    private static final double KM_TO_MILES = 0.621371;

    private static final String[] COMPASS_POINTS = {
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    };

    /**
     * Calculates the great-circle initial bearing and distance to the Kaaba from the user's location.
     *
     * @param latitude User latitude in decimal degrees (-90.0 to 90.0)
     * @param longitude User longitude in decimal degrees (-180.0 to 180.0)
     * @return QiblaBearingResponse containing bearing, distance, and cardinal heading
     */
    public QiblaBearingResponse calculateQibla(double latitude, double longitude) {
        if (latitude < -90.0 || latitude > 90.0) {
            throw new IllegalArgumentException("Latitude must be between -90.0 and 90.0");
        }
        if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Longitude must be between -180.0 and 180.0");
        }

        // Convert degrees to radians
        double phiUser = Math.toRadians(latitude);
        double lambdaUser = Math.toRadians(longitude);
        double phiKaaba = Math.toRadians(KAABA_LATITUDE);
        double lambdaKaaba = Math.toRadians(KAABA_LONGITUDE);

        double deltaLambda = lambdaKaaba - lambdaUser;

        // Forward Azimuth (Bearing) formula:
        // y = sin(deltaLambda) * cos(phiKaaba)
        // x = cos(phiUser) * sin(phiKaaba) - sin(phiUser) * cos(phiKaaba) * cos(deltaLambda)
        double y = Math.sin(deltaLambda) * Math.cos(phiKaaba);
        double x = Math.cos(phiUser) * Math.sin(phiKaaba)
                 - Math.sin(phiUser) * Math.cos(phiKaaba) * Math.cos(deltaLambda);

        double initialBearingRad = Math.atan2(y, x);
        double initialBearingDeg = (Math.toDegrees(initialBearingRad) + 360.0) % 360.0;

        // Haversine Distance calculation
        double deltaPhi = phiKaaba - phiUser;
        double a = Math.sin(deltaPhi / 2.0) * Math.sin(deltaPhi / 2.0)
                 + Math.cos(phiUser) * Math.cos(phiKaaba)
                 * Math.sin(deltaLambda / 2.0) * Math.sin(deltaLambda / 2.0);
        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        double distanceKm = EARTH_RADIUS_KM * c;
        double distanceMiles = distanceKm * KM_TO_MILES;

        // Round values for clean API presentation
        double roundedBearing = round(initialBearingDeg, 2);
        double roundedDistKm = round(distanceKm, 2);
        double roundedDistMiles = round(distanceMiles, 2);

        String cardinal = getCardinalDirection(initialBearingDeg);

        return new QiblaBearingResponse(
            roundedBearing,
            cardinal,
            roundedDistKm,
            roundedDistMiles,
            latitude,
            longitude,
            KAABA_LATITUDE,
            KAABA_LONGITUDE
        );
    }

    /**
     * Converts bearing angle in degrees into a 16-point cardinal direction.
     */
    public String getCardinalDirection(double bearingDegrees) {
        double normalized = (bearingDegrees % 360.0 + 360.0) % 360.0;
        int index = (int) Math.round(normalized / 22.5) % 16;
        return COMPASS_POINTS[index];
    }

    private double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
