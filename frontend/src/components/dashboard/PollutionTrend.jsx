import Card from "../ui/Card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { usePrediction } from "../../context/PredictionContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function PollutionTrend() {
  const { activeLocation, prediction } = usePrediction();

  const city = prediction?.city || activeLocation?.city || "Delhi";
  const baseAqi = prediction ? Math.round(prediction.predictedAQI) : (activeLocation?.aqi || 342);

  // Generate realistic diurnal AQI curve around baseAqi
  const trendValues = [
    Math.round(baseAqi * 0.88),
    Math.round(baseAqi * 1.05),
    Math.round(baseAqi * 1.12),
    baseAqi,
    Math.round(baseAqi * 1.08),
    Math.round(baseAqi * 0.95),
  ];

  const data = {
    labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
    datasets: [
      {
        label: `${city} Hourly AQI`,
        data: trendValues,
        borderColor: baseAqi > 200 ? "#ef4444" : baseAqi > 100 ? "#f59e0b" : "#10b981",
        backgroundColor: baseAqi > 200 ? "rgba(239, 68, 68, 0.15)" : baseAqi > 100 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `AQI: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="h-[420px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Diurnal Pollution Trend
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            24-hour AQI pattern for <strong>{city}</strong>
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Base AQI {baseAqi}
        </span>
      </div>

      <div className="h-[310px]">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}

export default PollutionTrend;