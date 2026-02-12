const userService = require("../../services/userService");

const loginUser = async (_, { input }) => {
  return await userService.loginUser(input);
};

module.exports = loginUser;
