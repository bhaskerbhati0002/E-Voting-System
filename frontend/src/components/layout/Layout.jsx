import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    setOpen(false);
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-100 via-white to-sky-200"></div>

      {/* Soft Animated Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse -z-10"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-sky-300 rounded-full blur-3xl opacity-20 animate-pulse -z-10"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* 🔥 Floating Glass Header */}
      <header className="sticky top-4 z-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative flex items-center justify-between px-6 py-4 rounded-2xl 
                          bg-white/60 backdrop-blur-2xl 
                          border border-white/40 
                          shadow-lg transition-all duration-300 
                          hover:shadow-xl hover:-translate-y-1"
          >
            {/* Soft Glow Behind Header */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 via-transparent to-sky-400/10 blur-xl -z-10"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <img
                src={logo}
                alt="E-Voting Logo"
                className="h-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-800 tracking-wide">
                  E-Voting System
                </h1>
                <p className="text-xs text-slate-500">
                  Secure Digital Election Platform
                </p>
              </div>
            </div>

            {/* Decorative Pulse Indicator */}
            {token ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 cursor-pointer 
                 bg-white/70 backdrop-blur-lg 
                 px-4 py-2 rounded-xl 
                 border border-blue-100 
                 shadow-md hover:shadow-lg 
                 transition-all duration-300"
                >
                  {/* Green Active Indicator */}
                  <div className="relative flex items-center">
                    <span className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">
                      {name}
                    </p>

                    {/* Light Blue Role */}
                    <p className="text-xs font-medium text-blue-500 tracking-wide">
                      {role}
                    </p>
                  </div>
                </div>

                {open && (
                  <div
                    className="absolute right-0 mt-3 w-48 
                      bg-white/95 backdrop-blur-2xl 
                      border border-blue-100 
                      shadow-2xl rounded-xl 
                      overflow-hidden 
                      animate-fade-in z-50"
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 
                     hover:bg-blue-50 transition"
                    >
                      👤 Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 
                     hover:bg-red-50 text-red-600 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                <span className="relative w-2 h-2 rounded-full bg-green-500"></span>
                <span className="ml-2 font-medium">System Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {children}
      </main>
    </div>
  );
}
