import Card from "./Card";

function MetricCard({
  title,
  value,
  unit,
  icon,
  color = "text-teal-600",
}) {
  return (
  <Card
    className="
      group
      cursor-pointer
      relative
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-2xl
    "
  >
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100 opacity-40 transition-all duration-500 group-hover:scale-150"></div>

    <div className="relative flex justify-between items-start">

      <div>

        <p className="text-slate-500 text-sm font-medium">
          {title}
        </p>

        <h2 className={`mt-4 text-4xl font-bold ${color}`}>
          {value}

          {unit && (
            <span className="ml-2 text-lg text-slate-400">
              {unit}
            </span>
          )}
        </h2>

      </div>

      <div className="
        h-16
        w-16
        rounded-2xl
        bg-slate-100
        flex
        items-center
        justify-center
        transition-all
        duration-300
        group-hover:rotate-6
        group-hover:scale-110
      ">
        {icon}
      </div>

    </div>

  </Card>
);
}

export default MetricCard;