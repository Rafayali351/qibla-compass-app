import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface HeaderProps {
  cityName?: string | null;
  countryName?: string | null;
  onRefreshLocation?: () => void;
  isLoadingLocation?: boolean;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cityName,
  countryName,
  onRefreshLocation,
  isLoadingLocation,
  onOpenSettings,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="moon" size={18} color={COLORS.gold} />
        </View>
        <View>
          <Text style={styles.title}>Al-Qibla &amp; Salah</Text>
          <Text style={styles.subtitle}>Production Islamic Compass</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.locationBadge}
          onPress={onRefreshLocation}
          activeOpacity={0.7}
          disabled={isLoadingLocation}
        >
          <Ionicons
            name={isLoadingLocation ? 'sync' : 'location-sharp'}
            size={14}
            color={COLORS.emerald}
            style={isLoadingLocation ? styles.spinIcon : undefined}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {cityName ? (countryName ? `${cityName}, ${countryName}` : cityName) : 'Locating...'}
          </Text>
        </TouchableOpacity>

        {onOpenSettings && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    maxWidth: '82%',
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  spinIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
