import {
  Bell,
  CalendarDays,
  Search,
  Sun,
  UserCircle2,
} from "lucide-react";

function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Urban Air Quality Intelligence
        </h1>

        <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">

          <CalendarDays size={16} />

          {today}

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-11 pr-4 py-3 w-72 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />

        </div>

        {/* AQI Status */}

        <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
          AQI Healthy
        </div>

        {/* Theme */}

        <button className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">
          <Sun size={20} />
        </button>

        {/* Notification */}

        <button className="relative w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">

          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}

        <button className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-2 hover:bg-slate-200 transition">

          <UserCircle2 size={34} />

          <div className="text-left">

            <div className="font-semibold">
              Administrator
            </div>

            <div className="text-xs text-slate-500">
              Smart City Control
            </div>

          </div>

        </button>

      </div>

    </header>
  );
}

export default Topbar;