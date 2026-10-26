import { MECCA_COORDINATES } from '../constants/config';
import { QiblaInfo, UserCoordinates } from '../types';

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
];

/**
 * Calculates Great-Circle Forward Azimuth (Bearing) and distance from
 * any point on Earth to the Kaaba in Mecca (21.4225° N, 39.8262° E).
 */
export function calculateQiblaDirection(coords: UserCoordinates): QiblaInfo {
  const { latitude, longitude } = coords;

  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const lat2 = toRadians(MECCA_COORDINATES.latitude);
  const lon2 = toRadians(MECCA_COORDINATES.longitude);

  const deltaLon = lon2 - lon1;

  // Forward Azimuth (Bearing) formula:
  // y = sin(Δlon) * cos(lat2)
  // x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(Δlon)
  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (toDegrees(bearingRad) + 360) % 360;

  // Haversine Distance
  const R = 6371; // Earth radius in km
  const deltaLat = lat2 - lat1;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371;

  const cardinal = getCardinalDirection(bearingDeg);

  return {
    bearing: Number(bearingDeg.toFixed(1)),
    cardinal,
    distanceKm: Math.round(distanceKm),
    distanceMiles: Math.round(distanceMiles),
  };
}

/**
 * Converts a degree heading to 16-point cardinal compass text.
 */
export function getCardinalDirection(degrees: number): string {
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_POINTS[index];
}

/**
 * Calculates the shortest signed angular difference between current heading and Qibla bearing.
 * Returns negative if user needs to turn counter-clockwise (left), positive for clockwise (right).
 */
export function getAngularDifference(currentHeading: number, targetBearing: number): number {
  let diff = (targetBearing - currentHeading) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

/**
 * Checks whether the device is pointing within tolerance degrees of Qibla.
 */
export function isDeviceAlignedWithQibla(currentHeading: number, targetBearing: number, tolerance = 3): boolean {
  const diff = Math.abs(getAngularDifference(currentHeading, targetBearing));
  return diff <= tolerance;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
