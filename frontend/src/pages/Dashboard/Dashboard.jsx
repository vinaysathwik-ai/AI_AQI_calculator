import SectionHeader from "../../components/ui/SectionHeader";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import MetricsGrid from "../../components/dashboard/MetricsGrid";
import IndiaMapCard from "../../components/dashboard/IndiaMapCard";
import AQISummary from "../../components/dashboard/AQISummary";
import PollutionTrend from "../../components/dashboard/PollutionTrend";
import PollutantChart from "../../components/dashboard/PollutantChart";
import RecentPredictions from "../../components/dashboard/RecentPredictions";
import AIRecommendations from "../../components/dashboard/AIRecommendations";

function Dashboard() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Urban Air Quality Intelligence Dashboard"
        subtitle="Real-time environmental monitoring and AI-powered insights."
      />

      <WelcomeBanner />

      <MetricsGrid />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <IndiaMapCard />
        </div>

        <div className="xl:col-span-4">
          <AQISummary />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PollutionTrend />

        <PollutantChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentPredictions />

        <AIRecommendations />
      </div>
    </div>
  );
}

export default Dashboard;