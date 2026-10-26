import { DEFAULT_BACKEND_URL } from '../constants/config';
import { CalculationMethodKey, MadhabKey, QiblaInfo, UserCoordinates } from '../types';

export interface BackendPreferenceRequest {
  userId: string;
  latitude: number;
  longitude: number;
  cityName?: string;
  countryName?: string;
  calculationMethod: string;
  madhab: string;
  notificationsEnabled: boolean;
}

export interface BackendPreferenceResponse {
  id?: number;
  userId: string;
  latitude: number;
  longitude: number;
  cityName?: string;
  countryName?: string;
  calculationMethod: string;
  calculationMethodDisplayName?: string;
  madhab: string;
  madhabDisplayName?: string;
  notificationsEnabled: boolean;
}

export class ApiService {
  private static baseUrl = DEFAULT_BACKEND_URL;

  public static setBaseUrl(url: string) {
    this.baseUrl = url.trim().replace(/\/$/, '');
  }

  public static getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Health check to test backend connectivity
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch saved user preferences from Spring Boot backend
   */
  public static async getUserPreferences(userId: string): Promise<BackendPreferenceResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/preferences/${userId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.log('[ApiService] Backend preferences fetch error:', err);
      return null;
    }
  }

  /**
   * Save or update preferences on Spring Boot backend
   */
  public static async saveUserPreferences(payload: BackendPreferenceRequest): Promise<BackendPreferenceResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.log('[ApiService] Backend preferences save error:', err);
      return null;
    }
  }

  /**
   * Server-side verified Qibla bearing calculation
   */
  public static async fetchQiblaBearing(coords: UserCoordinates): Promise<QiblaInfo | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/qibla/bearing?latitude=${coords.latitude}&longitude=${coords.longitude}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      return {
        bearing: data.bearingDegrees,
        cardinal: data.cardinalDirection,
        distanceKm: Math.round(data.distanceKm),
        distanceMiles: Math.round(data.distanceMiles),
      };
    } catch {
      return null;
    }
  }
}
