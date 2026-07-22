import { useEffect, useState, useRef } from "react";
import Card from "../ui/Card";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  CircleMarker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { Search, MapPin, X, Info, Sparkles, Navigation, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { CITIES } from "../../data/locationsData";
import indiaGeoJson from "../../data/india_boundary.json";
import { usePrediction } from "../../context/PredictionContext";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const GRID_STEP = 0.35;
const HALF_STEP = GRID_STEP / 2; // 0.175

function MapFlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length === 2) {
      map.flyTo(coords, 9, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

function getColor(aqi) {
  if (aqi <= 50) return "#10b981";      // Good - Emerald
  if (aqi <= 100) return "#84cc16";     // Satisfactory - Lime
  if (aqi <= 200) return "#eab308";     // Moderate - Yellow
  if (aqi <= 300) return "#f97316";     // Poor - Orange
  if (aqi <= 400) return "#ef4444";     // Very Poor - Red
  return "#7e22ce";                      // Severe - Purple
}

function IndiaMapCard() {
  const { selectedMapCoords, selectLocation } = usePrediction();
  const [gridPoints, setGridPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatusMsg, setGeoStatusMsg] = useState(null);

  useEffect(() => {
    async function fetchGrid() {
      try {
        const res = await api.get("/api/grid-aqi");
        if (res.data && res.data.length > 0) {
          setGridPoints(res.data);
        } else {
          const directRes = await fetch("http://127.0.0.1:8000/grid-aqi");
          const directData = await directRes.json();
          if (Array.isArray(directData) && directData.length > 0) {
            setGridPoints(directData);
          }
        }
      } catch (err) {
        try {
          const directRes = await fetch("http://127.0.0.1:8000/grid-aqi");
          const directData = await directRes.json();
          if (Array.isArray(directData) && directData.length > 0) {
            setGridPoints(directData);
          }
        } catch (directErr) {
          console.error("Failed to load satellite grid dataset:", directErr);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchGrid();
  }, []);

  const matchingCities = searchQuery.trim()
    ? CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectCity = (city) => {
    selectLocation(city);
    setSearchQuery(city.city);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler for "Use My Location" Geolocation button
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatusMsg({ type: "error", text: "Geolocation is not supported by your browser." });
      return;
    }

    setGeoLoading(true);
    setGeoStatusMsg({ type: "info", text: "Detecting GPS location..." });

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
              const localName = addr.suburb || addr.neighbourhood || addr.city_district || addr.city || fontTown(addr);
              stateName = addr.state || "India";
              if (localName) {
                placeName = `Near ${localName}`;
              }
            }
          } catch (e) {
            console.warn("Reverse geocode failed, using coordinates:", e);
          }

          // 2. Fetch nearest grid point AQI & pollutants from backend
          let aqiData = null;
          try {
            const pRes = await api.get(`/api/point-aqi?lat=${lat}&lon=${lon}`);
            aqiData = pRes.data;
          } catch (e) {
            const directRes = await fetch(`http://127.0.0.1:8000/point-aqi?lat=${lat}&lon=${lon}`);
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
              pm25: aqiData.pm25 || roundVal(aqiData.aqi * 0.55),
              pm10: aqiData.pm10 || roundVal(aqiData.aqi * 0.9),
            };

            selectLocation(userLocObj);
            setGeoStatusMsg({
              type: "success",
              text: `Located: ${placeName} (AQI ${aqiData.aqi} - ${aqiData.category})`,
            });
          }
        } catch (err) {
          console.error("Point AQI lookup error:", err);
          setGeoStatusMsg({ type: "error", text: "Could not fetch AQI for detected location." });
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoStatusMsg({ type: "error", text: "Location access denied. Please allow location permissions in your browser." });
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoStatusMsg({ type: "error", text: "GPS location position is unavailable." });
            break;
          case error.TIMEOUT:
            setGeoStatusMsg({ type: "error", text: "GPS location request timed out." });
            break;
          default:
            setGeoStatusMsg({ type: "error", text: "An unknown location error occurred." });
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              India Boundary Bounded AQI Shading &amp; City Pins
              <Sparkles size={18} className="text-teal-600 dark:text-teal-400" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {gridPoints.length > 0
                ? `Displaying ${gridPoints.length.toLocaleString()} continuous 0.35° spatial cells strictly bounded inside India's land outline`
                : "Loading India satellite spatial grid dataset..."}
            </p>
          </div>

          {/* Action Bar: Geolocation + Search */}
          <div className="flex items-center gap-2">
            {/* Geolocation Button */}
            <button
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              title="Use My GPS Location"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
            >
              <Navigation size={14} className={geoLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Use My Location</span>
            </button>

            {/* Search Input */}
            <div className="relative" ref={searchRef}>
              <div className="relative flex items-center">
                <Search
                  size={15}
                  className="absolute left-3 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="pl-8 pr-7 py-2 w-48 sm:w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Results */}
              {isDropdownOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto z-50 p-1.5">
                  {matchingCities.length > 0 ? (
                    matchingCities.map((c) => (
                      <button
                        key={c.city}
                        onClick={() => handleSelectCity(c)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-xs">
                              {c.city}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {c.state}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold" style={{ color: getColor(c.aqi) }}>
                            AQI {c.aqi}
                          </span>
                          <div className="text-[9px] text-slate-500">{c.category}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                      <Info size={14} /> No matching cities found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Toast Banner for Geolocation */}
        {geoStatusMsg && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition ${
              geoStatusMsg.type === "error"
                ? "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300"
                : geoStatusMsg.type === "success"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{geoStatusMsg.text}</span>
            </div>
            <button onClick={() => setGeoStatusMsg(null)} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Quick Jump City Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Quick Jump:</span>
          {CITIES.slice(0, 7).map((c) => (
            <button
              key={c.city}
              onClick={() => selectLocation(c)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition text-[11px] font-semibold flex items-center gap-1"
            >
              <MapPin size={10} className="text-teal-500" />
              {c.city}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map with Canvas Rendering & India Boundary Overlay */}
      <div className="overflow-hidden rounded-2xl h-[500px] relative border border-slate-200 dark:border-slate-800">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-sm font-medium text-slate-600 dark:text-slate-300">
            Rendering India spatial Canvas cells...
          </div>
        )}

        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          preferCanvas={true}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedMapCoords && <MapFlyTo coords={selectedMapCoords} />}

          {/* Render Official India Geographic Outline Polygon */}
          {indiaGeoJson && (
            <GeoJSON
              data={indiaGeoJson}
              pathOptions={{
                color: "#1e293b",
                weight: 1.8,
                fillOpacity: 0.0,
                dashArray: "4, 4",
              }}
            />
          )}

          {/* Render Edge-to-Edge Filled Rectangles for Continuous Shading inside India */}
          {gridPoints.map((pt, idx) => {
            const bounds = [
              [pt.lat - HALF_STEP, pt.lon - HALF_STEP],
              [pt.lat + HALF_STEP, pt.lon + HALF_STEP],
            ];
            const color = getColor(pt.aqi);

            return (
              <Rectangle
                key={`rect-${idx}`}
                bounds={bounds}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.65,
                  stroke: false,
                  weight: 0,
                }}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-sm">
                      Spatial Cell ({pt.lat}°, {pt.lon}°)
                    </div>
                    <div>
                      Satellite Pollution Index (SPI): <strong>{pt.spi}</strong> ({pt.spi_level})
                    </div>
                    <div>
                      Equivalent AQI: <strong style={{ color: color }}>{pt.aqi}</strong> ({pt.category})
                    </div>
                    <div className="border-t border-slate-200 pt-1 mt-1 text-slate-600">
                      <div>NO₂: {pt.no2} µg/m³</div>
                      <div>CO: {pt.co} mg/m³</div>
                      <div>SO₂: {pt.so2} µg/m³</div>
                      <div>O₃: {pt.o3} µg/m³</div>
                    </div>
                  </div>
                </Popup>
              </Rectangle>
            );
          })}

          {/* Render City Anchors as Small Unobtrusive Pin Icons/Labels */}
          {CITIES.map((city) => (
            <CircleMarker
              key={`city-${city.city}`}
              center={[city.lat, city.lng]}
              radius={4}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#0f172a",
                fillOpacity: 1.0,
                weight: 1.5,
              }}
              eventHandlers={{
                click: () => selectLocation(city),
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <h3 className="font-semibold text-sm">{city.city}, {city.state}</h3>
                  <p>
                    AQI: <strong style={{ color: getColor(city.aqi) }}>{city.aqi}</strong> ({city.category})
                  </p>
                  <p className="text-slate-500">
                    SPI: {city.spi} ({city.spi_level})
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}

function fontTown(addr) {
  return addr.town || addr.village || addr.municipality || addr.county || "";
}

function roundVal(v) {
  return Math.round(v * 10) / 10;
}

export default IndiaMapCard;