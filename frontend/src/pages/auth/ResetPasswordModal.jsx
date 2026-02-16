import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const REQUEST_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $email: String!
    $otp: String!
    $newPassword: String!
  ) {
    resetPassword(email: $email, otp: $otp, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export default function ResetPasswordModal({
  open,
  onClose,
  presetEmail = "",
}) {
  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [requestReset, { loading: requesting }] = useMutation(REQUEST_RESET, {
    onCompleted: (data) => {
      setMsg(data.requestPasswordReset.message);
      setStep(2);
    },
    onError: (err) => setMsg(err.message),
  });

  const [resetPassword, { loading: resetting }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      setMsg(data.resetPassword.message);

      // auto close after success
      setTimeout(() => {
        onClose();
      }, 1200);
    },
    onError: (err) => setMsg(err.message),
  });

  if (!open) return null;

  const submitEmail = (e) => {
    e.preventDefault();
    setMsg("");
    requestReset({ variables: { email } });
  };

  const submitOtp = (e) => {
    e.preventDefault();
    setMsg("");
    resetPassword({ variables: { email, otp, newPassword } });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Reset Password
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>

          {msg && (
            <p className="text-sm text-blue-600 font-medium mb-4">{msg}</p>
          )}

          {step === 1 ? (
            <form onSubmit={submitEmail} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white/80 
           shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 
           focus:border-blue-400 transition"
                />
              </div>

              <Button type="submit" disabled={requesting}>
                {requesting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-slate-600">OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white/80 
           shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 
           focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-slate-600">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white/80 
           shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 
           focus:border-blue-400 transition"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setNewPassword("");
                    setMsg("");
                  }}
                >
                  Back
                </Button>

                <Button type="submit" disabled={resetting}>
                  {resetting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
