import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface PermissionBannerProps {
  message: string;
  onRequestPermission: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  buttonText?: string;
}

export const PermissionBanner: React.FC<PermissionBannerProps> = ({
  message,
  onRequestPermission,
  icon = 'location-outline',
  buttonText = 'Enable Access',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={COLORS.gold} />
        <Text style={styles.text}>{message}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onRequestPermission}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: SPACING.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  button: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#070D18',
  },
});
