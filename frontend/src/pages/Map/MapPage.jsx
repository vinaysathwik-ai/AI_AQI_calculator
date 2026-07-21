import SectionHeader from "../../components/ui/SectionHeader";
import IndiaMapCard from "../../components/dashboard/IndiaMapCard";

function Map() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Air Quality Map"
        subtitle="Monitor AQI across different locations in India."
      />

      <IndiaMapCard />
    </div>
  );
}

export default Map;