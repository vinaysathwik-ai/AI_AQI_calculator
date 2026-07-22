import { useState } from "react";
import Card from "../ui/Card";
import { POLLUTANTS } from "../../utils/constants";
import api from "../../services/api";
import { usePrediction } from "../../context/PredictionContext";
import { Sparkles, RefreshCw } from "lucide-react";

const PRESETS = [
  {
    name: "Delhi (Severe / High)",
    values: {
      PM25: 195.0,
      PM10: 310.0,
      NO: 45.0,
      NO2: 85.0,
      NOx: 65.0,
      NH3: 28.0,
      CO: 3.2,
      SO2: 24.0,
      O3: 45.0,
      Benzene: 4.5,
      Toluene: 12.0,
      Xylene: 3.2,
    },
  },
  {
    name: "Mumbai (Moderate)",
    values: {
      PM25: 58.0,
      PM10: 105.0,
      NO: 18.0,
      NO2: 38.0,
      NOx: 28.0,
      NH3: 12.0,
      CO: 1.4,
      SO2: 14.0,
      O3: 32.0,
      Benzene: 1.2,
      Toluene: 4.0,
      Xylene: 1.1,
    },
  },
  {
    name: "Bengaluru (Satisfactory)",
    values: {
      PM25: 22.0,
      PM10: 48.0,
      NO: 8.0,
      NO2: 18.0,
      NOx: 14.0,
      NH3: 6.0,
      CO: 0.6,
      SO2: 8.0,
      O3: 28.0,
      Benzene: 0.4,
      Toluene: 1.5,
      Xylene: 0.3,
    },
  },
  {
    name: "Clean Mountain Air (Good)",
    values: {
      PM25: 9.0,
      PM10: 18.0,
      NO: 2.0,
      NO2: 6.0,
      NOx: 4.0,
      NH3: 2.0,
      CO: 0.2,
      SO2: 3.0,
      O3: 20.0,
      Benzene: 0.1,
      Toluene: 0.2,
      Xylene: 0.1,
    },
  },
];

function PredictionForm() {
  const { setPrediction, loading, setLoading } = usePrediction();

  const initialFormData = Object.fromEntries(
    POLLUTANTS.map((pollutant) => [pollutant.key, ""])
  );

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loadPreset = (presetValues) => {
    const stringified = Object.fromEntries(
      Object.entries(presetValues).map(([k, v]) => [k, String(v)])
    );
    setFormData(stringified);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const requestData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      const response = await api.post("/api/predict", requestData);

      setPrediction(response.data);
    } catch (error) {
      console.error(error);
      alert("Prediction failed. Ensure FastAPI & Spring Boot backend services are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Air Quality Parameters
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter 12 pollutant parameters or quick-load a preset below
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormData(initialFormData)}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 font-semibold"
        >
          <RefreshCw size={12} /> Clear Form
        </button>
      </div>

      {/* Quick Load Presets */}
      <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
          Quick Presets (1-Click Fill):
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => loadPreset(preset.values)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 text-xs font-semibold text-slate-800 dark:text-slate-200 transition shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {POLLUTANTS.map((pollutant) => (
          <div key={pollutant.key}>
            <label className="block mb-2 font-medium text-xs text-slate-700 dark:text-slate-300">
              {pollutant.label}
            </label>

            <input
              type="number"
              step="any"
              name={pollutant.key}
              placeholder={pollutant.placeholder}
              value={formData[pollutant.key]}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 text-sm transition"
            />
          </div>
        ))}

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 py-3.5 font-bold text-white transition disabled:opacity-50 shadow-lg text-sm"
          >
            {loading ? "Calculating XGBoost Prediction..." : "Predict Official CPCB AQI"}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default PredictionForm;