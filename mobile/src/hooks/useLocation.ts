import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_FALLBACK_LOCATION } from '../constants/config';
import { LocationState, UserCoordinates } from '../types';

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    cityName: null,
    countryName: null,
    loading: true,
    permissionGranted: false,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 1. Request foreground permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        // Fallback to Karachi default if permission denied
        setState({
          coords: {
            latitude: DEFAULT_FALLBACK_LOCATION.latitude,
            longitude: DEFAULT_FALLBACK_LOCATION.longitude,
          },
          cityName: `${DEFAULT_FALLBACK_LOCATION.cityName} (Default)`,
          countryName: DEFAULT_FALLBACK_LOCATION.countryName,
          loading: false,
          permissionGranted: false,
          error: 'Location permission was denied. Showing default location (Karachi).',
        });
        return;
      }

      // 2. Fetch current GPS position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userCoords: UserCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // 3. Reverse geocode to get city and country names
      let city = 'Current Location';
      let country = '';

      try {
        const [geocoded] = await Location.reverseGeocodeAsync(userCoords);
        if (geocoded) {
          city = geocoded.city || geocoded.subregion || geocoded.region || 'Current Location';
          country = geocoded.country || '';
        }
      } catch {
        // Reverse geocoding can fail offline; keep coordinates
      }

      setState({
        coords: userCoords,
        cityName: city,
        countryName: country,
        loading: false,
        permissionGranted: true,
        error: null,
      });
    } catch (err: any) {
      console.log('[useLocation] Error fetching location:', err);
      setState({
        coords: {
          latitude: DEFAULT_FALLBACK_LOCATION.latitude,
          longitude: DEFAULT_FALLBACK_LOCATION.longitude,
        },
        cityName: `${DEFAULT_FALLBACK_LOCATION.cityName} (Fallback)`,
        countryName: DEFAULT_FALLBACK_LOCATION.countryName,
        loading: false,
        permissionGranted: false,
        error: err?.message || 'Could not retrieve location. Using fallback.',
      });
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    ...state,
    refreshLocation: fetchLocation,
  };
}
