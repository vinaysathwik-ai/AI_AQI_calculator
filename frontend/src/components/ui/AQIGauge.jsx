function AQIGauge({ value = 0, category = "Good" }) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(value, 500);
  const strokeDashoffset =
    circumference - (progress / 500) * circumference;

  const getColor = () => {
    switch (category) {
      case "Good":
        return "#22c55e";
      case "Satisfactory":
        return "#84cc16";
      case "Moderate":
        return "#eab308";
      case "Poor":
        return "#f97316";
      case "Very Poor":
        return "#ef4444";
      case "Severe":
        return "#7e22ce";
      default:
        return "#06b6d4";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset .8s ease",
          }}
        />
      </svg>

      <div className="-mt-24 text-center">
        <h1 className="text-5xl font-bold">
          {Math.round(value)}
        </h1>

        <p className="mt-2 text-slate-500">
          AQI
        </p>

        <span
          className="inline-block mt-3 rounded-full px-4 py-1 text-white font-medium"
          style={{
            background: getColor(),
          }}
        >
          {category}
        </span>
      </div>
    </div>
  );
}

export default AQIGauge;