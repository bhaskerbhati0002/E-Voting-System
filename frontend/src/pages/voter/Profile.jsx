import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $name: String!) {
    updateUser(userId: $userId, name: $name) {
      id
      name
      email
      role
    }
  }
`;

export default function Profile() {
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const storedName = localStorage.getItem("name");
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (role === "ADMIN") navigate("/admin");
    else navigate("/voter");
  };

  const [name, setName] = useState(storedName);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      // Update localStorage
      localStorage.setItem("name", data.updateUser.name);
      setEditing(false);
      setMessage("Profile updated successfully.");
    },
    onError: (err) => {
      setMessage(err.message);
    },
  });

  const handleSave = () => {
    updateUser({
      variables: {
        userId: id,
        name,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
            <p className="text-slate-500 mt-2">Manage your account details</p>
          </div>

          {message && (
            <div className="text-center text-green-600 font-medium">
              {message}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm text-slate-500">Name</label>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="mt-2 text-lg font-semibold text-slate-800">
                  {name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-slate-500">Email</label>
              <p className="mt-2 text-lg font-semibold text-slate-800">
                {email}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">Role</label>
              <p className="mt-2 text-lg font-semibold text-blue-600">{role}</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 pt-6">
            <Button
              variant="secondary"
              onClick={goToDashboard}
              className="px-4 py-2 rounded-xl border border-blue-100 bg-white/70 hover:bg-blue-50 transition"
            >
              ← Back to Dashboard
            </Button>

            <div className="flex gap-4">
              {editing ? (
                <>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
