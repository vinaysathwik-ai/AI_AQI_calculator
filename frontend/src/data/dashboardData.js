export const dashboardMetrics = [
  {
    id: 1,
    title: "Current AQI",
    value: 156,
    unit: "",
    status: "Moderate",
    trend: "+12%",
    color: "text-orange-500",
  },
  {
    id: 2,
    title: "Air Quality",
    value: "Moderate",
    unit: "",
    status: "Healthy",
    trend: "Stable",
    color: "text-yellow-500",
  },
  {
    id: 3,
    title: "Monitoring Stations",
    value: 942,
    unit: "",
    status: "Online",
    trend: "+24",
    color: "text-cyan-600",
  },
  {
    id: 4,
    title: "Prediction Accuracy",
    value: 89.4,
    unit: "%",
    status: "AI Model",
    trend: "+1.8%",
    color: "text-emerald-600",
  },
];

export const recentPredictions = [
  {
    city: "Delhi",
    aqi: 182,
    category: "Moderate",
    time: "5 min ago",
  },
  {
    city: "Mumbai",
    aqi: 118,
    category: "Moderate",
    time: "12 min ago",
  },
  {
    city: "Bengaluru",
    aqi: 74,
    category: "Satisfactory",
    time: "18 min ago",
  },
];

export const aiInsights = [
  "PM2.5 is the dominant contributor today.",
  "AQI is expected to remain stable for the next 6 hours.",
  "Outdoor activities should be limited for sensitive groups.",
];