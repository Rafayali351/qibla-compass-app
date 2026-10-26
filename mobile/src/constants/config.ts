import { CalculationMethodKey, MadhabKey } from '../types';

export const MECCA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
  name: 'Holy Kaaba, Mecca',
};

export const DEFAULT_FALLBACK_LOCATION = {
  latitude: 24.8607,
  longitude: 67.0011,
  cityName: 'Karachi',
  countryName: 'Pakistan',
};

export const CALCULATION_METHODS: { id: CalculationMethodKey; name: string; description: string }[] = [
  {
    id: 'Karachi',
    name: 'Univ. of Islamic Sciences, Karachi',
    description: 'Fajr 18.0°, Isha 18.0° (Standard for Pakistan, India, Bangladesh)',
  },
  {
    id: 'MuslimWorldLeague',
    name: 'Muslim World League (MWL)',
    description: 'Fajr 18.0°, Isha 17.0° (Europe, Far East, parts of US)',
  },
  {
    id: 'NorthAmerica',
    name: 'Islamic Society of North America (ISNA)',
    description: 'Fajr 15.0°, Isha 15.0° (North America standard)',
  },
  {
    id: 'Egyptian',
    name: 'Egyptian General Authority',
    description: 'Fajr 19.5°, Isha 17.5° (Africa, Syria, Lebanon, Malaysia)',
  },
  {
    id: 'UmmAlQura',
    name: 'Umm al-Qura, Makkah',
    description: 'Fajr 18.5°, Isha 90 min after Maghrib (Arabian Peninsula)',
  },
  {
    id: 'Dubai',
    name: 'Dubai / UAE',
    description: 'Fajr 18.2°, Isha 18.2° (UAE official method)',
  },
  {
    id: 'Qatar',
    name: 'Qatar Awqaf',
    description: 'Fajr 18.0°, Isha 90 min after Maghrib',
  },
  {
    id: 'Kuwait',
    name: 'Kuwait',
    description: 'Fajr 18.0°, Isha 17.5°',
  },
  {
    id: 'Singapore',
    name: 'Singapore (MUIS)',
    description: 'Fajr 20.0°, Isha 18.0°',
  },
  {
    id: 'Tehran',
    name: 'Univ. of Tehran (Geophysics)',
    description: 'Fajr 17.7°, Isha 14.0°',
  },
];

export const MADHABS: { id: MadhabKey; name: string; description: string }[] = [
  {
    id: 'Hanafi',
    name: 'Hanafi (Later Asr)',
    description: 'Asr starts when shadow of an object equals twice its length plus noon shadow.',
  },
  {
    id: 'Shafi',
    name: "Shafi'i / Maliki / Hanbali",
    description: 'Asr starts when shadow of an object equals its length plus noon shadow.',
  },
];

// Live Production Backend URL (Render / Railway HTTPS)
export const PRODUCTION_BACKEND_URL = 'https://qibla-backend.onrender.com';
export const LOCAL_BACKEND_URL = 'http://localhost:8080';

// Default to production for standalone APK builds; fallback supported in Settings
export const DEFAULT_BACKEND_URL = PRODUCTION_BACKEND_URL;

