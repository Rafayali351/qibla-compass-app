import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CountdownState } from '../hooks/usePrayerTimes';
import { PrayerTimeItem } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface CountdownTimerProps {
  countdown: CountdownState;
  nextPrayer: PrayerTimeItem | null;
  methodName?: string;
  madhabName?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdown,
  nextPrayer,
  methodName = 'Karachi',
  madhabName = 'Hanafi',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <View style={styles.pulsingDot} />
          <Text style={styles.badgeText}>UPCOMING PRAYER</Text>
        </View>
        <Text style={styles.methodInfo} numberOfLines={1}>
          {methodName} • {madhabName}
        </Text>
      </View>

      <View style={styles.prayerTitleRow}>
        <View>
          <Text style={styles.prayerName}>{nextPrayer?.label || 'Prayer'}</Text>
          <Text style={styles.prayerTime}>
            At {nextPrayer?.formattedTime || '--:--'}
          </Text>
        </View>
        <Text style={styles.arabicName}>{nextPrayer?.arabicLabel || ''}</Text>
      </View>

      {/* Countdown Digits */}
      <View style={styles.digitsContainer}>
        <View style={styles.digitBox}>
          <Text style={styles.digitNumber}>{countdown.hours}</Text>
          <Text style={styles.digitLabel}>HOURS</Text>
        </View>

        <Text style={styles.digitColon}>:</Text>

        <View style={styles.digitBox}>
          <Text style={styles.digitNumber}>{countdown.minutes}</Text>
          <Text style={styles.digitLabel}>MINS</Text>
        </View>

        <Text style={styles.digitColon}>:</Text>

        <View style={styles.digitBox}>
          <Text style={[styles.digitNumber, styles.activeSecond]}>{countdown.seconds}</Text>
          <Text style={styles.digitLabel}>SECS</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Ionicons name="time-outline" size={14} color={COLORS.gold} />
        <Text style={styles.footerText}>Live countdown based on your dynamic GPS coordinates</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    ...SHADOWS.card,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  methodInfo: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    maxWidth: '50%',
  },
  prayerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  prayerName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  prayerTime: {
    fontSize: 14,
    color: COLORS.emeraldLight,
    fontWeight: '600',
    marginTop: 2,
  },
  arabicName: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(251, 191, 36, 0.65)',
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 24, 0.6)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  digitBox: {
    alignItems: 'center',
    minWidth: 64,
  },
  digitNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  activeSecond: {
    color: COLORS.gold,
  },
  digitLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
    letterSpacing: 1,
  },
  digitColon: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginHorizontal: SPACING.xs,
    paddingBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
});
