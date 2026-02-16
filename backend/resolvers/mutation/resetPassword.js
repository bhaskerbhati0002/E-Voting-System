const userService = require("../../services/userService");

const resetPassword = async (_, { email, otp, newPassword }) => {
  return await userService.resetPassword({ email, otp, newPassword });
};

module.exports = resetPassword;
