const userService = require("../../services/userService");

const requestPasswordReset = async (_, { email }) => {
  return await userService.requestPasswordReset(email);
};

module.exports = requestPasswordReset;
