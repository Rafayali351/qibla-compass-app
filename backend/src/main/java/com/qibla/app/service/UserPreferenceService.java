package com.qibla.app.service;

import com.qibla.app.dto.PreferenceRequest;
import com.qibla.app.dto.PreferenceResponse;
import com.qibla.app.model.CalculationMethodType;
import com.qibla.app.model.MadhabType;
import com.qibla.app.model.UserPreference;
import com.qibla.app.repository.UserPreferenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserPreferenceService {

    private final UserPreferenceRepository repository;

    public UserPreferenceService(UserPreferenceRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PreferenceResponse getPreferencesByUserId(String userId) {
        return repository.findByUserId(userId)
            .map(PreferenceResponse::fromEntity)
            .orElseGet(() -> {
                // Return default preferences with Karachi method and Hanafi Asr
                PreferenceResponse def = new PreferenceResponse();
                def.setUserId(userId);
                def.setLatitude(24.8607); // Default to Karachi coordinates as reference
                def.setLongitude(67.0011);
                def.setCityName("Karachi");
                def.setCountryName("Pakistan");
                def.setCalculationMethod(CalculationMethodType.KARACHI);
                def.setCalculationMethodDisplayName(CalculationMethodType.KARACHI.getDisplayName());
                def.setMadhab(MadhabType.HANAFI);
                def.setMadhabDisplayName(MadhabType.HANAFI.getDisplayName());
                def.setNotificationsEnabled(true);
                return def;
            });
    }

    @Transactional
    public PreferenceResponse saveOrUpdatePreferences(PreferenceRequest request) {
        UserPreference pref = repository.findByUserId(request.getUserId())
            .orElse(new UserPreference());

        pref.setUserId(request.getUserId());
        pref.setLatitude(request.getLatitude());
        pref.setLongitude(request.getLongitude());
        pref.setCityName(request.getCityName());
        pref.setCountryName(request.getCountryName());
        pref.setCalculationMethod(request.getCalculationMethod() != null ? request.getCalculationMethod() : CalculationMethodType.KARACHI);
        pref.setMadhab(request.getMadhab() != null ? request.getMadhab() : MadhabType.HANAFI);
        pref.setNotificationsEnabled(request.getNotificationsEnabled() != null ? request.getNotificationsEnabled() : true);

        UserPreference saved = repository.save(pref);
        return PreferenceResponse.fromEntity(saved);
    }
}
