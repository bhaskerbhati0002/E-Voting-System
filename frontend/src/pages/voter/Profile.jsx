import Card from "../../components/ui/Card";

export default function Profile() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <div className="flex justify-center animate-fade-in">
      <Card>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          User Profile
        </h2>

        <div className="space-y-4 text-slate-700">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium">{name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="font-medium">{role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
