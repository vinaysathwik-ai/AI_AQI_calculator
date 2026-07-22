import { useEffect, useState, useRef } from "react";
import Card from "../ui/Card";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { Search, MapPin, X, Info, Sparkles } from "lucide-react";
import api from "../../services/api";
import { CITIES } from "../../data/locationsData";
import { usePrediction } from "../../context/PredictionContext";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

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

  // Map Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

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

  // Filter cities for search autocomplete
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header & Map Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              All-India Satellite Pollution &amp; Station AQI Map
              <Sparkles size={18} className="text-teal-600 dark:text-teal-400" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {gridPoints.length > 0
                ? `Displaying ${gridPoints.length.toLocaleString()} Sentinel-5P Satellite Pollution Index (SPI) grid points across India`
                : "Loading satellite spatial grid dataset..."}
            </p>
          </div>

          {/* Interactive Map Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search city on map (e.g., Delhi, Patna)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="pl-9 pr-8 py-2 w-64 lg:w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
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

        {/* Major City Quick-Jump Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Quick Jump:</span>
          {CITIES.slice(0, 6).map((c) => (
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

      {/* Leaflet Map Container */}
      <div className="overflow-hidden rounded-2xl h-[500px] relative border border-slate-200 dark:border-slate-800">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading satellite spatial grid dataset...
          </div>
        )}

        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Smooth Fly-To effect when a city is searched or selected */}
          {selectedMapCoords && <MapFlyTo coords={selectedMapCoords} />}

          {/* Render Satellite Grid Markers (Satellite Pollution Index - SPI) */}
          {gridPoints.map((pt, idx) => (
            <CircleMarker
              key={`grid-${idx}`}
              center={[pt.lat, pt.lon]}
              radius={4}
              pathOptions={{
                color: getColor(pt.aqi),
                fillColor: getColor(pt.aqi),
                fillOpacity: 0.65,
                stroke: false,
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-sm">
                    Satellite Grid Point ({pt.lat}°, {pt.lon}°)
                  </div>
                  <div>
                    Satellite Pollution Index (SPI): <strong>{pt.spi}</strong> ({pt.spi_level})
                  </div>
                  <div className="border-t border-slate-200 pt-1 mt-1 text-slate-600">
                    <div>NO₂: {pt.no2} µg/m³</div>
                    <div>CO: {pt.co} mg/m³</div>
                    <div>SO₂: {pt.so2} µg/m³</div>
                    <div>O₃: {pt.o3} µg/m³</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Render Major City Station Anchors */}
          {CITIES.map((city) => (
            <CircleMarker
              key={`city-${city.city}`}
              center={[city.lat, city.lng]}
              radius={9}
              pathOptions={{
                color: "#0f172a",
                fillColor: getColor(city.aqi),
                fillOpacity: 0.95,
                weight: 2,
              }}
              eventHandlers={{
                click: () => selectLocation(city),
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <h3 className="font-semibold text-sm">{city.city}, {city.state}</h3>
                  <p>
                    Ground Station AQI: <strong style={{ color: getColor(city.aqi) }}>{city.aqi}</strong> ({city.category})
                  </p>
                  <div className="border-t border-slate-200 pt-1 mt-1 text-slate-600">
                    <div>PM2.5: {city.pm25} µg/m³</div>
                    <div>PM10: {city.pm10} µg/m³</div>
                    <div>NO₂: {city.no2} µg/m³ | CO: {city.co} mg/m³</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}

export default IndiaMapCard;