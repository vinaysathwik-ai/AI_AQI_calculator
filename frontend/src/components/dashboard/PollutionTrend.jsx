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
  const data = {
    labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
    datasets: [
      {
        label: "AQI",
        data: [82, 105, 128, 156, 143, 120],
        borderColor: "#0891b2",
        backgroundColor: "rgba(8,145,178,0.15)",
        fill: true,
        tension: 0.4,
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
    },
  };

  return (
    <Card className="h-[420px]">
      <h2 className="mb-6 text-xl font-semibold">
        Pollution Trend
      </h2>

      <div className="h-[320px]">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}

export default PollutionTrend;