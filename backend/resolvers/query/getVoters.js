const userService = require("../../services/userService");

const getVoters = async (_, __, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only admin can access voter list");
  }

  return await userService.getVoters();
};

module.exports = getVoters;