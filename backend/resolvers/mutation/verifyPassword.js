const userService = require("../../services/userService");

const verifyPassword = async (
  _,
  { email, password }
) => {
  return await userService.verifyPassword(
    email,
    password
  );
};

module.exports = verifyPassword;