import { useState } from "react";
import Card from "../ui/Card";
import { POLLUTANTS } from "../../utils/constants";
import api from "../../services/api";
import { usePrediction } from "../../context/PredictionContext";

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
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        Air Quality Parameters
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {POLLUTANTS.map((pollutant) => (
          <div key={pollutant.key}>
            <label className="block mb-2 font-medium">
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict AQI"}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default PredictionForm;