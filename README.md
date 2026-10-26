# Al-Qibla & Prayer Times (Production Mobile App & Spring Boot Backend)

A production-ready mobile application and companion backend service designed for high-accuracy Islamic prayer times calculation and real-time Great-Circle Qibla direction tracking.

---

## 🏛️ System Architecture

```
d:\qibla direction\
├── mobile/                     # React Native Expo (TypeScript)
│   ├── assets/                 # App icons, splash screens
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   │   ├── CompassDial.tsx         # Real-time rotating compass with visual Qibla beacon
│   │   │   ├── CountdownTimer.tsx      # Second-by-second live countdown to upcoming prayer
│   │   │   ├── PrayerCard.tsx          # 6 Daily prayers (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
│   │   │   ├── CalibrationModal.tsx    # Visual Figure-8 motion calibration guide
│   │   │   ├── PermissionBanner.tsx    # Location & Sensor permission handler
│   │   │   └── Header.tsx              # Dynamic GPS location badge and header
│   │   ├── hooks/              # Custom React Hooks
│   │   │   ├── useLocation.ts          # expo-location GPS hook with reverse geocoding
│   │   │   ├── useCompass.ts           # expo-sensors Magnetometer & OS sensor fusion
│   │   │   └── usePrayerTimes.ts       # adhan JS prayer calculations & countdown ticker
│   │   ├── services/           # Business Logic Services
│   │   │   ├── prayerTimesService.ts   # Karachi method + Hanafi Asr defaults
│   │   │   ├── qiblaService.ts         # Great-Circle Forward Azimuth math
│   │   │   └── apiService.ts           # Spring Boot REST sync with offline resilience
│   │   ├── constants/          # Theme & Config
│   │   │   ├── theme.ts                # Islamic nocturnal palette (Gold, Emerald, Deep Navy)
│   │   │   └── config.ts               # Kaaba coordinates (21.4225° N, 39.8262° E)
│   │   └── types/              # Full TypeScript type safety
│   ├── App.tsx                 # Root tab navigation
│   └── package.json
│
└── backend/                    # Spring Boot Java Backend
    ├── src/main/java/com/qibla/app/
    │   ├── QiblaPrayerApplication.java
    │   ├── controller/
    │   │   ├── QiblaCalculationController.java  # GET /api/qibla/bearing
    │   │   ├── UserPreferenceController.java    # GET/POST/PUT /api/preferences
    │   │   └── HealthController.java            # GET /api/health
    │   ├── service/
    │   │   ├── QiblaCalculationService.java     # Spherical Trigonometry Azimuth & Haversine
    │   │   └── UserPreferenceService.java       # User preference persistence
    │   ├── model/
    │   │   ├── UserPreference.java              # JPA Entity
    │   │   ├── CalculationMethodType.java       # Karachi, MWL, ISNA, Egypt, Makkah, etc.
    │   │   └── MadhabType.java                  # Hanafi (ratio 2) vs Shafi (ratio 1)
    │   ├── repository/
    │   │   └── UserPreferenceRepository.java
    │   ├── dto/                                 # Request / Response DTOs
    │   ├── exception/                           # Global Exception Handler
    │   └── config/
    │       └── CorsConfig.java                  # Universal CORS for Expo mobile & web
    ├── src/main/resources/
    │   ├── application.yml                      # Embedded H2 in-memory DB configuration
    │   └── application-prod.yml                 # Ready-to-use PostgreSQL migration profile
    ├── pom.xml                                  # Maven dependencies (Java 17/21)
    ├── mvnw / mvnw.cmd                          # Maven Wrapper (no global Maven install needed)
    └── run.bat                                  # 1-click startup script for Windows
```

---

## 🧮 Mathematical Formulas & Principles

### 1. Great-Circle Forward Azimuth (Qibla Bearing)
The angle $\theta$ from the user's location $(\phi_1, \lambda_1)$ to the Holy Kaaba $(\phi_2 = 21.4225^\circ\text{ N}, \lambda_2 = 39.8262^\circ\text{ E})$ is determined via spherical trigonometry:

$$\Delta\lambda = \lambda_2 - \lambda_1$$

