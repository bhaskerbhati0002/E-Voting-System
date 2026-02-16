import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    voterId: "",
    password: "",
  });

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      const { token, user } = data.registerUser;

      // store auth
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("id", user.id);
      localStorage.setItem("email", user.email);

      // redirect
      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/voter");
    },
  });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    registerUser({
      variables: {
        input: formData,
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-center text-slate-500 mb-6">
          Register to participate in the election
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 w-80">
          <div>
            <label className="block text-sm mb-1 text-slate-600">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-slate-600">Voter ID</label>
            <input
              type="text"
              name="voterId"
              required
              value={formData.voterId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </Button>

          <p className="text-sm text-center text-slate-500 mt-3">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
