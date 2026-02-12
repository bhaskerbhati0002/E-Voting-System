import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-indigo-400">
        E-Voting System
      </h1>
      <p className="mt-4 text-slate-300">
        Frontend is working successfully 🚀
      </p>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
