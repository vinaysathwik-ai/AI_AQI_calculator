import Card from "../ui/Card";
import {
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  HeartPulse,
} from "lucide-react";
import { usePrediction } from "../../context/PredictionContext";

function getHealthAdvice(category, city) {
  switch (category) {
    case "Good":
      return {
        insights: [
          `Air quality in ${city} is excellent. Perfect for outdoor exercises and morning runs.`,
          "Ventilation conditions are optimal. Indoor air filters are not required today.",
          "Minimal pollution risk for all age groups including infants and elderly.",
        ],
        assessmentTitle: "Optimal Health Conditions",
        assessmentBg: "from-emerald-600 to-teal-600",
        assessmentText: `Air quality in ${city} is clean and fresh. No health precautions needed for outdoor activities.`,
      };
    case "Satisfactory":
      return {
        insights: [
          `Air quality in ${city} is satisfactory. Minor risk for unusually sensitive individuals.`,
          "PM2.5 concentrations are within permissible national standards.",
          "Ideal time for routine daily commute and open-air activities.",
        ],
        assessmentTitle: "Satisfactory Air Quality",
        assessmentBg: "from-lime-600 to-emerald-600",
        assessmentText: `Air pollution levels in ${city} are acceptable. Sensitive individuals with asthma should keep medication handy.`,
      };
    case "Moderate":
      return {
        insights: [
          `Moderate pollution in ${city}. May cause breathing discomfort to people with lung/heart disease.`,
          "PM2.5 is elevated during peak morning and evening traffic hours.",
          "Consider using air purifiers in closed rooms if sensitive.",
        ],
        assessmentTitle: "Moderate Air Advisory",
        assessmentBg: "from-amber-600 to-orange-600",
        assessmentText: `AQI in ${city} is Moderate. Children and elderly should avoid prolonged heavy outdoor exertion during evening hours.`,
      };
    case "Poor":
      return {
        insights: [
          `Poor air quality detected in ${city}. Breathing discomfort expected on prolonged exposure.`,
          "Particulate matter (PM2.5/PM10) exceeds WHO recommended guidelines.",
          "Keep windows closed during peak congestion hours.",
        ],
        assessmentTitle: "Poor Air Quality Alert",
        assessmentBg: "from-orange-600 to-red-600",
        assessmentText: `Air pollution in ${city} is Poor. Wear anti-pollution (N95) masks when commuting near main highways or industrial areas.`,
      };
    case "Very Poor":
    case "Severe":
      return {
        insights: [
          `CRITICAL ALERT: ${city} is experiencing ${category} air pollution!`,
          "Prolonged exposure can lead to respiratory illness and cardiovascular stress.",
          "Avoid all non-essential outdoor physical activity.",
        ],
        assessmentTitle: "Severe Health Risk Assessment",
        assessmentBg: "from-red-700 to-purple-800",
        assessmentText: `HIGH ALERT in ${city}: AQI is in the ${category} category. Vulnerable groups must remain indoors. Use HEPA air purifiers inside home and office spaces.`,
      };
    default:
      return {
        insights: [
          "PM2.5 is the dominant pollutant observed in urban regions.",
          "Monitor real-time AQI updates throughout the day.",
          "Limit outdoor activities during heavy traffic hours.",
        ],
        assessmentTitle: "General Advisory",
        assessmentBg: "from-cyan-600 to-teal-600",
        assessmentText: "Air quality varies throughout the day. Follow local environmental health advisories.",
      };
  }
}

function AIRecommendations() {
  const { activeLocation, prediction } = usePrediction();

  const city = prediction?.city || activeLocation?.city || "Delhi";
  const category = prediction ? prediction.category : (activeLocation?.category || "Very Poor");
  const advice = getHealthAdvice(category, city);

  const icons = [
    <BrainCircuit key="1" size={22} className="text-cyan-600 dark:text-cyan-400" />,
    <HeartPulse key="2" size={22} className="text-emerald-600 dark:text-emerald-400" />,
    <AlertTriangle key="3" size={22} className="text-amber-500" />,
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI Health &amp; Environmental Advice
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized recommendations for <strong>{city}</strong> ({category})
            </p>
          </div>
          <Sparkles className="text-teal-600 dark:text-teal-400" size={26} />
        </div>

        <div className="space-y-3">
          {advice.insights.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300"
            >
              <div className="mt-0.5">{icons[index % icons.length]}</div>
              <p className="text-slate-700 dark:text-slate-300 text-xs lg:text-sm leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 rounded-2xl bg-gradient-to-r ${advice.assessmentBg} p-5 text-white shadow-lg`}>
        <h3 className="font-bold text-base flex items-center gap-2">
          <ShieldAlert size={20} />
          {advice.assessmentTitle}
        </h3>
        <p className="mt-2 text-xs lg:text-sm text-white/95 leading-relaxed">
          {advice.assessmentText}
        </p>
      </div>
    </Card>
  );
}

export default AIRecommendations;