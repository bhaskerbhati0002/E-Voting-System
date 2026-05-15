import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ResetPasswordModal from "./ResetPasswordModal";
import FaceVerification from "../../components/FaceVerification";

const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
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

const VERIFY_PASSWORD = gql`
  mutation VerifyPassword($email: String!, $password: String!) {
    verifyPassword(email: $email, password: $password) {
      success
      userId
      role
      faceDescriptor
    }
  }
`;

const COMPLETE_LOGIN = gql`
  mutation CompleteLogin($userId: ID!) {
    completeLogin(userId: $userId) {
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

export default function Login() {
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [storedDescriptor, setStoredDescriptor] = useState([]);
  const [tempUserId, setTempUserId] = useState("");

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const { token, user } = data.loginUser;

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("id", user.id);
      localStorage.setItem("email", user.email);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }
    },
  });

  const [verifyPasswordMutation] = useMutation(VERIFY_PASSWORD);
  const [completeLoginMutation] = useMutation(COMPLETE_LOGIN);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await verifyPasswordMutation({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
      const response = data.verifyPassword;
      const role = response.role;
      setStoredDescriptor(response.faceDescriptor);
      setTempUserId(response.userId);

      // ADMIN LOGIN
      if (role === "ADMIN") {
        const loginResponse = await completeLoginMutation({
          variables: {
            userId: response.userId,
          },
        });
        const { token, user } = loginResponse.data.completeLogin;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        window.location.href = "/admin";
        return;
      }

      // VOTER LOGIN
      setShowFaceVerification(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFaceVerified = async () => {
    try {
      const { data } = await completeLoginMutation({
        variables: {
          userId: tempUserId,
        },
      });
      const { token, user } = data.completeLogin;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      window.location.href = user.role === "ADMIN" ? "/admin" : "/voter";
    } catch (error) {
      alert(error.message);
    }
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

        {showFaceVerification && (
          <FaceVerification
            storedDescriptor={storedDescriptor}
            onVerified={handleFaceVerified}
          />
        )}

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
          <p className="text-sm text-center text-slate-500 mt-3">
            Forgot password?{" "}
            <Link
              type="button"
              onClick={() => setShowReset(true)}
              className="text-blue-600 font-medium hover:underline"
            >
              Reset here
            </Link>
          </p>
          <p className="text-sm text-center text-slate-500 mt-3">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </Card>
      <ResetPasswordModal
        open={showReset}
        onClose={() => setShowReset(false)}
      />
    </div>
  );
}
