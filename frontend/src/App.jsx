import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VoterDashboard from "./pages/voter/VoterDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voter"
          element={
            <ProtectedRoute allowedRole="VOTER">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
