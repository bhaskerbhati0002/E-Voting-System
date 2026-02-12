import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function VoterDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">
        Voter Dashboard
      </h1>

      <Card>
        <p className="mb-4 text-slate-600">
          Cast your vote carefully. You can vote only once.
        </p>

        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
