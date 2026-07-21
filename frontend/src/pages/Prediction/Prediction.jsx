import SectionHeader from "../../components/ui/SectionHeader";
import PredictionForm from "../../components/prediction/PredictionForm";
import PredictionResult from "../../components/prediction/PredictionResult";

function Prediction() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="AQI Prediction"
        subtitle="Predict air quality using our AI-powered XGBoost model."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <PredictionForm />
        </div>

        <div className="xl:col-span-5">
          <PredictionResult />
        </div>
      </div>
    </div>
  );
}

export default Prediction;