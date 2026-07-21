import SectionHeader from "../../components/ui/SectionHeader";
import Card from "../../components/ui/Card";

function About() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="About SmartAQI"
        subtitle="AI-powered Air Quality Prediction and Monitoring Platform"
      />

      <Card>
        <h2 className="text-2xl font-bold mb-4">
          Project Overview
        </h2>

        <p className="text-slate-600 leading-8">
          SmartAQI is an intelligent air quality monitoring platform that
          predicts the Air Quality Index (AQI) using an XGBoost machine
          learning model. The platform helps users understand pollution
          levels, visualize environmental trends, and make informed health
          decisions.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">
          Technology Stack
        </h2>

        <ul className="space-y-2 text-slate-600">
          <li>• React + Vite</li>
          <li>• Tailwind CSS</li>
          <li>• Spring Boot REST API</li>
          <li>• FastAPI ML Service</li>
          <li>• XGBoost Machine Learning Model</li>
          <li>• Chart.js</li>
          <li>• React Leaflet</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">
          Features
        </h2>

        <ul className="space-y-2 text-slate-600">
          <li>• Real-time AQI Prediction</li>
          <li>• Interactive Dashboard</li>
          <li>• Air Pollution Analytics</li>
          <li>• AI-based Health Recommendations</li>
          <li>• Interactive India AQI Map</li>
        </ul>
      </Card>
    </div>
  );
}

export default About;