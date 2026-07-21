import {
  Wind,
  ShieldCheck,
  RadioTower,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";

import MetricCard from "../ui/MetricCard";

function MetricsGrid() {
  const metrics = [
    {
      title: "Current AQI",
      value: "156",
      unit: "",
      color: "text-orange-500",
      icon: <Wind className="text-orange-500" size={28} />,
      trend: "+12%",
    },
    {
      title: "Air Quality",
      value: "Moderate",
      unit: "",
      color: "text-yellow-500",
      icon: <ShieldCheck className="text-yellow-500" size={28} />,
      trend: "Stable",
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