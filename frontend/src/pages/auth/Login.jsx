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
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login to E-Voting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-80">

          <div>
            <label className="block text-sm mb-1 text-slate-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error.message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
