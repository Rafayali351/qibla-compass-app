import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrayerName, PrayerTimeItem } from '../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface PrayerCardProps {
  item: PrayerTimeItem;
}

const PRAYER_ICONS: Record<PrayerName, keyof typeof Ionicons.glyphMap> = {
  fajr: 'cloudy-night-outline',
  sunrise: 'sunny-outline',
  dhuhr: 'sunny',
  asr: 'partly-sunny-outline',
  maghrib: 'partly-sunny',
  isha: 'moon-outline',
};

export const PrayerCard: React.FC<PrayerCardProps> = ({ item }) => {
  const iconName = PRAYER_ICONS[item.id] || 'time-outline';

  const cardStyle = [
    styles.card,
    item.isCurrent && styles.currentCard,
    item.isNext && styles.nextCard,
  ];

  return (
    <View style={cardStyle}>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconWrapper,
            item.isCurrent && styles.currentIconWrapper,
            item.isNext && styles.nextIconWrapper,
          ]}
        >
          <Ionicons
            name={iconName}
            size={22}
            color={
              item.isNext ? COLORS.gold : item.isCurrent ? COLORS.emerald : COLORS.textSecondary
            }
          />
        </View>

        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.prayerName,
                item.isNext && styles.goldText,
                item.isCurrent && styles.emeraldText,
              ]}
            >
              {item.label}
            </Text>

            {item.isNext && (
              <View style={styles.nextBadge}>
                <Text style={styles.nextBadgeText}>NEXT</Text>
              </View>
            )}

            {item.isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>ACTIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.arabicName}>{item.arabicLabel}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.timeText,
            item.isNext && styles.goldText,
            item.isCurrent && styles.emeraldText,
          ]}
        >
          {item.formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  currentCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  nextCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  currentIconWrapper: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  nextIconWrapper: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  arabicName: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  nextBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 8,
  },
  nextBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
  },
  currentBadge: {
    backgroundColor: COLORS.emerald,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 8,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  goldText: {
    color: COLORS.gold,
  },
  emeraldText: {
    color: COLORS.emeraldLight,
  },
});
