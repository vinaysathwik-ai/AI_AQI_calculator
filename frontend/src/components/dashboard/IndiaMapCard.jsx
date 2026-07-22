import { useEffect, useState } from "react";
import Card from "../ui/Card";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import api from "../../services/api";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const fallbackCities = [
  { city: "Delhi", lat: 28.6139, lng: 77.2090, aqi: 182 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777, aqi: 121 },
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946, aqi: 86 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867, aqi: 104 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, aqi: 73 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, aqi: 145 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, aqi: 115 },
];

function getColor(aqi) {
  if (aqi <= 50) return "#10b981";      // Good - Emerald
  if (aqi <= 100) return "#84cc16";     // Satisfactory - Lime
  if (aqi <= 200) return "#eab308";     // Moderate - Yellow
  if (aqi <= 300) return "#f97316";     // Poor - Orange
  if (aqi <= 400) return "#ef4444";     // Very Poor - Red
  return "#7e22ce";                      // Severe - Purple
}

function getCategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

function IndiaMapCard() {
  const [gridPoints, setGridPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrid() {
      try {
        const res = await api.get("/api/grid-aqi");
        if (res.data && res.data.length > 0) {
          setGridPoints(res.data);
        } else {
          // Direct fallback to ML service endpoint if Spring Boot proxy is empty
          const directRes = await fetch("http://127.0.0.1:8000/grid-aqi");
          const directData = await directRes.json();
          if (Array.isArray(directData) && directData.length > 0) {
            setGridPoints(directData);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live grid AQI from backend, trying direct FastAPI...", err);
        try {
          const directRes = await fetch("http://127.0.0.1:8000/grid-aqi");
          const directData = await directRes.json();
          if (Array.isArray(directData) && directData.length > 0) {
            setGridPoints(directData);
          }
        } catch (directErr) {
          console.error("Failed to load satellite grid AQI:", directErr);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchGrid();
  }, []);

  return (
    <Card className="h-full">
      <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">
            All-India GeoTIFF Satellite AQI Map
          </h2>
          <p className="text-xs text-slate-500">
            {gridPoints.length > 0
              ? `Displaying ${gridPoints.length.toLocaleString()} satellite grid points sampled from Sentinel-5P`
              : "Loading satellite spatial grid..."}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium sm:mt-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Good (0-50)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">
            <span className="h-2 w-2 rounded-full bg-lime-500"></span> Satisfactory (51-100)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Moderate (101-200)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span> Poor (201-300)
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl h-[520px] relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm text-sm font-medium text-slate-600">
            Loading satellite GeoTIFF spatial grid...
          </div>
        )}

        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Satellite Grid Markers */}
          {gridPoints.map((pt, idx) => (
            <CircleMarker
              key={`grid-${idx}`}
              center={[pt.lat, pt.lon]}
              radius={5}
              pathOptions={{
                color: getColor(pt.aqi),
                fillColor: getColor(pt.aqi),
                fillOpacity: 0.7,
                stroke: false,
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-sm">
                    Grid Coordinate ({pt.lat}°, {pt.lon}°)
                  </div>
                  <div>
                    Predicted AQI: <strong style={{ color: getColor(pt.aqi) }}>{pt.aqi}</strong> ({pt.category || getCategory(pt.aqi)})
                  </div>
                  <div className="border-t border-slate-200 pt-1 mt-1 text-slate-600">
                    <div>CO: {pt.co !== null ? `${pt.co} mg/m³` : "N/A"}</div>
                    <div>NO₂: {pt.no2 !== null ? `${pt.no2} µg/m³` : "N/A"}</div>
                    <div>O₃: {pt.o3 !== null ? `${pt.o3} µg/m³` : "N/A"}</div>
                    <div>SO₂: {pt.so2 !== null ? `${pt.so2} µg/m³` : "N/A"}</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Render Major City Markers for Orientation */}
          {fallbackCities.map((city) => (
            <CircleMarker
              key={`city-${city.city}`}
              center={[city.lat, city.lng]}
              radius={9}
              pathOptions={{
                color: "#1e293b",
                fillColor: getColor(city.aqi),
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <h3 className="font-semibold text-sm">{city.city}</h3>
                  <p>
                    Station AQI: <strong>{city.aqi}</strong> ({getCategory(city.aqi)})
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

export default IndiaMapCard;