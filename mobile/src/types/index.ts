export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeItem {
  id: PrayerName;
  label: string;
  arabicLabel: string;
  time: Date;
  formattedTime: string;
  isNext: boolean;
  isCurrent: boolean;
}

export interface PrayerTimesData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  list: PrayerTimeItem[];
  currentPrayer: PrayerTimeItem | null;
  nextPrayer: PrayerTimeItem | null;
  nextPrayerTime: Date | null;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  coords: UserCoordinates | null;
  cityName: string | null;
  countryName: string | null;
  loading: boolean;
  permissionGranted: boolean;
  error: string | null;
}

export interface CompassState {
  heading: number; // 0 - 360 degrees
  sensorAvailable: boolean;
  permissionGranted: boolean;
  error: string | null;
  isCalibrated: boolean;
}

export interface QiblaInfo {
  bearing: number; // Great circle bearing to Mecca (0-360)
  cardinal: string; // e.g. "W", "ENE"
  distanceKm: number;
  distanceMiles: number;
}

export type CalculationMethodKey =
  | 'Karachi'
  | 'MuslimWorldLeague'
  | 'NorthAmerica'
  | 'Egyptian'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'Singapore'
  | 'Tehran';

export type MadhabKey = 'Hanafi' | 'Shafi';

export interface UserSettings {
  method: CalculationMethodKey;
  madhab: MadhabKey;
  notificationsEnabled: boolean;
  backendSyncEnabled: boolean;
  backendUrl: string;
}
