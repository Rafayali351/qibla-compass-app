package com.qibla.app.repository;

import com.qibla.app.model.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    Optional<UserPreference> findByUserId(String userId);

    boolean existsByUserId(String userId);

    void deleteByUserId(String userId);
}
