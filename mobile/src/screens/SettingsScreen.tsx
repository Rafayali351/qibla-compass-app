import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CALCULATION_METHODS, MADHABS } from '../constants/config';
import { CalculationMethodKey, MadhabKey, UserSettings } from '../types';
import { ApiService } from '../services/apiService';
import { useLocation } from '../hooks/useLocation';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const { coords, cityName, countryName } = useLocation();

  const [currentSettings, setCurrentSettings] = useState<UserSettings>(settings);
  const [syncing, setSyncing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unchecked' | 'online' | 'offline'>('unchecked');

  const handleMethodSelect = (method: CalculationMethodKey) => {
    const updated = { ...currentSettings, method };
    setCurrentSettings(updated);
    onUpdateSettings(updated);
  };

  const handleMadhabSelect = (madhab: MadhabKey) => {
    const updated = { ...currentSettings, madhab };
    setCurrentSettings(updated);
    onUpdateSettings(updated);
  };

  const testBackendConnection = async () => {
    setSyncing(true);
    ApiService.setBaseUrl(currentSettings.backendUrl);
    const isHealthy = await ApiService.checkHealth();
    setBackendStatus(isHealthy ? 'online' : 'offline');
    setSyncing(false);
  };

  const syncWithBackend = async () => {
    if (!coords) {
      Alert.alert('GPS Required', 'Please enable GPS location to sync preferences to backend.');
      return;
    }

    setSyncing(true);
    ApiService.setBaseUrl(currentSettings.backendUrl);

    const payload = {
      userId: 'device-user-default',
      latitude: coords.latitude,
      longitude: coords.longitude,
      cityName: cityName || 'Karachi',
      countryName: countryName || 'Pakistan',
      calculationMethod: currentSettings.method.toUpperCase(),
      madhab: currentSettings.madhab.toUpperCase(),
      notificationsEnabled: currentSettings.notificationsEnabled,
    };

    const result = await ApiService.saveUserPreferences(payload);
    setSyncing(false);

    if (result) {
      setBackendStatus('online');
      Alert.alert(
        'Backend Synced',
        `Successfully synced preferences to Spring Boot backend!\nMethod: ${result.calculationMethodDisplayName || currentSettings.method}\nMadhab: ${result.madhabDisplayName || currentSettings.madhab}`
      );
    } else {
      setBackendStatus('offline');
      Alert.alert(
        'Sync Notice',
        `Could not reach backend at ${currentSettings.backendUrl}. The app continues using local high-precision calculation formulas.`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Preferences &amp; Backend</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Asr Juristic Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asr Jurisprudence (Madhab)</Text>
          <Text style={styles.sectionSubtitle}>
            Hanafi method calculates later Asr when shadow factor = 2.
          </Text>

          <View style={styles.optionsList}>
            {MADHABS.map((m) => {
              const isSelected = currentSettings.madhab === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleMadhabSelect(m.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                      {m.name}
                    </Text>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? COLORS.emerald : COLORS.textMuted}
                    />
                  </View>
                  <Text style={styles.optionDesc}>{m.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Calculation Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculation Convention</Text>
          <Text style={styles.sectionSubtitle}>
            Selected convention determines Fajr and Isha solar angles.
          </Text>

          <View style={styles.optionsList}>
            {CALCULATION_METHODS.map((method) => {
              const isSelected = currentSettings.method === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleMethodSelect(method.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                      {method.name}
                    </Text>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? COLORS.emerald : COLORS.textMuted}
                    />
                  </View>
                  <Text style={styles.optionDesc}>{method.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Spring Boot Backend Sync Section */}
        <View style={styles.section}>
          <View style={styles.backendHeader}>
            <Text style={styles.sectionTitle}>Spring Boot Backend</Text>
            {backendStatus === 'online' && (
              <View style={styles.onlineBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineText}>Connected</Text>
              </View>
            )}
            {backendStatus === 'offline' && (
              <View style={styles.offlineBadge}>
                <View style={styles.redDot} />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionSubtitle}>
            Persist user calculation settings and coordinates to the Spring Boot REST API.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Backend Base URL</Text>
            <TextInput
              style={styles.textInput}
              value={currentSettings.backendUrl}
              onChangeText={(text) => {
                const updated = { ...currentSettings, backendUrl: text };
                setCurrentSettings(updated);
                onUpdateSettings(updated);
              }}
              placeholder="http://localhost:8080"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.backendActions}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={testBackendConnection}
              disabled={syncing}
              activeOpacity={0.7}
            >
              <Text style={styles.testButtonText}>Test Ping</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.syncButton}
              onPress={syncWithBackend}
              disabled={syncing}
              activeOpacity={0.8}
            >
              {syncing ? (
                <ActivityIndicator size="small" color="#070D18" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={16} color="#070D18" />
                  <Text style={styles.syncButtonText}>Save to Backend</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  optionsList: {
    gap: SPACING.sm,
  },
  optionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  optionCardSelected: {
    borderColor: COLORS.emerald,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  optionNameSelected: {
    color: COLORS.emeraldLight,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  backendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emeraldLight,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
    marginRight: 6,
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  inputGroup: {
    marginTop: SPACING.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  backendActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  testButton: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  syncButton: {
    flex: 2,
    backgroundColor: COLORS.emerald,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.glowEmerald,
  },
  syncButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#070D18',
  },
});
