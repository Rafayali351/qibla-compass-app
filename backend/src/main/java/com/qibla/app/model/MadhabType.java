package com.qibla.app.model;

/**
 * Jurisprudential methods for Asr prayer time calculation.
 * Hanafi uses a shadow length ratio of 2.
 * Shafi (also Maliki and Hanbali) uses a shadow length ratio of 1.
 */
public enum MadhabType {
    HANAFI("Hanafi", 2),
    SHAFI("Shafi'i / Maliki / Hanbali", 1);

    private final String displayName;
    private final int shadowMultiplier;

    MadhabType(String displayName, int shadowMultiplier) {
        this.displayName = displayName;
        this.shadowMultiplier = shadowMultiplier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getShadowMultiplier() {
        return shadowMultiplier;
    }
}
