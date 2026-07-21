import Card from "../ui/Card";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const cities = [
  { city: "Delhi", lat: 28.6139, lng: 77.2090, aqi: 182 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777, aqi: 121 },
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946, aqi: 86 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867, aqi: 104 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, aqi: 73 },
];

function getColor(aqi) {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#7e22ce";
}

function getCategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  return "Severe";
}

function IndiaMapCard() {
  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold mb-4">
        India AQI Map
      </h2>

      <div className="overflow-hidden rounded-2xl h-[500px]">
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {cities.map((city) => (
            <CircleMarker
              key={city.city}
              center={[city.lat, city.lng]}
              radius={10}
              pathOptions={{
                color: getColor(city.aqi),
                fillColor: getColor(city.aqi),
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-semibold">{city.city}</h3>
                  <p>
                    AQI: <strong>{city.aqi}</strong>
                  </p>
                  <p>{getCategory(city.aqi)}</p>
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