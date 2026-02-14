import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      token
      user {
        name
        role
      }
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const { token, user } = data.loginUser;

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser({
      variables: {
        input: formData,
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-6">
          Login to participate in the secure election process
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 w-80">
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
            <label className="block text-sm mb-1 text-slate-600">
              Password
            </label>
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
