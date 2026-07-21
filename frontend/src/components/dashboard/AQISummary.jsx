import Card from "../ui/Card";
import AQIGauge from "../ui/AQIGauge";
import { Gauge, Clock3 } from "lucide-react";
import { usePrediction } from "../../context/PredictionContext";

function AQISummary() {
  const { prediction } = usePrediction();

  const aqi = prediction ? Math.round(prediction.predictedAQI) : 156;
  const category = prediction ? prediction.category : "Moderate";

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          AQI Summary
        </h2>

        <Gauge size={24} className="text-teal-500" />
      </div>

      <div className="mt-8 flex flex-col items-center">
        <AQIGauge
          value={aqi}
          category={category}
        />

        <div className="mt-6 rounded-full bg-teal-500 px-5 py-2 font-semibold text-white">
          {category}
        </div>

        <p className="mt-6 text-center text-slate-600 leading-7">
          Current air quality based on the latest prediction.
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
          <Clock3 size={16} />
          Updated just now
        </div>
      </div>
    </Card>
  );
}

export default AQISummary;