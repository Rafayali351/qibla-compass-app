import { useEffect, useState, useMemo } from 'react';
import { calculatePrayerTimes, getFormattedDateStrings } from '../services/prayerTimesService';
import { CalculationMethodKey, MadhabKey, PrayerTimesData, UserCoordinates } from '../types';

export interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
}

export function usePrayerTimes(
  coords: UserCoordinates | null,
  methodKey: CalculationMethodKey = 'Karachi',
  madhabKey: MadhabKey = 'Hanafi'
) {
  const [now, setNow] = useState<Date>(new Date());

  // Update clock every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerData: PrayerTimesData | null = useMemo(() => {
    if (!coords) return null;
    return calculatePrayerTimes(coords, now, methodKey, madhabKey);
  }, [coords?.latitude, coords?.longitude, methodKey, madhabKey, now.getDate()]);

  const countdown: CountdownState = useMemo(() => {
    if (!prayerData || !prayerData.nextPrayerTime) {
      return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0 };
    }

    const diffMs = prayerData.nextPrayerTime.getTime() - now.getTime();
    if (diffMs <= 0) {
      return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0 };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
      totalSeconds,
    };
  }, [prayerData?.nextPrayerTime, now]);

  const dateStrings = useMemo(() => getFormattedDateStrings(now), [now.getDate()]);

  return {
    prayerData,
    countdown,
    dateStrings,
    now,
  };
}
