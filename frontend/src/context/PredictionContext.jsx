import { createContext, useContext, useState, useEffect } from "react";
import { CITIES } from "../data/locationsData";

const PredictionContext = createContext();

export function PredictionProvider({ children }) {
  const [activeLocation, setActiveLocation] = useState(CITIES[0]); // Default Delhi
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMapCoords, setSelectedMapCoords] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    // Synthesize initial prediction object from city standard values
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
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  return useContext(PredictionContext);
}