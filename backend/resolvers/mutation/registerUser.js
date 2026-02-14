const userService = require("../../services/userService");

const registerUser = async (_, { input }, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only admin can create candidates");
  }

  return await userService.registerUser(input);
};

module.exports = registerUser;
