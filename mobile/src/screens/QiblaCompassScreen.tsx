import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { CompassDial } from '../components/CompassDial';
import { CalibrationModal } from '../components/CalibrationModal';
import { PermissionBanner } from '../components/PermissionBanner';
import { useLocation } from '../hooks/useLocation';
import { useCompass } from '../hooks/useCompass';
import { calculateQiblaDirection } from '../services/qiblaService';
import { DEFAULT_FALLBACK_LOCATION } from '../constants/config';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface QiblaCompassScreenProps {
  onOpenSettings?: () => void;
}

export const QiblaCompassScreen: React.FC<QiblaCompassScreenProps> = ({ onOpenSettings }) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);

  const {
    coords,
    cityName,
    countryName,
    loading: locationLoading,
    permissionGranted: locationGranted,
    refreshLocation,
  } = useLocation();

  const compassState = useCompass();

  // Calculate accurate Qibla bearing from user GPS to Kaaba (21.4225° N, 39.8262° E)
  const qiblaInfo = useMemo(() => {
    const activeCoords = coords || {
      latitude: DEFAULT_FALLBACK_LOCATION.latitude,
      longitude: DEFAULT_FALLBACK_LOCATION.longitude,
    };
    return calculateQiblaDirection(activeCoords);
  }, [coords?.latitude, coords?.longitude]);

  return (
    <View style={styles.container}>
      <Header
        cityName={cityName}
        countryName={countryName}
        onRefreshLocation={refreshLocation}
        isLoadingLocation={locationLoading}
        onOpenSettings={onOpenSettings}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Permission Notices */}
        {!locationGranted && (
          <PermissionBanner
            message="Location permission denied. Compass is using default coordinates (Karachi)."
            onRequestPermission={refreshLocation}
            buttonText="Enable GPS"
          />
        )}

        {compassState.error && (
          <PermissionBanner
            icon="alert-circle-outline"
            message={compassState.error}
            onRequestPermission={() => {}}
            buttonText="Retry"
          />
        )}

        {/* Calibration Banner & Action Button */}
        <View style={styles.calibrationCard}>
          <View style={styles.calibrationLeft}>
            <View style={styles.calibrationIconPill}>
              <MaterialCommunityIcons name="axis-z-rotate-clockwise" size={18} color={COLORS.gold} />
            </View>
            <View style={styles.calibrationTextGroup}>
              <Text style={styles.calibrationTitle}>Compass Accuracy Tip</Text>
              <Text style={styles.calibrationSubtitle}>
                Wave in Figure-8 if compass drifts or near metal
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.calibrationButton}
            onPress={() => setShowCalibrationModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.calibrationButtonText}>Calibrate</Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Compass Dial */}
        {locationLoading && !coords ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={styles.loadingText}>Fetching GPS coordinates for Great-Circle bearing...</Text>
          </View>
        ) : (
          <CompassDial
            heading={compassState.heading}
            qiblaBearing={qiblaInfo.bearing}
            cardinal={qiblaInfo.cardinal}
            distanceKm={qiblaInfo.distanceKm}
          />
        )}

        {/* Great-Circle Math & Kaaba Location Card */}
        <View style={styles.kaabaCard}>
          <View style={styles.kaabaHeader}>
            <Ionicons name="location" size={16} color={COLORS.gold} />
            <Text style={styles.kaabaHeaderTitle}>Target: The Holy Kaaba, Mecca</Text>
          </View>

          <View style={styles.coordsGrid}>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>KAABA LATITUDE</Text>
              <Text style={styles.coordValue}>21.4225° N</Text>
            </View>

            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>KAABA LONGITUDE</Text>
              <Text style={styles.coordValue}>39.8262° E</Text>
            </View>
          </View>

          <View style={styles.formulaNote}>
            <Ionicons name="sparkles-outline" size={13} color={COLORS.emeraldLight} />
            <Text style={styles.formulaText}>
              Spherical Trigonometry Forward Azimuth (Atan2) with device tilt sensor stabilization.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Visual Figure-8 Calibration Modal */}
      <CalibrationModal
        visible={showCalibrationModal}
        onClose={() => setShowCalibrationModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  calibrationCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  calibrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  calibrationIconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  calibrationTextGroup: {
    flex: 1,
  },
  calibrationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  calibrationSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  calibrationButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  calibrationButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  loadingContainer: {
    paddingVertical: SPACING.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  kaabaCard: {
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  kaabaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  kaabaHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  coordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(7, 13, 24, 0.5)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  coordBox: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  coordValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textGold,
    marginTop: 2,
  },
  formulaNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  formulaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    flex: 1,
  },
});
