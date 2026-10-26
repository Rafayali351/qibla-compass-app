import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getAngularDifference, isDeviceAlignedWithQibla } from '../services/qiblaService';

interface CompassDialProps {
  heading: number; // Device current heading (0-360)
  qiblaBearing: number; // Target bearing to Mecca (0-360)
  cardinal: string;
  distanceKm: number;
}

const { width } = Dimensions.get('window');
const DIAL_SIZE = Math.min(width - 64, 320);
const RADIUS = DIAL_SIZE / 2;

export const CompassDial: React.FC<CompassDialProps> = ({
  heading,
  qiblaBearing,
  cardinal,
  distanceKm,
}) => {
  const isAligned = isDeviceAlignedWithQibla(heading, qiblaBearing, 3);
  const angularDiff = getAngularDifference(heading, qiblaBearing);

  // Compass dial rotates opposite to device heading so 'N' points to physical North
  const dialRotation = `-${heading}deg`;

  // Qibla needle angle relative to top of device
  const relativeQiblaAngle = (qiblaBearing - heading + 360) % 360;
  const needleRotation = `${relativeQiblaAngle}deg`;

  // Direction instruction text
  let instruction = '';
  if (isAligned) {
    instruction = 'Aligned with Qibla! Face this direction.';
  } else if (angularDiff > 0) {
    instruction = `Turn ${Math.round(angularDiff)}° Right`;
  } else {
    instruction = `Turn ${Math.round(Math.abs(angularDiff))}° Left`;
  }

  return (
    <View style={styles.container}>
      {/* Alignment Status Banner */}
      <View
        style={[
          styles.alignmentBadge,
          isAligned ? styles.alignedBadgeActive : styles.alignedBadgeInactive,
        ]}
      >
        <Ionicons
          name={isAligned ? 'checkmark-circle' : 'compass'}
          size={18}
          color={isAligned ? COLORS.emeraldLight : COLORS.gold}
        />
        <Text style={[styles.alignmentText, isAligned && styles.alignedTextActive]}>
          {instruction}
        </Text>
      </View>

      {/* Main Rotating Compass Container */}
      <View style={[styles.dialWrapper, isAligned && styles.dialWrapperAligned]}>
        {/* Forward Heading Marker (Device Top Reference) */}
        <View style={styles.forwardIndicator}>
          <View style={[styles.forwardArrow, isAligned && styles.forwardArrowAligned]} />
        </View>

        {/* Rotating Compass Ring */}
        <View style={[styles.dial, { transform: [{ rotate: dialRotation }] }]}>
          {/* Degree Ticks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = i * 15;
            const isMajor = angle % 90 === 0;
            const isSemi = angle % 45 === 0;
            return (
              <View
                key={i}
                style={[
                  styles.tickContainer,
                  { transform: [{ rotate: `${angle}deg` }] },
                ]}
              >
                <View
                  style={[
                    styles.tick,
                    isMajor && styles.tickMajor,
                    isSemi && !isMajor && styles.tickSemi,
                  ]}
                />
              </View>
            );
          })}

          {/* Cardinal Directions */}
          <Text style={[styles.cardinalLabel, styles.north]}>N</Text>
          <Text style={[styles.cardinalLabel, styles.east]}>E</Text>
          <Text style={[styles.cardinalLabel, styles.south]}>S</Text>
          <Text style={[styles.cardinalLabel, styles.west]}>W</Text>

          {/* Kaaba Marker on Dial at Qibla Bearing */}
          <View
            style={[
              styles.kaabaMarkerContainer,
              { transform: [{ rotate: `${qiblaBearing}deg` }] },
            ]}
          >
            <View style={styles.kaabaIconBadge}>
              <Ionicons name="cube" size={14} color={COLORS.gold} />
            </View>
          </View>
        </View>

        {/* Qibla Needle (Points relative to device top) */}
        <View style={[styles.needleLayer, { transform: [{ rotate: needleRotation }] }]}>
          {/* Top Half: Golden Qibla Pointer */}
          <View style={styles.needlePointerGold}>
            <View style={[styles.needleHeadGold, isAligned && styles.needleHeadAligned]} />
            <View style={styles.needleStemGold} />
          </View>

          {/* Bottom Half: Counterweight */}
          <View style={styles.needleCounterweight} />
        </View>

        {/* Center Hub */}
        <View style={[styles.centerHub, isAligned && styles.centerHubAligned]}>
          <View style={styles.centerInnerDot}>
            <Ionicons
              name={isAligned ? 'checkmark' : 'locate'}
              size={14}
              color={isAligned ? COLORS.emeraldLight : COLORS.gold}
            />
          </View>
        </View>
      </View>

      {/* Numerical Bearing & Telemetry Row */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>QIBLA BEARING</Text>
          <Text style={styles.telemetryValueGold}>{qiblaBearing}°</Text>
          <Text style={styles.telemetrySub}>{cardinal}</Text>
        </View>

        <View style={styles.telemetryDivider} />

        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>HEADING</Text>
          <Text style={styles.telemetryValue}>{Math.round(heading)}°</Text>
          <Text style={styles.telemetrySub}>From North</Text>
        </View>

        <View style={styles.telemetryDivider} />

        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>DISTANCE</Text>
          <Text style={styles.telemetryValueEmerald}>{distanceKm.toLocaleString()}</Text>
          <Text style={styles.telemetrySub}>km to Kaaba</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  alignmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  alignedBadgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: COLORS.emerald,
    ...SHADOWS.glowEmerald,
  },
  alignedBadgeInactive: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  alignmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.goldLight,
    marginLeft: 8,
  },
  alignedTextActive: {
    color: COLORS.emeraldLight,
  },
  dialWrapper: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: RADIUS,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
    position: 'relative',
  },
  dialWrapperAligned: {
    borderColor: COLORS.emerald,
    ...SHADOWS.glowEmerald,
  },
  forwardIndicator: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
    alignItems: 'center',
  },
  forwardArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.gold,
  },
  forwardArrowAligned: {
    borderBottomColor: COLORS.emerald,
  },
  dial: {
    width: DIAL_SIZE - 20,
    height: DIAL_SIZE - 20,
    borderRadius: (DIAL_SIZE - 20) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickContainer: {
    position: 'absolute',
    width: DIAL_SIZE - 20,
    height: DIAL_SIZE - 20,
    alignItems: 'center',
  },
  tick: {
    width: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tickSemi: {
    width: 2,
    height: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  tickMajor: {
    width: 2.5,
    height: 12,
    backgroundColor: COLORS.gold,
  },
  cardinalLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  north: {
    top: 14,
    color: COLORS.needleNorth,
  },
  south: {
    bottom: 14,
  },
  east: {
    right: 14,
  },
  west: {
    left: 14,
  },
  kaabaMarkerContainer: {
    position: 'absolute',
    width: DIAL_SIZE - 20,
    height: DIAL_SIZE - 20,
    alignItems: 'center',
  },
  kaabaIconBadge: {
    top: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  needleLayer: {
    position: 'absolute',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  needlePointerGold: {
    position: 'absolute',
    top: 28,
    alignItems: 'center',
  },
  needleHeadGold: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 38,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.gold,
  },
  needleHeadAligned: {
    borderBottomColor: COLORS.emerald,
  },
  needleStemGold: {
    width: 4,
    height: 48,
    backgroundColor: COLORS.gold,
    marginTop: -2,
    borderRadius: 2,
  },
  needleCounterweight: {
    position: 'absolute',
    bottom: 42,
    width: 4,
    height: 38,
    backgroundColor: COLORS.needleSouth,
    borderRadius: 2,
  },
  centerHub: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...SHADOWS.glowGold,
  },
  centerHubAligned: {
    borderColor: COLORS.emerald,
    ...SHADOWS.glowEmerald,
  },
  centerInnerDot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  telemetryItem: {
    alignItems: 'center',
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  telemetryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
    fontVariant: ['tabular-nums'],
  },
  telemetryValueGold: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.gold,
    marginVertical: 2,
    fontVariant: ['tabular-nums'],
  },
  telemetryValueEmerald: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.emeraldLight,
    marginVertical: 2,
    fontVariant: ['tabular-nums'],
  },
  telemetrySub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  telemetryDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