$$y = \sin(\Delta\lambda) \cdot \cos(\phi_2)$$

$$x = \cos(\phi_1) \cdot \sin(\phi_2) - \sin(\phi_1) \cdot \cos(\phi_2) \cdot \cos(\Delta\lambda)$$

$$\theta = (\text{atan2}(y, x) \cdot \frac{180}{\pi} + 360) \pmod{360}$$

### 2. Great-Circle Distance (Haversine Formula)
$$a = \sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$

$$d = 2 \cdot R \cdot \text{atan2}(\sqrt{a}, \sqrt{1 - a}) \quad (R = 6371 \text{ km})$$

### 3. Asr Shadow Jurisprudence (Madhab)
- **Hanafi (Default):** Asr starts when the shadow of an object equals **twice** its length plus the noon shadow length ($T = 2$).
- **Shafi'i / Maliki / Hanbali:** Asr starts when the shadow of an object equals **once** its length plus the noon shadow length ($T = 1$).

### 4. Vector Smoothing Filter (Heading Discontinuity Protection)
To prevent erratic shaking and avoid the $0^\circ \leftrightarrow 360^\circ$ jump bug, raw magnetometer readings are smoothed across a unit circle:

$$v_x(t) = (1 - \alpha) \cdot v_x(t-1) + \alpha \cdot \sin(\theta_{raw})$$

$$v_y(t) = (1 - \alpha) \cdot v_y(t-1) + \alpha \cdot \cos(\theta_{raw})$$

$$\theta_{smooth} = (\text{atan2}(v_x, v_y) \cdot \frac{180}{\pi} + 360) \pmod{360}$$

---

## 🚀 How to Run the Project

### 📱 1. Mobile App (Expo Go with Tunnel Mode)

Run on any physical Android or iOS device without Android Studio or USB cables:

```powershell
# Navigate to mobile project directory
cd "d:\qibla direction\mobile"

# Launch in Expo Tunnel mode
npx expo start --tunnel
```

1. Install **Expo Go** from the Google Play Store or Apple App Store on your phone.
2. Open your camera app (iOS) or the Expo Go app (Android) and scan the QR code displayed in your terminal.
3. The app will bundle and load dynamically onto your device!

### ☕ 2. Spring Boot Backend

Start the backend server with embedded H2 database:

**Option A (1-Click on Windows):**
Double-click `d:\qibla direction\backend\run.bat`

**Option B (PowerShell / Terminal):**
```powershell
cd "d:\qibla direction\backend"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run
```

- **Health check:** `http://localhost:8080/api/health`
- **H2 Console:** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:qibladb`, User: `sa`, Password: empty)
- **Qibla calculation API:** `http://localhost:8080/api/qibla/bearing?latitude=24.8607&longitude=67.0011`
- **User preferences API:** `http://localhost:8080/api/preferences/device-user-default`

---

## ✨ Features Implemented

1. **Screen 1: Prayer Times**
   - Dynamic GPS positioning with automatic city & country reverse geocoding.
   - Calculations via `adhan` JS library using **University of Islamic Sciences, Karachi** and **Hanafi** Asr jurisprudence.
   - Real-time countdown timer to the upcoming prayer (Hours, Minutes, Seconds).
   - Gregorian & Islamic Hijri calendar date display.
   - Visual highlighting of current active prayer and next prayer.

2. **Screen 2: Real-time Qibla Compass**
   - Live device orientation tracking using `expo-sensors` (`Magnetometer`) and OS heading fusion.
   - Accurate Great-Circle bearing angle from GPS to the Holy Kaaba (`21.4225° N, 39.8262° E`).
   - Smooth rotating compass dial with golden Qibla needle and cardinal markers.
   - Alignment feedback: Compass turns radiant emerald and pulses when aligned within $\pm 3^\circ$.
   - Interactive Figure-8 calibration modal and instructions.

3. **Screen 3: Preferences & Backend Synchronization**
   - Switch calculation conventions (Karachi, MWL, ISNA, Egypt, Umm al-Qura, Dubai, Singapore, etc.).
   - Switch Asr Madhab (Hanafi vs Shafi'i).
   - Test connectivity and persist preferences to the Spring Boot REST API.
