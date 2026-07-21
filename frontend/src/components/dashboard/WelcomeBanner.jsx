import { Sparkles } from "lucide-react";

function WelcomeBanner() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-500 p-8 text-white shadow-xl">

      {/* Background decoration */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-white/10 blur-lg"></div>

      <div className="relative flex items-center justify-between">

        <div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Sparkles size={16} />
            AI Environmental Intelligence
          </div>

          <h1 className="text-4xl font-bold">
            {greeting},
            <br />
            Welcome to SmartAQI
          </h1>

          <p className="mt-4 max-w-2xl text-cyan-50 text-lg leading-8">
            Monitor air quality, predict pollution trends, and
            make data-driven environmental decisions with AI.
          </p>

        </div>

        <div className="hidden lg:block text-right">

          <div className="text-sm uppercase tracking-widest opacity-80">
            Platform Status
          </div>

          <div className="mt-3 text-5xl font-bold">
            ONLINE
          </div>

          <div className="mt-2 inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold">
            All Services Operational
          </div>

        </div>

      </div>

    </section>
  );
}

export default WelcomeBanner;