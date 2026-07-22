import { createContext, useContext, useState, useEffect } from "react";
import { CITIES } from "../data/locationsData";
import api from "../services/api";

const PredictionContext = createContext();

export function PredictionProvider({ children }) {
  const [activeLocation, setActiveLocation] = useState(CITIES[0]); // Default Delhi until GPS completes
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMapCoords, setSelectedMapCoords] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [locDetecting, setLocDetecting] = useState(true);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const selectLocation = (cityObj) => {
    setActiveLocation(cityObj);
    setSelectedMapCoords([cityObj.lat, cityObj.lng]);
    setPrediction({
      predictedAQI: cityObj.aqi,
      category: cityObj.category,
      city: cityObj.city,
      pm25: cityObj.pm25,
      pm10: cityObj.pm10,
      no2: cityObj.no2,
      co: cityObj.co,
      so2: cityObj.so2,
      o3: cityObj.o3,
    });
  };

  // Automatically detect user's standing location on initial load
  useEffect(() => {
    // Set initial fallback Delhi prediction
    selectLocation(CITIES[0]);

    if (!navigator.geolocation) {
      setLocDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // 1. Reverse Geocode via OpenStreetMap Nominatim
          let placeName = `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
          let stateName = "India";
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const geoData = await geoRes.json();
            if (geoData && geoData.address) {
              const addr = geoData.address;
              const localName =
                addr.suburb ||
                addr.neighbourhood ||
                addr.city_district ||
                addr.city ||
                addr.town ||
                addr.village ||
                "";
              stateName = addr.state || "India";
              if (localName) {
                placeName = `Near ${localName}`;
              }
            }
          } catch (e) {
            console.warn("Auto reverse geocode warning:", e);
          }

          // 2. Fetch nearest grid point AQI & pollutants
          let aqiData = null;
          try {
            const pRes = await api.get(`/api/point-aqi?lat=${lat}&lon=${lon}`);
            aqiData = pRes.data;
          } catch (e) {
            const directRes = await fetch(
              `http://127.0.0.1:8000/point-aqi?lat=${lat}&lon=${lon}`
            );
            aqiData = await directRes.json();
          }

          if (aqiData) {
            const userLocObj = {
              city: placeName,
              state: stateName,
              lat: lat,
              lng: lon,
              spi: aqiData.spi,
              spi_level: aqiData.spi_level,
              aqi: aqiData.aqi,
              category: aqiData.category,
              no2: aqiData.no2,
              co: aqiData.co,
              so2: aqiData.so2,
              o3: aqiData.o3,
              pm25: aqiData.pm25 || Math.round(aqiData.aqi * 0.55 * 10) / 10,
              pm10: aqiData.pm10 || Math.round(aqiData.aqi * 0.9 * 10) / 10,
            };

            selectLocation(userLocObj);
          }
        } catch (err) {
          console.warn("Auto location AQI lookup error, remaining on default:", err);
        } finally {
          setLocDetecting(false);
        }
      },
      (err) => {
        console.info("Geolocation permission denied or unavailable, using default Delhi location.");
        setLocDetecting(false);
      },
      { timeout: 8000 }
    );
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <PredictionContext.Provider
      value={{
        activeLocation,
        setActiveLocation,
        selectLocation,
        prediction,
        setPrediction,
        loading,
        setLoading,
        selectedMapCoords,
        setSelectedMapCoords,
        darkMode,
        toggleDarkMode,
        notificationsOpen,
        setNotificationsOpen,
        profileOpen,
        setProfileOpen,
        locDetecting,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  return useContext(PredictionContext);
}