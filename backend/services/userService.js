const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/mailer");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, user };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, user };
};

const getVoters = async () => {
  return await User.find({ role: "VOTER" });
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(userId);

  return "User deleted successfully";
};

const updateUser = async (userId, name) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.name = name;
  await user.save();

  return user;
};

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  // Always respond success to prevent email enumeration
  if (!user) {
    return {
      success: true,
      message: "If the account exists, an OTP has been sent.",
    };
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.resetOtpHash = otpHash;
  user.resetOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await user.save();

  await sendOtpEmail({ to: email, otp });

  return {
    success: true,
    message: "If the account exists, an OTP has been sent.",
  };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  if (new Date() > user.resetOtpExpiresAt) {
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    await user.save();
    throw new Error("Invalid or expired OTP");
  }

  const ok = await bcrypt.compare(otp, user.resetOtpHash);
  if (!ok) {
    throw new Error("Invalid or expired OTP");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  // clear OTP
  user.resetOtpHash = null;
  user.resetOtpExpiresAt = null;

  await user.save();

  return { success: true, message: "Password reset successful. Please login." };
};

module.exports = {
  registerUser,
  loginUser,
  getVoters,
  deleteUser,
  updateUser,
  requestPasswordReset,
  resetPassword,
};
