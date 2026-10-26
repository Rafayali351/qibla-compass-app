package com.qibla.app.model;

/**
 * Supported Islamic prayer time calculation conventions.
 * Defaults to University of Islamic Sciences, Karachi.
 */
public enum CalculationMethodType {
    KARACHI("University of Islamic Sciences, Karachi", 18.0, 18.0),
    MWL("Muslim World League", 18.0, 17.0),
    ISNA("Islamic Society of North America", 15.0, 15.0),
    EGYPT("Egyptian General Authority of Survey", 19.5, 17.5),
    MAKKAH("Umm al-Qura University, Makkah", 18.5, null),
    DUBAI("Dubai", 18.2, 18.2),
    QATAR("Qatar", 18.0, null),
    KUWAIT("Kuwait", 18.0, 17.5),
    SINGAPORE("Majlis Ugama Islam Singapura", 20.0, 18.0),
    TURKEY("Diyanet İşleri Başkanlığı", 18.0, 17.0),
    TEHRAN("Institute of Geophysics, University of Tehran", 17.7, 14.0);

    private final String displayName;
    private final Double fajrAngle;
    private final Double ishaAngle;

    CalculationMethodType(String displayName, Double fajrAngle, Double ishaAngle) {
        this.displayName = displayName;
        this.fajrAngle = fajrAngle;
        this.ishaAngle = ishaAngle;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Double getFajrAngle() {
        return fajrAngle;
    }

    public Double getIshaAngle() {
        return ishaAngle;
    }
}
