import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">
        Admin Dashboard
      </h1>

      <Card>
        <p className="mb-4 text-slate-600">
          Manage candidates and view election results.
        </p>

        <div className="flex gap-4">
          <Button variant="primary">Create Candidate</Button>
          <Button variant="secondary">View Results</Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
