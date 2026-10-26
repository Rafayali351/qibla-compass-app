import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import { CalculationMethodKey, MadhabKey, PrayerName, PrayerTimeItem, PrayerTimesData, UserCoordinates } from '../types';

/**
 * Returns the adhan CalculationMethod based on the selected key.
 */
function getAdhanCalculationMethod(methodKey: CalculationMethodKey) {
  switch (methodKey) {
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'MuslimWorldLeague':
      return CalculationMethod.MuslimWorldLeague();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Tehran':
      return CalculationMethod.Tehran();
    default:
      return CalculationMethod.Karachi();
  }
}

/**
 * Returns the adhan Madhab enum based on the selected key.
 */
function getAdhanMadhab(madhabKey: MadhabKey) {
  switch (madhabKey) {
    case 'Hanafi':
      return Madhab.Hanafi;
    case 'Shafi':
    default:
      return Madhab.Shafi;
  }
}

/**
 * Formats a Date object to 12-hour AM/PM format (e.g., "05:14 AM").
 */
export function formatPrayerTime(date: Date): string {
  if (!date || isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculates prayer times for a given day, user coordinates, calculation method, and madhab.
 * Defaults: University of Islamic Sciences, Karachi and Hanafi Asr.
 */
export function calculatePrayerTimes(
  coords: UserCoordinates,
  date: Date = new Date(),
  methodKey: CalculationMethodKey = 'Karachi',
  madhabKey: MadhabKey = 'Hanafi'
): PrayerTimesData {
  const coordinates = new Coordinates(coords.latitude, coords.longitude);
  const params = getAdhanCalculationMethod(methodKey);
  params.madhab = getAdhanMadhab(madhabKey);

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const currentPrayerName = prayerTimes.currentPrayer() as PrayerName | 'none';
  let nextPrayerName = prayerTimes.nextPrayer() as PrayerName | 'none';

  let nextPrayerTime: Date | null = null;

  if (nextPrayerName === 'none') {
    // If all prayers for today have passed, next prayer is tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = new PrayerTimes(coordinates, tomorrow, params);
    nextPrayerTime = tomorrowPrayers.fajr;
    nextPrayerName = 'fajr';
  } else {
    nextPrayerTime = prayerTimes.timeForPrayer(nextPrayerName);
  }

  const rawList: { id: PrayerName; label: string; arabicLabel: string; time: Date }[] = [
    { id: 'fajr', label: 'Fajr', arabicLabel: 'الفجر', time: prayerTimes.fajr },
    { id: 'sunrise', label: 'Sunrise', arabicLabel: 'الشروق', time: prayerTimes.sunrise },
    { id: 'dhuhr', label: 'Dhuhr', arabicLabel: 'الظهر', time: prayerTimes.dhuhr },
    { id: 'asr', label: 'Asr', arabicLabel: 'العصر', time: prayerTimes.asr },
    { id: 'maghrib', label: 'Maghrib', arabicLabel: 'المغرب', time: prayerTimes.maghrib },
    { id: 'isha', label: 'Isha', arabicLabel: 'العشاء', time: prayerTimes.isha },
  ];

  const list: PrayerTimeItem[] = rawList.map((item) => ({
    ...item,
    formattedTime: formatPrayerTime(item.time),
    isNext: item.id === nextPrayerName,
    isCurrent: item.id === currentPrayerName,
  }));

  const nextPrayerItem = list.find((p) => p.id === nextPrayerName) || null;
  const currentPrayerItem = list.find((p) => p.id === currentPrayerName) || null;

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    list,
    currentPrayer: currentPrayerItem,
    nextPrayer: nextPrayerItem,
    nextPrayerTime,
  };
}

/**
 * Returns formatted Gregorian and approximate Islamic Hijri date strings.
 */
export function getFormattedDateStrings(date: Date = new Date()): { gregorian: string; hijri: string } {
  const gregorian = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let hijri = '';
  try {
    // Uses standard Intl Islamic calendar support
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    hijri = formatter.format(date);
  } catch {
    hijri = 'Islamic Calendar';
  }

  return { gregorian, hijri };
}
