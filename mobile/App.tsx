import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PrayerTimesScreen } from './src/screens/PrayerTimesScreen';
import { QiblaCompassScreen } from './src/screens/QiblaCompassScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { UserSettings } from './src/types';
import { DEFAULT_BACKEND_URL } from './src/constants/config';
import { COLORS, BORDER_RADIUS, SPACING } from './src/constants/theme';

type TabName = 'prayers' | 'qibla' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('prayers');

  // Production-grade defaults: Karachi calculation method & Hanafi Asr
  const [settings, setSettings] = useState<UserSettings>({
    method: 'Karachi',
    madhab: 'Hanafi',
    notificationsEnabled: true,
    backendSyncEnabled: true,
    backendUrl: DEFAULT_BACKEND_URL,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />

      <View style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.content}>
          {activeTab === 'prayers' && (
            <PrayerTimesScreen
              settings={settings}
              onOpenSettings={() => setActiveTab('settings')}
              onNavigateToQibla={() => setActiveTab('qibla')}
            />
          )}

          {activeTab === 'qibla' && (
            <QiblaCompassScreen onOpenSettings={() => setActiveTab('settings')} />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={setSettings}
              onClose={() => setActiveTab('prayers')}
            />
          )}
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'prayers' && styles.navTabActive]}
            onPress={() => setActiveTab('prayers')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'prayers' ? 'time' : 'time-outline'}
              size={22}
              color={activeTab === 'prayers' ? COLORS.emerald : COLORS.textMuted}
            />
            <Text style={[styles.navText, activeTab === 'prayers' && styles.navTextActive]}>
              Prayer Times
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'qibla' && styles.navTabActive]}
            onPress={() => setActiveTab('qibla')}
            activeOpacity={0.7}
          >
            <View style={styles.compassIconWrapper}>
              <Ionicons
                name={activeTab === 'qibla' ? 'compass' : 'compass-outline'}
                size={24}
                color={activeTab === 'qibla' ? COLORS.gold : COLORS.textMuted}
              />
            </View>
            <Text style={[styles.navText, activeTab === 'qibla' && styles.navTextGold]}>
              Qibla Compass
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'settings' && styles.navTabActive]}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'options' : 'options-outline'}
              size={22}
              color={activeTab === 'settings' ? COLORS.emerald : COLORS.textMuted}
            />
            <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.tabBarBorder,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 84,
  },
  navTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.emerald,
    fontWeight: '700',
  },
  navTextGold: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  compassIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
