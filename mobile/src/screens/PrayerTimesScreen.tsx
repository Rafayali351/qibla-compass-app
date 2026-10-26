import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { CountdownTimer } from '../components/CountdownTimer';
import { PrayerCard } from '../components/PrayerCard';
import { PermissionBanner } from '../components/PermissionBanner';
import { useLocation } from '../hooks/useLocation';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { UserSettings } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { CALCULATION_METHODS, MADHABS } from '../constants/config';

interface PrayerTimesScreenProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onNavigateToQibla: () => void;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  settings,
  onOpenSettings,
  onNavigateToQibla,
}) => {
  const { coords, cityName, countryName, loading: locationLoading, permissionGranted, error: locationError, refreshLocation } =
    useLocation();

  const { prayerData, countdown, dateStrings } = usePrayerTimes(
    coords,
    settings.method,
    settings.madhab
  );

  const selectedMethodObj = CALCULATION_METHODS.find((m) => m.id === settings.method);
  const selectedMadhabObj = MADHABS.find((m) => m.id === settings.madhab);

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
        refreshControl={
          <RefreshControl
            refreshing={locationLoading}
            onRefresh={refreshLocation}
            tintColor={COLORS.gold}
            colors={[COLORS.gold]}
          />
        }
      >
        {/* Permission Notice if not granted */}
        {!permissionGranted && (
          <PermissionBanner
            message="Location access is required for dynamic prayer times. Currently using default coordinates (Karachi)."
            onRequestPermission={refreshLocation}
            buttonText="Allow GPS"
          />
        )}

        {/* Date Card */}
        <View style={styles.dateCard}>
          <View style={styles.dateLeft}>
            <Text style={styles.gregorianDate}>{dateStrings.gregorian}</Text>
            <Text style={styles.hijriDate}>{dateStrings.hijri}</Text>
          </View>
          <TouchableOpacity
            style={styles.qiblaQuickButton}
            onPress={onNavigateToQibla}
            activeOpacity={0.8}
          >
            <Ionicons name="compass-outline" size={18} color={COLORS.gold} />
            <Text style={styles.qiblaQuickText}>Qibla</Text>
          </TouchableOpacity>
        </View>

        {/* Live Countdown Timer */}
        {prayerData && (
          <CountdownTimer
            countdown={countdown}
            nextPrayer={prayerData.nextPrayer}
            methodName={selectedMethodObj?.name || 'Karachi'}
            madhabName={selectedMadhabObj?.name.split(' ')[0] || 'Hanafi'}
          />
        )}

        {/* Prayer Times Schedule List */}
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Daily Salah Schedule</Text>
          <Text style={styles.scheduleSubtitle}>6 Prayer Times</Text>
        </View>

        {locationLoading && !prayerData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.emerald} />
            <Text style={styles.loadingText}>Calculating precise prayer times...</Text>
          </View>
        ) : (
          prayerData?.list.map((item) => <PrayerCard key={item.id} item={item} />)
        )}

        {/* Jurisprudential & Method Footer Note */}
        <View style={styles.methodFootnote}>
          <Ionicons name="information-circle-outline" size={15} color={COLORS.textMuted} />
          <Text style={styles.methodFootnoteText}>
            Calculated via {selectedMethodObj?.name} with {settings.madhab} Asr. Tap settings to change.
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  dateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dateLeft: {
    flex: 1,
  },
  gregorianDate: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hijriDate: {
    fontSize: 12,
    color: COLORS.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  qiblaQuickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  qiblaQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
    marginLeft: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  methodFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  methodFootnoteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    textAlign: 'center',
  },
});
