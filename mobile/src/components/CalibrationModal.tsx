import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CalibrationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="axis-z-rotate-clockwise" size={26} color={COLORS.gold} />
            </View>
            <Text style={styles.title}>Compass Calibration</Text>
            <Text style={styles.subtitle}>Calibrate your sensor for 100% Qibla accuracy</Text>
          </View>

          {/* Visual Figure-8 Graphic */}
          <View style={styles.graphicContainer}>
            <View style={styles.infinityWrapper}>
              <Text style={styles.infinitySymbol}>∞</Text>
              <View style={styles.phoneIconOverlay}>
                <Ionicons name="phone-portrait-outline" size={28} color={COLORS.emeraldLight} />
              </View>
            </View>
            <Text style={styles.graphicCaption}>Wave phone in a smooth Figure-8 motion</Text>
          </View>

          {/* Instructions List */}
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Hold the phone flat in the palm of your hand away from magnetic interference.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Move your phone smoothly in a figure-8 motion 2 to 3 times through the air.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Ensure phone is not resting on metal tables, near laptops, or inside magnetic wallet cases.
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Calibrated &amp; Ready</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...SHADOWS.card,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
    backgroundColor: 'rgba(7, 13, 24, 0.5)',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infinityWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  infinitySymbol: {
    fontSize: 84,
    color: 'rgba(245, 158, 11, 0.3)',
    fontWeight: '300',
    lineHeight: 84,
  },
  phoneIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.goldLight,
    marginTop: 4,
  },
  stepsList: {
    marginBottom: SPACING.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm + 2,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emeraldLight,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: COLORS.emerald,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.glowEmerald,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#070D18',
  },
});
