import { useEffect, useState } from "react";
import {
  Wind,
  ShieldCheck,
  RadioTower,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";

import MetricCard from "../ui/MetricCard";
import api from "../../services/api";

// Derive colour classes from CPCB AQI category
function categoryColor(category) {
  const map = {
    Good: "text-emerald-600",
    Satisfactory: "text-green-500",
    Moderate: "text-yellow-500",
    Poor: "text-orange-500",
    "Very Poor": "text-red-500",
    Severe: "text-purple-600",
  };
  return map[category] ?? "text-slate-600";
}

function MetricsGrid() {
  // Live values from /api/predictions/recent
  const [liveAQI, setLiveAQI] = useState(null);
  const [liveCategory, setLiveCategory] = useState(null);
  const [totalPredictions, setTotalPredictions] = useState(null);

  useEffect(() => {
    api
      .get("/api/predictions/recent")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setLiveAQI(Math.round(latest.predictedAQI));
          setLiveCategory(latest.category);
          setTotalPredictions(res.data.length);
        }
      })
      .catch(() => {
        // Silently fall back to defaults if backend is offline
      });
  }, []);

  const aqiValue = liveAQI !== null ? String(liveAQI) : "—";
  const aqiCategory = liveCategory ?? "Moderate";
  const aqiColor = categoryColor(aqiCategory);

  const metrics = [
    {
      title: "Current AQI",
      value: aqiValue,
      unit: "",
      color: aqiColor,
      icon: <Wind className={aqiColor} size={28} />,
      trend: "Live",
    },
    {
      title: "Air Quality",
      value: aqiCategory,
      unit: "",
      color: aqiColor,
      icon: <ShieldCheck className={aqiColor} size={28} />,
      trend: "Latest",
    },
    {
      title: "Monitoring Stations",
      value: "942",
      unit: "",
      color: "text-cyan-600",
      icon: <RadioTower className="text-cyan-600" size={28} />,
      trend: "+24",
    },
    {
      title: "Prediction Accuracy",
      value: "89.4",
      unit: "%",
      color: "text-emerald-600",
      icon: <BrainCircuit className="text-emerald-600" size={28} />,
      trend: "+1.8%",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.title} className="relative">
          <MetricCard
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            color={metric.color}
          />

          <div className="absolute bottom-6 right-6 flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight size={14} />
            {metric.trend}
          </div>
        </div>
      ))}
    </section>
  );
}

export default MetricsGrid;