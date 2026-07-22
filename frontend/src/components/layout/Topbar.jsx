import {
  CalendarDays,
  Sun,
  Moon,
  UserCircle2,
  MapPin,
} from "lucide-react";
import { usePrediction } from "../../context/PredictionContext";

function getAqiBadgeStyle(category) {
  switch (category) {
    case "Good":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300";
    case "Satisfactory":
      return "bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-950 dark:text-lime-300";
    case "Moderate":
      return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300";
    case "Poor":
      return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300";
    case "Very Poor":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300";
    case "Severe":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}

function Topbar() {
  const {
    activeLocation,
    darkMode,
    toggleDarkMode,
  } = usePrediction();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between transition-colors z-20 relative">
      {/* Left: Title & Date */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Urban Air Quality Intelligence
        </h1>
        <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-xs lg:text-sm">
          <CalendarDays size={15} />
          <span>{today}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <MapPin size={13} /> {activeLocation.city}, {activeLocation.state}
          </span>
        </div>
      </div>

      {/* Right: Dynamic AQI Status, Dark Mode Toggle, Profile */}
      <div className="flex items-center gap-4">
        {/* Dynamic AQI Status Pill (Wired to Active Location) */}
        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${getAqiBadgeStyle(
            activeLocation.category
          )}`}
        >
          <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>
          <span>
            {activeLocation.city}: AQI {activeLocation.aqi} ({activeLocation.category})
          </span>
        </div>

        {/* Working Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
        >
          {darkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
        </button>

        {/* Profile Badge */}
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5">
          <UserCircle2 size={28} className="text-teal-600 dark:text-teal-400" />
          <div className="text-left hidden md:block">
            <div className="font-semibold text-xs text-slate-900 dark:text-white">
              Admin Officer
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Smart City Control
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;