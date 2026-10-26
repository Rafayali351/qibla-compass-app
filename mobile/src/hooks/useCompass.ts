import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { CompassState } from '../types';

export function useCompass() {
  const [compassState, setCompassState] = useState<CompassState>({
    heading: 0,
    sensorAvailable: true,
    permissionGranted: false,
    error: null,
    isCalibrated: true,
  });

  // Vector smoothing state to prevent jitter across 360/0 degree boundary
  const smoothedVector = useRef<{ x: number; y: number }>({ x: 0, y: 1 });
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initCompass() {
      try {
        // Request Location permission for heading services
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setCompassState((prev) => ({
              ...prev,
              permissionGranted: false,
              error: 'Compass requires location permissions to determine True North.',
            }));
          }
          return;
        }

        if (isMounted) {
          setCompassState((prev) => ({ ...prev, permissionGranted: true }));
        }

        // Try high-accuracy OS sensor-fused heading first
        const hasCompass = await Location.hasServicesEnabledAsync();

        if (hasCompass) {
          try {
            subscriptionRef.current = await Location.watchHeadingAsync((headingData) => {
              if (!isMounted) return;

              const rawHeading =
                headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;

              // Apply exponential smoothing filter using unit circle components
              const rad = (rawHeading * Math.PI) / 180;
              const alpha = 0.25; // Smoothing factor (0 = rigid, 1 = no smoothing)

              smoothedVector.current.x = (1 - alpha) * smoothedVector.current.x + alpha * Math.sin(rad);
              smoothedVector.current.y = (1 - alpha) * smoothedVector.current.y + alpha * Math.cos(rad);

              const smoothedRad = Math.atan2(smoothedVector.current.x, smoothedVector.current.y);
              const smoothedDeg = (smoothedRad * 180) / Math.PI;
              const normalized = (smoothedDeg + 360) % 360;

              setCompassState({
                heading: Math.round(normalized * 10) / 10,
                sensorAvailable: true,
                permissionGranted: true,
                error: null,
                isCalibrated: headingData.accuracy > 1,
              });
            });
            return;
          } catch (e) {
            console.log('[useCompass] Falling back to Magnetometer sensor:', e);
          }
        }

        // Fallback to Magnetometer from expo-sensors
        const isMagnetometerAvailable = await Magnetometer.isAvailableAsync();
        if (!isMagnetometerAvailable) {
          if (isMounted) {
            setCompassState((prev) => ({
              ...prev,
              sensorAvailable: false,
              error: 'Magnetometer sensor is not available on this device.',
            }));
          }
          return;
        }

        Magnetometer.setUpdateInterval(50); // 20Hz update rate
        subscriptionRef.current = Magnetometer.addListener((data) => {
          if (!isMounted) return;

          // Compute azimuth angle: top of device is +Y
          const rawAngle = Math.atan2(-data.x, data.y) * (180 / Math.PI);
          const rawHeading = (rawAngle + 360) % 360;

          const rad = (rawHeading * Math.PI) / 180;
          const alpha = 0.2;

          smoothedVector.current.x = (1 - alpha) * smoothedVector.current.x + alpha * Math.sin(rad);
          smoothedVector.current.y = (1 - alpha) * smoothedVector.current.y + alpha * Math.cos(rad);

          const smoothedRad = Math.atan2(smoothedVector.current.x, smoothedVector.current.y);
          const smoothedDeg = (smoothedRad * 180) / Math.PI;
          const normalized = (smoothedDeg + 360) % 360;

          setCompassState({
            heading: Math.round(normalized * 10) / 10,
            sensorAvailable: true,
            permissionGranted: true,
            error: null,
            isCalibrated: true,
          });
        });
      } catch (err: any) {
        if (isMounted) {
          setCompassState((prev) => ({
            ...prev,
            error: err?.message || 'Failed to initialize compass sensor.',
          }));
        }
      }
    }

    initCompass();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        if (typeof subscriptionRef.current.remove === 'function') {
          subscriptionRef.current.remove();
        }
      }
    };
  }, []);

  return compassState;
}
