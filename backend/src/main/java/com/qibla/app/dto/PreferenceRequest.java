package com.qibla.app.dto;

import com.qibla.app.model.CalculationMethodType;
import com.qibla.app.model.MadhabType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PreferenceRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    @NotNull(message = "latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    private String cityName;
    private String countryName;

    private CalculationMethodType calculationMethod = CalculationMethodType.KARACHI;
    private MadhabType madhab = MadhabType.HANAFI;
    private Boolean notificationsEnabled = true;

    public PreferenceRequest() {
    }

    public PreferenceRequest(String userId, Double latitude, Double longitude, String cityName, String countryName,
                             CalculationMethodType calculationMethod, MadhabType madhab, Boolean notificationsEnabled) {
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.cityName = cityName;
        this.countryName = countryName;
        this.calculationMethod = calculationMethod != null ? calculationMethod : CalculationMethodType.KARACHI;
        this.madhab = madhab != null ? madhab : MadhabType.HANAFI;
        this.notificationsEnabled = notificationsEnabled != null ? notificationsEnabled : true;
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

    public MadhabType getMadhab() {
        return madhab;
    }

    public void setMadhab(MadhabType madhab) {
        this.madhab = madhab;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
}
