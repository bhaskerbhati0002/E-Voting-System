const userService = require("../../services/userService");

const registerUser = async (_, { input }) => {
  return await userService.registerUser(input);
};

module.exports = registerUser;
