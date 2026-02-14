export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
}) {
  const base =
    "px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform active:scale-95 relative overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:shadow-lg hover:scale-105",
    secondary:
      "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:shadow-md hover:scale-105",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:scale-105",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      <span className="relative z-10">{children}</span>

      {/* Subtle hover glow layer */}
      <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
    </button>
  );
}
