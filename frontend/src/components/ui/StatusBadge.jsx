function StatusBadge({
  text,
  color = "bg-teal-100 text-teal-700",
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-4
        py-2
        text-sm
        font-semibold
        ${color}
      `}
    >
      {text}
    </span>
  );
}

export default StatusBadge;