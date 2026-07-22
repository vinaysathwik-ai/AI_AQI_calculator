import { useEffect, useState } from "react";
import {
  Wind,
  ShieldCheck,
  RadioTower,
  BrainCircuit,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import MetricCard from "../ui/MetricCard";
import api from "../../services/api";
import { usePrediction } from "../../context/PredictionContext";

function categoryColor(category) {
  const map = {
    Good: "text-emerald-600 dark:text-emerald-400",
    Satisfactory: "text-lime-600 dark:text-lime-400",
    Moderate: "text-amber-500 dark:text-amber-400",
    Poor: "text-orange-500 dark:text-orange-400",
    "Very Poor": "text-red-600 dark:text-red-400",
    Severe: "text-purple-600 dark:text-purple-400",
  };
  return map[category] ?? "text-slate-600";
}

function MetricsGrid() {
  const { activeLocation, prediction } = usePrediction();

  // Use prediction if available, else activeLocation
  const currentCity = prediction?.city || activeLocation?.city || "Delhi";
  const aqiValue = prediction ? Math.round(prediction.predictedAQI) : (activeLocation?.aqi || 342);
  const aqiCategory = prediction ? prediction.category : (activeLocation?.category || "Very Poor");
  const aqiColor = categoryColor(aqiCategory);

  const metrics = [
    {
      title: `${currentCity} AQI`,
      value: String(aqiValue),
      unit: "",
      color: aqiColor,
      icon: <Wind className={aqiColor} size={28} />,
      trend: "Live",
    },
    {
      title: "Air Quality Status",
      value: aqiCategory,
      unit: "",
      color: aqiColor,
      icon: <ShieldCheck className={aqiColor} size={28} />,
      trend: "CPCB Standard",
    },
    {
      title: "Satellite Grid Points",
      value: "2,608",
      unit: "pts",
      color: "text-cyan-600 dark:text-cyan-400",
      icon: <RadioTower className="text-cyan-600 dark:text-cyan-400" size={28} />,
      trend: "Sentinel-5P",
    },
    {
      title: "Prediction Accuracy",
      value: "91.8",
      unit: "%",
      color: "text-emerald-600 dark:text-emerald-400",
      icon: <BrainCircuit className="text-emerald-600 dark:text-emerald-400" size={28} />,
      trend: "XGBoost ML",
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

          <div className="absolute bottom-6 right-6 flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={14} />
            {metric.trend}
          </div>
        </div>
      ))}
    </section>
  );
}

export default MetricsGrid;