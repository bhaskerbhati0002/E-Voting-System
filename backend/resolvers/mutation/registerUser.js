const userService = require("../../services/userService");

const registerUser = async (_, { input }, { user }) => {
  return await userService.registerUser(input);
};

module.exports = registerUser;
