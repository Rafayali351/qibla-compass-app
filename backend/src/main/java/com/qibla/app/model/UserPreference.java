package com.qibla.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences", indexes = {
    @Index(name = "idx_user_pref_user_id", columnList = "user_id", unique = true)
})
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true, length = 128)
    private String userId;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "city_name", length = 128)
    private String cityName;

    @Column(name = "country_name", length = 128)
    private String countryName;

    @Enumerated(EnumType.STRING)
    @Column(name = "calculation_method", nullable = false, length = 32)
    private CalculationMethodType calculationMethod = CalculationMethodType.KARACHI;

    @Enumerated(EnumType.STRING)
    @Column(name = "madhab", nullable = false, length = 32)
    private MadhabType madhab = MadhabType.HANAFI;

    @Column(name = "notifications_enabled", nullable = false)
    private Boolean notificationsEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public UserPreference() {
    }

    public UserPreference(String userId, Double latitude, Double longitude, String cityName, String countryName,
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

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
