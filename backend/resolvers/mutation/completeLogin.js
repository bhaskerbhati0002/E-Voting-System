const userService = require("../../services/userService");

const completeLogin = async (
  _,
  { userId }
) => {
  return await userService.completeLogin(
    userId
  );
};

module.exports = completeLogin;