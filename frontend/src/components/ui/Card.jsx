export default function Card({ children }) {
  return (
    <div className="relative bg-white/80 backdrop-blur-2xl 
                    shadow-xl rounded-3xl p-8 
                    border border-white/50 
                    transition-all duration-300 
                    hover:shadow-2xl hover:-translate-y-2">

      {/* Soft blue glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/5 to-sky-400/5 blur-xl -z-10"></div>

      {children}
    </div>
  );
}
