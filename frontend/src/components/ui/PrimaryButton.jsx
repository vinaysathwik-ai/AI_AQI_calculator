function PrimaryButton({
  children,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        rounded-2xl
        bg-gradient-to-r
        from-teal-600
        to-cyan-500
        px-6
        py-3
        text-white
        font-semibold
        shadow-lg
        hover:scale-105
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      {children}
    </button>
  );
}

export default PrimaryButton;