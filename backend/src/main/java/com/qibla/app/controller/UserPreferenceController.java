package com.qibla.app.controller;

import com.qibla.app.dto.PreferenceRequest;
import com.qibla.app.dto.PreferenceResponse;
import com.qibla.app.service.UserPreferenceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@CrossOrigin(origins = "*")
public class UserPreferenceController {

    private final UserPreferenceService preferenceService;

    public UserPreferenceController(UserPreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    /**
     * Fetch user preference by user ID.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<PreferenceResponse> getUserPreferences(@PathVariable("userId") String userId) {
        PreferenceResponse response = preferenceService.getPreferencesByUserId(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Save or update user calculation and location preferences.
     */
    @PostMapping
    public ResponseEntity<PreferenceResponse> savePreferences(@Valid @RequestBody PreferenceRequest request) {
        PreferenceResponse response = preferenceService.saveOrUpdatePreferences(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Update preference with path variable userId.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<PreferenceResponse> updatePreferences(
            @PathVariable("userId") String userId,
            @Valid @RequestBody PreferenceRequest request) {
        request.setUserId(userId);
        PreferenceResponse response = preferenceService.saveOrUpdatePreferences(request);
        return ResponseEntity.ok(response);
    }
}
