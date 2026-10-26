package com.qibla.app.dto;

import com.qibla.app.model.CalculationMethodType;
import com.qibla.app.model.MadhabType;
import com.qibla.app.model.UserPreference;

import java.time.LocalDateTime;

public class PreferenceResponse {

    private Long id;
    private String userId;
    private Double latitude;
    private Double longitude;
    private String cityName;
    private String countryName;
    private CalculationMethodType calculationMethod;
    private String calculationMethodDisplayName;
    private MadhabType madhab;
    private String madhabDisplayName;
    private Boolean notificationsEnabled;
    private LocalDateTime updatedAt;

    public PreferenceResponse() {
    }

    public static PreferenceResponse fromEntity(UserPreference entity) {
        PreferenceResponse response = new PreferenceResponse();
        response.setId(entity.getId());
        response.setUserId(entity.getUserId());
        response.setLatitude(entity.getLatitude());
        response.setLongitude(entity.getLongitude());
        response.setCityName(entity.getCityName());
        response.setCountryName(entity.getCountryName());
        response.setCalculationMethod(entity.getCalculationMethod());
        response.setCalculationMethodDisplayName(entity.getCalculationMethod() != null ? entity.getCalculationMethod().getDisplayName() : null);
        response.setMadhab(entity.getMadhab());
        response.setMadhabDisplayName(entity.getMadhab() != null ? entity.getMadhab().getDisplayName() : null);
        response.setNotificationsEnabled(entity.getNotificationsEnabled());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public CalculationMethodType getCalculationMethod() {
        return calculationMethod;
    }

    public void setCalculationMethod(CalculationMethodType calculationMethod) {
        this.calculationMethod = calculationMethod;
    }

    public String getCalculationMethodDisplayName() {
        return calculationMethodDisplayName;
    }

    public void setCalculationMethodDisplayName(String calculationMethodDisplayName) {
        this.calculationMethodDisplayName = calculationMethodDisplayName;
    }

    public MadhabType getMadhab() {
        return madhab;
    }

    public void setMadhab(MadhabType madhab) {
        this.madhab = madhab;
    }

    public String getMadhabDisplayName() {
        return madhabDisplayName;
    }

    public void setMadhabDisplayName(String madhabDisplayName) {
        this.madhabDisplayName = madhabDisplayName;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
