import Card from "../ui/Card";
import { usePrediction } from "../../context/PredictionContext";
import { RECOMMENDATIONS } from "../../utils/recommendations";
import AQIGauge from "../ui/AQIGauge";

function PredictionResult() {
  const { prediction } = usePrediction();

  const recommendation = prediction
    ? RECOMMENDATIONS[prediction.category] ||
      "Follow local air quality advisories."
    : "Enter pollutant values and click Predict AQI.";

  return (
    <Card className="h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-8">
        Prediction Result
      </h2>

      <AQIGauge
  value={prediction ? prediction.predictedAQI : 0}
  category={prediction ? prediction.category : "Good"}
/>

      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold">
          {prediction
            ? prediction.category
            : "Waiting for Prediction"}
        </h3>

        <p className="text-slate-500 mt-3">
          {recommendation}
        </p>
      </div>
    </Card>
  );
}

export default PredictionResult;