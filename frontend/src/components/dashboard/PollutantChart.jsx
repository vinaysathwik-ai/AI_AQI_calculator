import Card from "../ui/Card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { usePrediction } from "../../context/PredictionContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PollutantChart() {
  const { activeLocation, prediction } = usePrediction();

  const city = prediction?.city || activeLocation?.city || "Delhi";
  const pm25 = prediction?.pm25 || activeLocation?.pm25 || 195.0;
  const pm10 = prediction?.pm10 || activeLocation?.pm10 || 310.0;
  const no2 = prediction?.no2 || activeLocation?.no2 || 85.0;
  const so2 = prediction?.so2 || activeLocation?.so2 || 24.0;
  const co = (prediction?.co || activeLocation?.co || 3.2) * 10; // Scale for chart
  const o3 = prediction?.o3 || activeLocation?.o3 || 45.0;

  const data = {
    labels: [
      "PM2.5",
      "PM10",
      "NO₂",
      "SO₂",
      "CO (scaled)",
      "O₃",
    ],
    datasets: [
      {
        data: [
          Math.round(pm25),
          Math.round(pm10),
          Math.round(no2),
          Math.round(so2),
          Math.round(co),
          Math.round(o3),
        ],
        backgroundColor: [
          "#06b6d4",
          "#3b82f6",
          "#22c55e",
          "#facc15",
          "#f97316",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 14,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} µg/m³`,
        },
      },
    },
  };

  return (
    <Card className="h-[420px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Pollutant Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Relative concentration breakdown for <strong>{city}</strong>
          </p>
        </div>
      </div>

      <div className="h-[310px]">
        <Doughnut data={data} options={options} />
      </div>
    </Card>
  );
}

export default PollutantChart;