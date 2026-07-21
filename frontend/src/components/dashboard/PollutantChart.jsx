import Card from "../ui/Card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PollutantChart() {
  const data = {
    labels: [
      "PM2.5",
      "PM10",
      "NO₂",
      "SO₂",
      "CO",
      "O₃",
    ],
    datasets: [
      {
        data: [38, 24, 14, 8, 9, 7],
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
          boxWidth: 14,
          padding: 18,
        },
      },
    },
  };

  return (
    <Card className="h-[420px]">
      <h2 className="mb-6 text-xl font-semibold">
        Pollutant Distribution
      </h2>

      <div className="h-[320px]">
        <Doughnut data={data} options={options} />
      </div>
    </Card>
  );
}

export default PollutantChart;