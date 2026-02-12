import logo from "../../assets/logo.svg";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={logo} alt="E-Voting Logo" className="h-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
