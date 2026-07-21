import SectionHeader from "../../components/ui/SectionHeader";
import PollutionTrend from "../../components/dashboard/PollutionTrend";
import PollutantChart from "../../components/dashboard/PollutantChart";
import Card from "../../components/ui/Card";

function Analytics() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics"
        subtitle="Analyze historical air quality trends and pollutant distribution."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PollutionTrend />
        <PollutantChart />
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">
          Key Insights
        </h2>

        <ul className="space-y-3 text-slate-600">
          <li>• PM2.5 is the dominant pollutant.</li>
          <li>• AQI peaks during afternoon hours.</li>
          <li>• AI model accuracy is approximately 89%.</li>
          <li>• Pollution trends indicate stable conditions over the next few hours.</li>
        </ul>
      </Card>
    </div>
  );
}

export default Analytics;