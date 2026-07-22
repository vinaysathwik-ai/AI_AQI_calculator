import Card from "../ui/Card";
import AQIGauge from "../ui/AQIGauge";
import { Gauge, Clock3, MapPin } from "lucide-react";
import { usePrediction } from "../../context/PredictionContext";

function AQISummary() {
  const { activeLocation, prediction } = usePrediction();

  // Use prediction if available, else activeLocation
  const currentCity = prediction?.city || activeLocation?.city || "Delhi";
  const currentState = activeLocation?.state || "Delhi NCR";
  const aqi = prediction ? Math.round(prediction.predictedAQI) : (activeLocation?.aqi || 342);
  const category = prediction ? prediction.category : (activeLocation?.category || "Very Poor");

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            AQI Summary
          </h2>
          <Gauge size={24} className="text-teal-500" />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <MapPin size={14} className="text-teal-600" />
          <span>Active Location: <strong>{currentCity}</strong> ({currentState})</span>
        </div>
      </div>

      <div className="my-6 flex flex-col items-center">
        <AQIGauge
          value={aqi}
          category={category}
        />

        <div className="mt-4 rounded-full bg-slate-900 dark:bg-slate-800 text-white px-6 py-2 font-bold text-sm tracking-wide shadow-md">
          {category}
        </div>

        <p className="mt-4 text-center text-xs lg:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Air quality index calculated for <strong>{currentCity}</strong> based on satellite &amp; station sensors.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
        <Clock3 size={14} />
        Updated live from model inference
      </div>
    </Card>
  );
}

export default AQISummary;