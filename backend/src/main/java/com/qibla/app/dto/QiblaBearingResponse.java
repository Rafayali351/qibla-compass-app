package com.qibla.app.dto;

public class QiblaBearingResponse {

    private double bearingDegrees;
    private String cardinalDirection;
    private double distanceKm;
    private double distanceMiles;
    private double userLatitude;
    private double userLongitude;
    private double kaabaLatitude;
    private double kaabaLongitude;

    public QiblaBearingResponse() {
    }

    public QiblaBearingResponse(double bearingDegrees, String cardinalDirection, double distanceKm, double distanceMiles,
                                double userLatitude, double userLongitude, double kaabaLatitude, double kaabaLongitude) {
        this.bearingDegrees = bearingDegrees;
        this.cardinalDirection = cardinalDirection;
        this.distanceKm = distanceKm;
        this.distanceMiles = distanceMiles;
        this.userLatitude = userLatitude;
        this.userLongitude = userLongitude;
        this.kaabaLatitude = kaabaLatitude;
        this.kaabaLongitude = kaabaLongitude;
    }

    public double getBearingDegrees() {
        return bearingDegrees;
    }

    public void setBearingDegrees(double bearingDegrees) {
        this.bearingDegrees = bearingDegrees;
    }

    public String getCardinalDirection() {
        return cardinalDirection;
    }

    public void setCardinalDirection(String cardinalDirection) {
        this.cardinalDirection = cardinalDirection;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public double getDistanceMiles() {
        return distanceMiles;
    }

    public void setDistanceMiles(double distanceMiles) {
        this.distanceMiles = distanceMiles;
    }

    public double getUserLatitude() {
        return userLatitude;
    }

    public void setUserLatitude(double userLatitude) {
        this.userLatitude = userLatitude;
    }

    public double getUserLongitude() {
        return userLongitude;
    }

    public void setUserLongitude(double userLongitude) {
        this.userLongitude = userLongitude;
    }

    public double getKaabaLatitude() {
        return kaabaLatitude;
    }

    public void setKaabaLatitude(double kaabaLatitude) {
        this.kaabaLatitude = kaabaLatitude;
    }

    public double getKaabaLongitude() {
        return kaabaLongitude;
    }

    public void setKaabaLongitude(double kaabaLongitude) {
        this.kaabaLongitude = kaabaLongitude;
    }
}
